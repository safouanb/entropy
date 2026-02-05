package service

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"connectrpc.com/connect"
	pyrecycleheatv1 "github.com/pyrecycleheat/backend/api/gen/go/pyrecycleheat/v1"
	db "github.com/pyrecycleheat/backend/internal/database"
)

// GetDashboardStats returns high-level metrics for the executive dashboard
func (s *PredictionService) GetDashboardStats(ctx context.Context, req *connect.Request[pyrecycleheatv1.GetDashboardStatsRequest]) (*connect.Response[pyrecycleheatv1.GetDashboardStatsResponse], error) {
	stats, err := s.queries.GetDashboardStats(ctx)
	if err != nil {
		return nil, fmt.Errorf("get dashboard stats: %w", err)
	}

	// For annual savings, we use the prediction analytics aggregation query
	analytics, err := s.GetPredictionAnalytics(ctx)
	annualSavings := 0.0
	if err == nil {
		annualSavings = analytics.AvgAnnualSavings * float64(analytics.TotalPredictions) // Rough approximation
	}

	// Hardcoding compliance rate calculation for MVP
	complianceRate := int64(94)

	return connect.NewResponse(&pyrecycleheatv1.GetDashboardStatsResponse{
		ActiveSites:          stats.ActiveSites,
		TotalActivities:      stats.TotalActivities,
		CompletedAssessments: stats.CompletedAssessments,
		AnnualSavings:        annualSavings,
		ComplianceRate:       complianceRate,
	}), nil
}

// ListActivityStream returns recent audit logs
func (s *PredictionService) ListActivityStream(ctx context.Context, req *connect.Request[pyrecycleheatv1.ListActivityStreamRequest]) (*connect.Response[pyrecycleheatv1.ListActivityStreamResponse], error) {
	limit := req.Msg.Limit
	if limit <= 0 {
		limit = 10
	}
	logs, err := s.queries.ListAuditLogs(ctx, db.ListAuditLogsParams{
		Limit:  int64(limit),
		Offset: 0,
	})
	if err != nil {
		return nil, fmt.Errorf("list audit logs: %w", err)
	}

	var items []*pyrecycleheatv1.ActivityLogItem
	for _, l := range logs {
		var createdAt time.Time
		// In generated code, CreatedAt is sql.NullTime
		if l.CreatedAt.Valid {
			createdAt = l.CreatedAt.Time
		} else {
			createdAt = time.Now() // Fallback
		}

		items = append(items, &pyrecycleheatv1.ActivityLogItem{
			Id:      l.ID,
			User:    l.UserIdentifier,
			Action:  l.Action,
			Type:    l.EntityType,
			Icon:    l.IconType,
			TimeAgo: formatTimeAgo(createdAt),
		})
	}

	return connect.NewResponse(&pyrecycleheatv1.ListActivityStreamResponse{
		Activities: items,
	}), nil
}

func formatTimeAgo(t time.Time) string {
	d := time.Since(t)
	if d.Hours() > 24 {
		return fmt.Sprintf("%d days ago", int(d.Hours()/24))
	}
	if d.Hours() >= 1 {
		return fmt.Sprintf("%d hours ago", int(d.Hours()))
	}
	if d.Minutes() >= 1 {
		return fmt.Sprintf("%d min ago", int(d.Minutes()))
	}
	return "just now"
}

// GetUser returns the current user profile (using email as ID for now)
func (s *PredictionService) GetUser(ctx context.Context, req *connect.Request[pyrecycleheatv1.GetUserRequest]) (*connect.Response[pyrecycleheatv1.GetUserResponse], error) {
	email := req.Msg.Email
	if email == "" {
		email = "user@entropy.energy" // Default for demo
	}

	u, err := s.queries.GetUser(ctx, email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("user not found"))
		}
		return nil, fmt.Errorf("get user: %w", err)
	}

	return connect.NewResponse(&pyrecycleheatv1.GetUserResponse{
		User: &pyrecycleheatv1.UserProfile{
			FirstName:                u.FirstName,
			LastName:                 u.LastName,
			Email:                    u.Email,
			NotifyAssessmentComplete: u.NotifyAssessmentComplete.Bool,
			NotifyRegulatoryUpdates:  u.NotifyRegulatoryUpdates.Bool,
			ApiKeyLive:               u.ApiKeyLive.String,
		},
	}), nil
}

// UpdateUser updates the user profile
func (s *PredictionService) UpdateUser(ctx context.Context, req *connect.Request[pyrecycleheatv1.UpdateUserRequest]) (*connect.Response[pyrecycleheatv1.UpdateUserResponse], error) {
	u := req.Msg

	updated, err := s.queries.UpdateUser(ctx, db.UpdateUserParams{
		FirstName:                u.FirstName,
		LastName:                 u.LastName,
		Email:                    u.Email, // Where clause
		NotifyAssessmentComplete: sql.NullBool{Bool: u.NotifyAssessmentComplete, Valid: true},
		NotifyRegulatoryUpdates:  sql.NullBool{Bool: u.NotifyRegulatoryUpdates, Valid: true},
	})
	if err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	// Log the action
	s.queries.CreateAuditLog(ctx, db.CreateAuditLogParams{
		UserIdentifier: u.Email,
		Action:         "Updated profile settings",
		EntityType:     "account",
		IconType:       "user",
	})

	return connect.NewResponse(&pyrecycleheatv1.UpdateUserResponse{
		User: &pyrecycleheatv1.UserProfile{
			FirstName:                updated.FirstName,
			LastName:                 updated.LastName,
			Email:                    updated.Email,
			NotifyAssessmentComplete: updated.NotifyAssessmentComplete.Bool,
			NotifyRegulatoryUpdates:  updated.NotifyRegulatoryUpdates.Bool,
			ApiKeyLive:               updated.ApiKeyLive.String,
		},
	}), nil
}
