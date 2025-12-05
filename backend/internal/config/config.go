package config

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/spf13/viper"
)

// Config holds all application configuration.
type Config struct {
	Server     ServerConfig
	Database   DatabaseConfig
	Observ     ObservabilityConfig
	Migrations MigrationsConfig
}

type ServerConfig struct {
	Addr         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

type DatabaseConfig struct {
	DSN             string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

type ObservabilityConfig struct {
	EnableOTEL       bool
	EnableMetrics    bool
	MetricsAddr      string
	ServiceName      string
	ServiceVersion   string
	EnableDevLogging bool
}

type MigrationsConfig struct {
	AutoRun bool
	Dir     string
}

// Load reads configuration from environment variables and optional config file.
func Load() (*Config, error) {
	v := viper.New()

	// Defaults
	v.SetDefault("server.addr", ":8080")
	v.SetDefault("server.read_timeout", "15s")
	v.SetDefault("server.write_timeout", "15s")

	v.SetDefault("database.dsn", "file:district_heating.db?_foreign_keys=on&_busy_timeout=5000")
	v.SetDefault("database.max_open_conns", 25)
	v.SetDefault("database.max_idle_conns", 5)
	v.SetDefault("database.conn_max_lifetime", "5m")

	v.SetDefault("observ.enable_otel", false)
	v.SetDefault("observ.enable_metrics", true)
	v.SetDefault("observ.metrics_addr", ":9090")
	v.SetDefault("observ.service_name", "pyrecycleheat-backend")
	v.SetDefault("observ.service_version", "0.1.0")
	v.SetDefault("observ.enable_dev_logging", true)

	v.SetDefault("migrations.auto_run", true)
	v.SetDefault("migrations.dir", "internal/database/schema")

	// Environment variables
	v.SetEnvPrefix("PYRECYCLE")
	v.AutomaticEnv()

	// Optional config file
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")
	v.AddConfigPath("./config")
	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("read config file: %w", err)
		}
		// Config file not found is OK; we'll use defaults + env
		slog.Debug("no config file found, using defaults and environment variables")
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("unmarshal config: %w", err)
	}

	return &cfg, nil
}
