package router

import (
	"context"
	"log/slog"

	"connectrpc.com/connect"
	pyv1 "github.com/pyrecycleheat/backend/api/gen/go/pyrecycleheat/v1"
	"github.com/pyrecycleheat/backend/internal/service"
)

type districtHeatingRPC struct {
	svc    *service.DistrictHeatingService
	logger *slog.Logger
}

// Minimal implementations
func (h *districtHeatingRPC) ListHeatCenters(ctx context.Context, req *connect.Request[pyv1.ListHeatCentersRequest]) (*connect.Response[pyv1.ListHeatCentersResponse], error) {
	rows, total, err := h.svc.ListHeatCenters(ctx, 50, 0)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	out := &pyv1.ListHeatCentersResponse{Pagination: &pyv1.PaginationMetadata{TotalCount: total}}
	for _, r := range rows {
		out.HeatCenters = append(out.HeatCenters, &pyv1.HeatCenter{
			Id:            r.ID,
			Name:          r.Name,
			Location:      &pyv1.Location{Latitude: r.LocationLat, Longitude: r.LocationLng},
			MaxCapacityMw: r.MaxCapacityMw,
		})
	}
	return connect.NewResponse(out), nil
}

// Stubs to satisfy interface (return Unimplemented for now)
func (h *districtHeatingRPC) GetHeatCenter(ctx context.Context, req *connect.Request[pyv1.GetHeatCenterRequest]) (*connect.Response[pyv1.GetHeatCenterResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) CreateHeatCenter(ctx context.Context, req *connect.Request[pyv1.CreateHeatCenterRequest]) (*connect.Response[pyv1.CreateHeatCenterResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) UpdateHeatCenter(ctx context.Context, req *connect.Request[pyv1.UpdateHeatCenterRequest]) (*connect.Response[pyv1.UpdateHeatCenterResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) DeleteHeatCenter(ctx context.Context, req *connect.Request[pyv1.DeleteHeatCenterRequest]) (*connect.Response[pyv1.DeleteHeatCenterResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) ListDemandSites(ctx context.Context, req *connect.Request[pyv1.ListDemandSitesRequest]) (*connect.Response[pyv1.ListDemandSitesResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) GetDemandSite(ctx context.Context, req *connect.Request[pyv1.GetDemandSiteRequest]) (*connect.Response[pyv1.GetDemandSiteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) CreateDemandSite(ctx context.Context, req *connect.Request[pyv1.CreateDemandSiteRequest]) (*connect.Response[pyv1.CreateDemandSiteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) UpdateDemandSite(ctx context.Context, req *connect.Request[pyv1.UpdateDemandSiteRequest]) (*connect.Response[pyv1.UpdateDemandSiteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) DeleteDemandSite(ctx context.Context, req *connect.Request[pyv1.DeleteDemandSiteRequest]) (*connect.Response[pyv1.DeleteDemandSiteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) ListRoutes(ctx context.Context, req *connect.Request[pyv1.ListRoutesRequest]) (*connect.Response[pyv1.ListRoutesResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) GetRoute(ctx context.Context, req *connect.Request[pyv1.GetRouteRequest]) (*connect.Response[pyv1.GetRouteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) CreateRoute(ctx context.Context, req *connect.Request[pyv1.CreateRouteRequest]) (*connect.Response[pyv1.CreateRouteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) UpdateRoute(ctx context.Context, req *connect.Request[pyv1.UpdateRouteRequest]) (*connect.Response[pyv1.UpdateRouteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) DeleteRoute(ctx context.Context, req *connect.Request[pyv1.DeleteRouteRequest]) (*connect.Response[pyv1.DeleteRouteResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, nil)
}
func (h *districtHeatingRPC) GetAnalyticsSummary(ctx context.Context, req *connect.Request[pyv1.GetAnalyticsSummaryRequest]) (*connect.Response[pyv1.GetAnalyticsSummaryResponse], error) {
	sum, err := h.svc.GetAnalyticsSummary(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	out := &pyv1.GetAnalyticsSummaryResponse{
		AnalyticsSummary: &pyv1.AnalyticsSummary{
			TotalHeatCenters:     sum.TotalHeatCenters,
			TotalDemandSites:     sum.TotalDemandSites,
			TotalRoutes:          sum.TotalRoutes,
			ActiveHeatCenters:    sum.ActiveHeatCenters,
			ConnectedDemandSites: sum.ConnectedDemandSites,
			TotalCapacityMw:      sum.TotalCapacityMW,
			TotalCurrentOutputMw: sum.TotalCurrentOutputMW,
			TotalDemandMw:        sum.TotalDemandMW,
			TotalActiveRoutes:    sum.TotalActiveRoutes,
		},
	}
	return connect.NewResponse(out), nil
}

func (h *districtHeatingRPC) GetHeatCenterAnalytics(ctx context.Context, req *connect.Request[pyv1.GetHeatCenterAnalyticsRequest]) (*connect.Response[pyv1.GetHeatCenterAnalyticsResponse], error) {
	a, err := h.svc.GetHeatCenterAnalytics(ctx, req.Msg.GetId())
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	out := &pyv1.GetHeatCenterAnalyticsResponse{
		HeatCenterAnalytics: &pyv1.HeatCenterAnalytics{
			HeatCenter:                 toProtoHeatCenter(a.HeatCenter),
			TotalConnectedDemandMw:     a.TotalConnectedDemandMW,
			CapacityUtilizationPercent: a.CapacityUtilizationPct,
			RoutesCount:                a.RoutesCount,
		},
	}
	for _, ds := range a.ConnectedDemandSites {
		out.HeatCenterAnalytics.ConnectedDemandSites = append(out.HeatCenterAnalytics.ConnectedDemandSites, toProtoDemandSite(ds))
	}
	return connect.NewResponse(out), nil
}

func (h *districtHeatingRPC) GetDemandSiteAnalytics(ctx context.Context, req *connect.Request[pyv1.GetDemandSiteAnalyticsRequest]) (*connect.Response[pyv1.GetDemandSiteAnalyticsResponse], error) {
	a, err := h.svc.GetDemandSiteAnalytics(ctx, req.Msg.GetId())
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	out := &pyv1.GetDemandSiteAnalyticsResponse{
		DemandSiteAnalytics: &pyv1.DemandSiteAnalytics{
			DemandSite:               toProtoDemandSite(a.DemandSite),
			TotalAvailableCapacityMw: a.TotalAvailableCapacityMW,
			DemandCoveragePercent:    a.DemandCoveragePct,
			RoutesCount:              a.RoutesCount,
		},
	}
	for _, hc := range a.HeatSources {
		out.DemandSiteAnalytics.HeatSources = append(out.DemandSiteAnalytics.HeatSources, toProtoHeatCenter(hc))
	}
	return connect.NewResponse(out), nil
}
