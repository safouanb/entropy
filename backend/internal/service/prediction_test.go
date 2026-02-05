package service

import (
	"context"
	"database/sql"
	"io"
	"log/slog"
	"testing"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/pyrecycleheat/backend/internal/compliance"
	db "github.com/pyrecycleheat/backend/internal/database"
	"github.com/pyrecycleheat/backend/internal/database/schema"
	"github.com/pyrecycleheat/backend/internal/engine"
)

func setupTestDB(t *testing.T) (*sql.DB, *db.Queries) {
	t.Helper()
	sqlDB, err := sql.Open("sqlite3", ":memory:?_foreign_keys=on")
	if err != nil {
		t.Fatalf("open test db: %v", err)
	}

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	if err := schema.Run(sqlDB, logger); err != nil {
		t.Fatalf("run migrations: %v", err)
	}

	queries, err := db.Prepare(context.Background(), sqlDB)
	if err != nil {
		t.Fatalf("prepare queries: %v", err)
	}

	return sqlDB, queries
}

func TestPredictionService_CheckCompliance(t *testing.T) {
	sqlDB, queries := setupTestDB(t)
	defer sqlDB.Close()

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	enginePred := engine.NewPredictionEngine()
	svc := NewPredictionService(sqlDB, queries, enginePred, logger)

	ctx := context.Background()

	tests := []struct {
		name string
		req  compliance.ComplianceRequest
		want compliance.ComplianceStatus
	}{
		{
			name: "Small DC < 300kW Exempt",
			req: compliance.ComplianceRequest{
				Jurisdiction:      compliance.JurisdictionGermany,
				TotalITLoadKW:     250,
				PlanDate:          time.Now(),
				HeatRecoveryReady: false,
			},
			want: compliance.StatusExempt,
		},
		{
			name: "Medium DC 500kW Voluntary",
			req: compliance.ComplianceRequest{
				Jurisdiction:      compliance.JurisdictionGermany,
				TotalITLoadKW:     500,
				PlanDate:          time.Now(),
				HeatRecoveryReady: false,
			},
			want: compliance.StatusVoluntary,
		},
		{
			name: "Large DC 5000kW Mandatory",
			req: compliance.ComplianceRequest{
				Jurisdiction:      compliance.JurisdictionGermany,
				TotalITLoadKW:     5000,
				PlanDate:          time.Now(),
				HeatRecoveryReady: true,
			},
			want: compliance.StatusMandatory,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.CheckCompliance(ctx, tt.req)
			if err != nil {
				t.Fatalf("CheckCompliance() error = %v", err)
			}
			if got.Status != tt.want {
				t.Errorf("CheckCompliance() status = %v, want %v", got.Status, tt.want)
			}
		})
	}
}

func TestPredictionService_Calculate(t *testing.T) {
	sqlDB, queries := setupTestDB(t)
	defer sqlDB.Close()

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	enginePred := engine.NewPredictionEngine()
	svc := NewPredictionService(sqlDB, queries, enginePred, logger)
	ctx := context.Background()

	// Seed DataCenter
	dc, err := queries.CreateDataCenter(ctx, db.CreateDataCenterParams{
		Name:          "Test DC",
		LocationLat:   52.52,
		LocationLng:   13.40,
		TotalItLoadKw: 1000,
	})
	if err != nil {
		t.Fatalf("seed dc: %v", err)
	}

	req := PredictionRequest{
		DataCenterID:  dc.ID,
		AnalysisYears: 10,
	}

	resp, err := svc.Calculate(ctx, req)
	if err != nil {
		t.Fatalf("Calculate() error = %v", err)
	}

	if resp.EnergyMetrics.AnnualEnergyKWh <= 0 {
		t.Errorf("expected positive energy, got %f", resp.EnergyMetrics.AnnualEnergyKWh)
	}
}
