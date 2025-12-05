package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"log/slog"

	connectcors "connectrpc.com/cors"
	"github.com/lmittmann/tint"
	_ "github.com/mattn/go-sqlite3"
	"github.com/pyrecycleheat/backend/internal/config"
	"github.com/pyrecycleheat/backend/internal/database"
	"github.com/pyrecycleheat/backend/internal/migrations"
	"github.com/pyrecycleheat/backend/internal/observability"
	"github.com/pyrecycleheat/backend/internal/router"
	"github.com/rs/cors"
	_ "go.uber.org/automaxprocs"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	// Setup logger with tint for dev
	var logger *slog.Logger
	if cfg.Observ.EnableDevLogging {
		logger = slog.New(tint.NewHandler(os.Stdout, &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: time.Kitchen,
		}))
	} else {
		logger = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelInfo,
		}))
	}
	slog.SetDefault(logger)

	logger.Info("starting pyrecycleheat backend", "version", cfg.Observ.ServiceVersion)

	// Setup observability
	ctx := context.Background()
	if cfg.Observ.EnableOTEL || cfg.Observ.EnableMetrics {
		shutdownOtel, err := observability.Setup(ctx, cfg.Observ.ServiceName, cfg.Observ.ServiceVersion)
		if err != nil {
			log.Fatalf("setup observability: %v", err)
		}
		defer func() {
			if err := shutdownOtel(ctx); err != nil {
				logger.Error("shutdown observability", "error", err)
			}
		}()
		logger.Info("observability initialized")
	}

	// Start metrics server
	if cfg.Observ.EnableMetrics {
		metricsSrv := observability.StartMetricsServer(cfg.Observ.MetricsAddr, logger)
		defer func() {
			shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			if err := metricsSrv.Shutdown(shutdownCtx); err != nil {
				logger.Error("metrics server shutdown", "error", err)
			}
		}()
	}

	// Open database
	sqlDB, err := sql.Open("sqlite3", cfg.Database.DSN)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer sqlDB.Close()

	sqlDB.SetMaxOpenConns(cfg.Database.MaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.Database.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(cfg.Database.ConnMaxLifetime)

	// Run migrations
	if cfg.Migrations.AutoRun {
		if err := migrations.Run(sqlDB, logger); err != nil {
			log.Fatalf("run migrations: %v", err)
		}
	}

	// Prepare queries
	ctxDB, cancelDB := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelDB()

	queries, err := database.Prepare(ctxDB, sqlDB)
	if err != nil {
		log.Fatalf("prepare queries: %v", err)
	}
	defer queries.Close()

	// ConnectRPC-only mux
	rpc := router.NewConnectMux(sqlDB, queries, logger)
	mux := http.NewServeMux()
	mux.Handle("/health", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("{\"status\":\"healthy\"}"))
	}))
	mux.Handle("/", rpc)

	// CORS for Connect/gRPC-Web
	c := cors.New(cors.Options{
		AllowedMethods:   connectcors.AllowedMethods(),
		AllowedHeaders:   connectcors.AllowedHeaders(),
		ExposedHeaders:   connectcors.ExposedHeaders(),
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowCredentials: false,
		MaxAge:           300,
	})
	handler := c.Handler(mux)

	srv := &http.Server{
		Addr:         cfg.Server.Addr,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}
	// Dev: h2c (HTTP/2 without TLS) so gRPC works locally
	srv.Handler = h2c.NewHandler(handler, &http2.Server{})

	go func() {
		logger.Info("server starting", "addr", cfg.Server.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	// graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("shutting down server...")

	ctxShutdown, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()
	if err := srv.Shutdown(ctxShutdown); err != nil {
		log.Printf("server shutdown: %v", err)
	}
}
