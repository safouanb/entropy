package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"

	db "github.com/pyrecycleheat/backend/internal/database"
)

type DistrictHeatingService struct {
	db      *sql.DB
	queries *db.Queries
	logger  *slog.Logger
}

func NewDistrictHeatingService(dbConn *sql.DB, queries *db.Queries, logger *slog.Logger) *DistrictHeatingService {
	return &DistrictHeatingService{db: dbConn, queries: queries, logger: logger}
}

func (s *DistrictHeatingService) ListHeatCenters(ctx context.Context, limit, offset int64) ([]db.HeatCenter, int64, error) {
	total, err := s.queries.CountHeatCenters(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("count heat centers: %w", err)
	}
	rows, err := s.queries.ListHeatCenters(ctx, db.ListHeatCentersParams{Limit: limit, Offset: offset})
	if err != nil {
		return nil, 0, fmt.Errorf("list heat centers: %w", err)
	}
	return rows, total, nil
}

func (s *DistrictHeatingService) GetHeatCenter(ctx context.Context, id int64) (*db.HeatCenter, error) {
	row, err := s.queries.GetHeatCenter(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "HeatCenter", ID: id}
		}
		return nil, fmt.Errorf("get heat center: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) CreateHeatCenter(ctx context.Context, p db.CreateHeatCenterParams) (*db.HeatCenter, error) {
	row, err := s.queries.CreateHeatCenter(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("create heat center: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) UpdateHeatCenter(ctx context.Context, id int64, p db.UpdateHeatCenterParams) (*db.HeatCenter, error) {
	p.ID = id
	row, err := s.queries.UpdateHeatCenter(ctx, p)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "HeatCenter", ID: id}
		}
		return nil, fmt.Errorf("update heat center: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) DeleteHeatCenter(ctx context.Context, id int64) error {
	if err := s.queries.DeleteHeatCenter(ctx, id); err != nil {
		return fmt.Errorf("delete heat center: %w", err)
	}
	return nil
}

// Demand Sites

func (s *DistrictHeatingService) ListDemandSites(ctx context.Context, limit, offset int64) ([]db.DemandSite, int64, error) {
	total, err := s.queries.CountDemandSites(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("count demand sites: %w", err)
	}
	rows, err := s.queries.ListDemandSites(ctx, db.ListDemandSitesParams{Limit: limit, Offset: offset})
	if err != nil {
		return nil, 0, fmt.Errorf("list demand sites: %w", err)
	}
	return rows, total, nil
}

func (s *DistrictHeatingService) GetDemandSite(ctx context.Context, id int64) (*db.DemandSite, error) {
	row, err := s.queries.GetDemandSite(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "DemandSite", ID: id}
		}
		return nil, fmt.Errorf("get demand site: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) CreateDemandSite(ctx context.Context, p db.CreateDemandSiteParams) (*db.DemandSite, error) {
	row, err := s.queries.CreateDemandSite(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("create demand site: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) UpdateDemandSite(ctx context.Context, id int64, p db.UpdateDemandSiteParams) (*db.DemandSite, error) {
	p.ID = id
	row, err := s.queries.UpdateDemandSite(ctx, p)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "DemandSite", ID: id}
		}
		return nil, fmt.Errorf("update demand site: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) DeleteDemandSite(ctx context.Context, id int64) error {
	if err := s.queries.DeleteDemandSite(ctx, id); err != nil {
		return fmt.Errorf("delete demand site: %w", err)
	}
	return nil
}

// Routes

func (s *DistrictHeatingService) ListRoutes(ctx context.Context, limit, offset int64) ([]db.Route, int64, error) {
	total, err := s.queries.CountRoutes(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("count routes: %w", err)
	}
	rows, err := s.queries.ListRoutes(ctx, db.ListRoutesParams{Limit: limit, Offset: offset})
	if err != nil {
		return nil, 0, fmt.Errorf("list routes: %w", err)
	}
	return rows, total, nil
}

func (s *DistrictHeatingService) GetRoute(ctx context.Context, id int64) (*db.Route, error) {
	row, err := s.queries.GetRoute(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "Route", ID: id}
		}
		return nil, fmt.Errorf("get route: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) CreateRoute(ctx context.Context, p db.CreateRouteParams) (*db.Route, error) {
	row, err := s.queries.CreateRoute(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("create route: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) UpdateRoute(ctx context.Context, id int64, p db.UpdateRouteParams) (*db.Route, error) {
	p.ID = id
	row, err := s.queries.UpdateRoute(ctx, p)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "Route", ID: id}
		}
		return nil, fmt.Errorf("update route: %w", err)
	}
	return &row, nil
}

func (s *DistrictHeatingService) DeleteRoute(ctx context.Context, id int64) error {
	if err := s.queries.DeleteRoute(ctx, id); err != nil {
		return fmt.Errorf("delete route: %w", err)
	}
	return nil
}

// Analytics

type AnalyticsSummary struct {
	TotalHeatCenters     int64
	TotalDemandSites     int64
	TotalRoutes          int64
	ActiveHeatCenters    int64
	ConnectedDemandSites int64
	TotalCapacityMW      float64
	TotalCurrentOutputMW float64
	TotalDemandMW        float64
	TotalActiveRoutes    int64
}

func (s *DistrictHeatingService) GetAnalyticsSummary(ctx context.Context) (*AnalyticsSummary, error) {
	row, err := s.queries.GetAnalyticsSummary(ctx)
	if err != nil {
		return nil, fmt.Errorf("get analytics summary: %w", err)
	}
	out := &AnalyticsSummary{
		TotalHeatCenters:     row.TotalHeatCenters,
		TotalDemandSites:     row.TotalDemandSites,
		TotalRoutes:          row.TotalRoutes,
		ActiveHeatCenters:    row.ActiveHeatCenters,
		ConnectedDemandSites: row.ConnectedDemandSites,
	}
	if v, ok := row.TotalCapacityMw.(float64); ok {
		out.TotalCapacityMW = v
	}
	if v, ok := row.TotalCurrentOutputMw.(float64); ok {
		out.TotalCurrentOutputMW = v
	}
	if v, ok := row.TotalDemandMw.(float64); ok {
		out.TotalDemandMW = v
	}
	out.TotalActiveRoutes = row.TotalActiveRoutes
	return out, nil
}

// Per-entity analytics parity
type HeatCenterAnalytics struct {
	HeatCenter             db.HeatCenter
	ConnectedDemandSites   []db.DemandSite
	TotalConnectedDemandMW float64
	CapacityUtilizationPct float64
	RoutesCount            int64
}

func (s *DistrictHeatingService) GetHeatCenterAnalytics(ctx context.Context, id int64) (*HeatCenterAnalytics, error) {
	hc, err := s.queries.GetHeatCenter(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "HeatCenter", ID: id}
		}
		return nil, fmt.Errorf("get heat center: %w", err)
	}
	routes, err := s.queries.ListRoutes(ctx, db.ListRoutesParams{Limit: 100000, Offset: 0})
	if err != nil {
		return nil, fmt.Errorf("list routes: %w", err)
	}
	connected := make([]db.DemandSite, 0)
	var totalDemand float64
	var count int64
	for _, r := range routes {
		if r.HeatCenterID == id {
			ds, err := s.queries.GetDemandSite(ctx, r.DemandSiteID)
			if err == nil {
				connected = append(connected, ds)
				if ds.PeakDemandMw > 0 {
					totalDemand += ds.PeakDemandMw
				}
				count++
			}
		}
	}
	util := 0.0
	if hc.MaxCapacityMw > 0 {
		util = totalDemand / hc.MaxCapacityMw * 100
	}
	return &HeatCenterAnalytics{
		HeatCenter:             hc,
		ConnectedDemandSites:   connected,
		TotalConnectedDemandMW: totalDemand,
		CapacityUtilizationPct: util,
		RoutesCount:            count,
	}, nil
}

type DemandSiteAnalytics struct {
	DemandSite               db.DemandSite
	HeatSources              []db.HeatCenter
	TotalAvailableCapacityMW float64
	DemandCoveragePct        float64
	RoutesCount              int64
}

func (s *DistrictHeatingService) GetDemandSiteAnalytics(ctx context.Context, id int64) (*DemandSiteAnalytics, error) {
	ds, err := s.queries.GetDemandSite(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "DemandSite", ID: id}
		}
		return nil, fmt.Errorf("get demand site: %w", err)
	}
	routes, err := s.queries.ListRoutes(ctx, db.ListRoutesParams{Limit: 100000, Offset: 0})
	if err != nil {
		return nil, fmt.Errorf("list routes: %w", err)
	}
	sources := make([]db.HeatCenter, 0)
	var totalCap float64
	var count int64
	for _, r := range routes {
		if r.DemandSiteID == id {
			hc, err := s.queries.GetHeatCenter(ctx, r.HeatCenterID)
			if err == nil {
				sources = append(sources, hc)
				totalCap += hc.MaxCapacityMw
				count++
			}
		}
	}
	coverage := 0.0
	if ds.PeakDemandMw > 0 {
		coverage = totalCap / ds.PeakDemandMw * 100
	}
	return &DemandSiteAnalytics{
		DemandSite:               ds,
		HeatSources:              sources,
		TotalAvailableCapacityMW: totalCap,
		DemandCoveragePct:        coverage,
		RoutesCount:              count,
	}, nil
}
