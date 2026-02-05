package router

import (
	"context"
	"database/sql"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	_ "github.com/mattn/go-sqlite3"
	db "github.com/pyrecycleheat/backend/internal/database"
	"github.com/pyrecycleheat/backend/internal/database/schema"
)

// setupTestDB creates an in-memory SQLite database for testing.
// setupTestDB creates an in-memory SQLite database for testing.
func setupTestDB(t *testing.T) (*sql.DB, *db.Queries) {
	t.Helper()
	sqlDB, err := sql.Open("sqlite3", ":memory:?_foreign_keys=on")
	if err != nil {
		t.Fatalf("open test db: %v", err)
	}

	// Apply migrations
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

func TestConnectRPC_ListHeatCenters(t *testing.T) {
	sqlDB, queries := setupTestDB(t)
	defer sqlDB.Close()
	defer queries.Close()

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	mux := NewConnectMux(sqlDB, queries, logger)

	srv := httptest.NewServer(mux)
	defer srv.Close()

	// Test ListHeatCenters
	body := `{"pagination":{"page":1,"page_size":10}}`
	req, _ := http.NewRequest("POST", srv.URL+"/pyrecycleheat.v1.DistrictHeatingService/ListHeatCenters", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestConnectRPC_Health(t *testing.T) {
	sqlDB, queries := setupTestDB(t)
	defer sqlDB.Close()
	defer queries.Close()

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	mux := NewConnectMux(sqlDB, queries, logger)

	srv := httptest.NewServer(mux)
	defer srv.Close()

	// Test gRPC health check
	body := `{"service":""}`
	req, _ := http.NewRequest("POST", srv.URL+"/grpc.health.v1.Health/Check", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}
