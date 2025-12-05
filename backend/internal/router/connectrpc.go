package router

import (
	"context"
	"database/sql"
	"net/http"

	"log/slog"

	"connectrpc.com/connect"
	"connectrpc.com/grpchealth"
	"connectrpc.com/grpcreflect"
	"github.com/pyrecycleheat/backend/api/gen/go/pyrecycleheat/v1/pyrecycleheatv1connect"
	db "github.com/pyrecycleheat/backend/internal/database"
	"github.com/pyrecycleheat/backend/internal/engine"
	"github.com/pyrecycleheat/backend/internal/service"
)

// NewConnectMux returns an http.Handler serving ConnectRPC services under /rpc.
func NewConnectMux(sqlDB *sql.DB, queries *db.Queries, logger *slog.Logger) http.Handler {
	mux := http.NewServeMux()

	// Interceptor: simple request log
	logInterceptor := connect.WithInterceptors(connect.UnaryInterceptorFunc(func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			logger.Info("rpc", "procedure", req.Spec().Procedure, "peer", req.Peer().Addr)
			return next(ctx, req)
		}
	}))

	eng := engine.NewPredictionEngine()
	dhSvc := service.NewDistrictHeatingService(sqlDB, queries, logger)
	predSvc := service.NewPredictionService(sqlDB, queries, eng, logger)

	// Handlers implement the generated interfaces. Mount at returned paths.
	dhPath, dhHandler := pyrecycleheatv1connect.NewDistrictHeatingServiceHandler(&districtHeatingRPC{svc: dhSvc, logger: logger}, logInterceptor)
	predPath, predHandler := pyrecycleheatv1connect.NewPredictionServiceHandler(&predictionRPC{svc: predSvc, logger: logger}, logInterceptor)
	mux.Handle(dhPath, dhHandler)
	mux.Handle(predPath, predHandler)

	// gRPC health and reflection
	healthPath, healthHandler := grpchealth.NewHandler(grpchealth.NewStaticChecker(
		"pyrecycleheat.v1.DistrictHeatingService",
		"pyrecycleheat.v1.PredictionService",
	))
	mux.Handle(healthPath, healthHandler)

	reflector := grpcreflect.NewStaticReflector(
		"pyrecycleheat.v1.DistrictHeatingService",
		"pyrecycleheat.v1.PredictionService",
	)
	reflectV1Path, reflectV1Handler := grpcreflect.NewHandlerV1(reflector)
	mux.Handle(reflectV1Path, reflectV1Handler)

	return mux
}
