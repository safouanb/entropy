package router

import (
	"context"
	"database/sql"
	"log/slog"

	"connectrpc.com/connect"
	pyv1 "github.com/pyrecycleheat/backend/api/gen/go/pyrecycleheat/v1"
	db "github.com/pyrecycleheat/backend/internal/database"
	"github.com/pyrecycleheat/backend/internal/service"
)

type predictionRPC struct {
	svc    *service.PredictionService
	logger *slog.Logger
}

// DataCenter CRUD handlers

func (h *predictionRPC) ListDataCenters(ctx context.Context, req *connect.Request[pyv1.ListDataCentersRequest]) (*connect.Response[pyv1.ListDataCentersResponse], error) {
	limit := int64(req.Msg.GetPagination().GetPageSize())
	page := int64(req.Msg.GetPagination().GetPage())
	if limit <= 0 {
		limit = 50
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	rows, total, err := h.svc.ListDataCenters(ctx, limit, offset)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	out := &pyv1.ListDataCentersResponse{
		Pagination: &pyv1.PaginationMetadata{
			Page:       int32(page),
			PageSize:   int32(limit),
			TotalCount: total,
		},
	}
	for _, r := range rows {
		out.DataCenters = append(out.DataCenters, toProtoDataCenter(r))
	}

	if limit > 0 {
		totalPages := total / limit
		if total%limit != 0 {
			totalPages++
		}
		out.Pagination.TotalPages = int32(totalPages)
		out.Pagination.HasNext = page*limit < total
		out.Pagination.HasPrevious = page > 1
	}

	return connect.NewResponse(out), nil
}

func (h *predictionRPC) GetDataCenter(ctx context.Context, req *connect.Request[pyv1.GetDataCenterRequest]) (*connect.Response[pyv1.GetDataCenterResponse], error) {
	row, err := h.svc.GetDataCenter(ctx, req.Msg.GetId())
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.GetDataCenterResponse{DataCenter: toProtoDataCenter(*row)}), nil
}

func (h *predictionRPC) CreateDataCenter(ctx context.Context, req *connect.Request[pyv1.CreateDataCenterRequest]) (*connect.Response[pyv1.CreateDataCenterResponse], error) {
	p := db.CreateDataCenterParams{
		Name:                req.Msg.GetName(),
		LocationLat:         req.Msg.GetLocation().GetLatitude(),
		LocationLng:         req.Msg.GetLocation().GetLongitude(),
		Address:             sql.NullString{String: req.Msg.GetAddress(), Valid: req.Msg.Address != ""},
		DcType:              sql.NullString{String: req.Msg.GetDcType(), Valid: req.Msg.DcType != ""},
		TotalItLoadKw:       req.Msg.GetTotalItLoadKw(),
		Pue:                 sql.NullFloat64{Float64: req.Msg.GetPue(), Valid: true},
		UtilizationPercent:  sql.NullFloat64{Float64: req.Msg.GetUtilizationPercent(), Valid: true},
		CoolingType:         sql.NullString{String: req.Msg.GetCoolingType(), Valid: req.Msg.CoolingType != ""},
		EnergySource:        sql.NullString{String: req.Msg.GetEnergySource(), Valid: req.Msg.EnergySource != ""},
		RenewablePercent:    sql.NullFloat64{Float64: req.Msg.GetRenewablePercent(), Valid: true},
		ElectricityCostKwh:  sql.NullFloat64{Float64: req.Msg.GetElectricityCostKwh(), Valid: true},
		OperatingHoursYear:  sql.NullInt64{Int64: int64(req.Msg.GetOperatingHoursYear()), Valid: true},
		HeatRecoveryEnabled: sql.NullInt64{Int64: boolToInt64(req.Msg.GetHeatRecoveryEnabled()), Valid: true},
	}
	row, err := h.svc.CreateDataCenter(ctx, p)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.CreateDataCenterResponse{DataCenter: toProtoDataCenter(*row)}), nil
}

func (h *predictionRPC) UpdateDataCenter(ctx context.Context, req *connect.Request[pyv1.UpdateDataCenterRequest]) (*connect.Response[pyv1.UpdateDataCenterResponse], error) {
	p := db.UpdateDataCenterParams{
		ID:                  req.Msg.GetId(),
		Name:                req.Msg.GetName(),
		LocationLat:         req.Msg.GetLocation().GetLatitude(),
		LocationLng:         req.Msg.GetLocation().GetLongitude(),
		Address:             sql.NullString{String: req.Msg.GetAddress(), Valid: req.Msg.Address != ""},
		DcType:              sql.NullString{String: req.Msg.GetDcType(), Valid: req.Msg.DcType != ""},
		TotalItLoadKw:       req.Msg.GetTotalItLoadKw(),
		Pue:                 sql.NullFloat64{Float64: req.Msg.GetPue(), Valid: true},
		UtilizationPercent:  sql.NullFloat64{Float64: req.Msg.GetUtilizationPercent(), Valid: true},
		CoolingType:         sql.NullString{String: req.Msg.GetCoolingType(), Valid: req.Msg.CoolingType != ""},
		EnergySource:        sql.NullString{String: req.Msg.GetEnergySource(), Valid: req.Msg.EnergySource != ""},
		RenewablePercent:    sql.NullFloat64{Float64: req.Msg.GetRenewablePercent(), Valid: true},
		ElectricityCostKwh:  sql.NullFloat64{Float64: req.Msg.GetElectricityCostKwh(), Valid: true},
		OperatingHoursYear:  sql.NullInt64{Int64: int64(req.Msg.GetOperatingHoursYear()), Valid: true},
		HeatRecoveryEnabled: sql.NullInt64{Int64: boolToInt64(req.Msg.GetHeatRecoveryEnabled()), Valid: true},
	}
	row, err := h.svc.UpdateDataCenter(ctx, req.Msg.GetId(), p)
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.UpdateDataCenterResponse{DataCenter: toProtoDataCenter(*row)}), nil
}

func (h *predictionRPC) DeleteDataCenter(ctx context.Context, req *connect.Request[pyv1.DeleteDataCenterRequest]) (*connect.Response[pyv1.DeleteDataCenterResponse], error) {
	err := h.svc.DeleteDataCenter(ctx, req.Msg.GetId())
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.DeleteDataCenterResponse{}), nil
}

// CarbonCredit CRUD handlers

func (h *predictionRPC) ListCarbonCredits(ctx context.Context, req *connect.Request[pyv1.ListCarbonCreditsRequest]) (*connect.Response[pyv1.ListCarbonCreditsResponse], error) {
	limit := int64(req.Msg.GetPagination().GetPageSize())
	page := int64(req.Msg.GetPagination().GetPage())
	if limit <= 0 {
		limit = 50
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	rows, total, err := h.svc.ListCarbonCredits(ctx, limit, offset)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	out := &pyv1.ListCarbonCreditsResponse{
		Pagination: &pyv1.PaginationMetadata{
			Page:       int32(page),
			PageSize:   int32(limit),
			TotalCount: total,
		},
	}
	for _, r := range rows {
		out.CarbonCredits = append(out.CarbonCredits, toProtoCarbonCredit(r))
	}

	if limit > 0 {
		totalPages := total / limit
		if total%limit != 0 {
			totalPages++
		}
		out.Pagination.TotalPages = int32(totalPages)
		out.Pagination.HasNext = page*limit < total
		out.Pagination.HasPrevious = page > 1
	}

	return connect.NewResponse(out), nil
}

func (h *predictionRPC) GetCarbonCredit(ctx context.Context, req *connect.Request[pyv1.GetCarbonCreditRequest]) (*connect.Response[pyv1.GetCarbonCreditResponse], error) {
	row, err := h.svc.GetCarbonCredit(ctx, req.Msg.GetId())
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.GetCarbonCreditResponse{CarbonCredit: toProtoCarbonCredit(*row)}), nil
}

func (h *predictionRPC) CreateCarbonCredit(ctx context.Context, req *connect.Request[pyv1.CreateCarbonCreditRequest]) (*connect.Response[pyv1.CreateCarbonCreditResponse], error) {
	p := db.CreateCarbonCreditParams{
		ProjectName:          req.Msg.GetProjectName(),
		CreditType:           sql.NullString{String: req.Msg.GetCreditType(), Valid: req.Msg.CreditType != ""},
		PricePerTon:          req.Msg.GetPricePerTon(),
		AvailableTons:        req.Msg.GetAvailableTons(),
		VintageYear:          sql.NullInt64{Int64: int64(req.Msg.GetVintageYear()), Valid: true},
		VerificationStandard: sql.NullString{String: req.Msg.GetVerificationStandard(), Valid: req.Msg.VerificationStandard != ""},
		Location:             sql.NullString{String: req.Msg.GetLocation(), Valid: req.Msg.Location != ""},
		ProjectDescription:   sql.NullString{String: req.Msg.GetProjectDescription(), Valid: req.Msg.ProjectDescription != ""},
	}
	row, err := h.svc.CreateCarbonCredit(ctx, p)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.CreateCarbonCreditResponse{CarbonCredit: toProtoCarbonCredit(*row)}), nil
}

func (h *predictionRPC) UpdateCarbonCredit(ctx context.Context, req *connect.Request[pyv1.UpdateCarbonCreditRequest]) (*connect.Response[pyv1.UpdateCarbonCreditResponse], error) {
	p := db.UpdateCarbonCreditParams{
		ID:                   req.Msg.GetId(),
		ProjectName:          req.Msg.GetProjectName(),
		CreditType:           sql.NullString{String: req.Msg.GetCreditType(), Valid: req.Msg.CreditType != ""},
		PricePerTon:          req.Msg.GetPricePerTon(),
		AvailableTons:        req.Msg.GetAvailableTons(),
		VintageYear:          sql.NullInt64{Int64: int64(req.Msg.GetVintageYear()), Valid: true},
		VerificationStandard: sql.NullString{String: req.Msg.GetVerificationStandard(), Valid: req.Msg.VerificationStandard != ""},
		Location:             sql.NullString{String: req.Msg.GetLocation(), Valid: req.Msg.Location != ""},
		ProjectDescription:   sql.NullString{String: req.Msg.GetProjectDescription(), Valid: req.Msg.ProjectDescription != ""},
	}
	row, err := h.svc.UpdateCarbonCredit(ctx, req.Msg.GetId(), p)
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.UpdateCarbonCreditResponse{CarbonCredit: toProtoCarbonCredit(*row)}), nil
}

func (h *predictionRPC) DeleteCarbonCredit(ctx context.Context, req *connect.Request[pyv1.DeleteCarbonCreditRequest]) (*connect.Response[pyv1.DeleteCarbonCreditResponse], error) {
	err := h.svc.DeleteCarbonCredit(ctx, req.Msg.GetId())
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.DeleteCarbonCreditResponse{}), nil
}

// HeatSink CRUD handlers

func (h *predictionRPC) ListHeatSinks(ctx context.Context, req *connect.Request[pyv1.ListHeatSinksRequest]) (*connect.Response[pyv1.ListHeatSinksResponse], error) {
	limit := int64(req.Msg.GetPagination().GetPageSize())
	page := int64(req.Msg.GetPagination().GetPage())
	if limit <= 0 {
		limit = 50
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	rows, total, err := h.svc.ListHeatSinks(ctx, limit, offset)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	out := &pyv1.ListHeatSinksResponse{
		Pagination: &pyv1.PaginationMetadata{
			Page:       int32(page),
			PageSize:   int32(limit),
			TotalCount: total,
		},
	}
	for _, r := range rows {
		out.HeatSinks = append(out.HeatSinks, toProtoHeatSink(r))
	}

	if limit > 0 {
		totalPages := total / limit
		if total%limit != 0 {
			totalPages++
		}
		out.Pagination.TotalPages = int32(totalPages)
		out.Pagination.HasNext = page*limit < total
		out.Pagination.HasPrevious = page > 1
	}

	return connect.NewResponse(out), nil
}

func (h *predictionRPC) GetHeatSink(ctx context.Context, req *connect.Request[pyv1.GetHeatSinkRequest]) (*connect.Response[pyv1.GetHeatSinkResponse], error) {
	row, err := h.svc.GetHeatSink(ctx, req.Msg.GetId())
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.GetHeatSinkResponse{HeatSink: toProtoHeatSink(*row)}), nil
}

func (h *predictionRPC) CreateHeatSink(ctx context.Context, req *connect.Request[pyv1.CreateHeatSinkRequest]) (*connect.Response[pyv1.CreateHeatSinkResponse], error) {
	p := db.CreateHeatSinkParams{
		Name:                    req.Msg.GetName(),
		LocationLat:             req.Msg.GetLocation().GetLatitude(),
		LocationLng:             req.Msg.GetLocation().GetLongitude(),
		Address:                 sql.NullString{String: req.Msg.GetAddress(), Valid: req.Msg.Address != ""},
		SinkType:                sql.NullString{String: req.Msg.GetSinkType(), Valid: req.Msg.SinkType != ""},
		CapacityMw:              req.Msg.GetCapacityMw(),
		CurrentDemandMw:         sql.NullFloat64{Float64: req.Msg.GetCurrentDemandMw(), Valid: true},
		TemperatureRequirementC: sql.NullFloat64{Float64: req.Msg.GetTemperatureRequirementC(), Valid: true},
		SeasonalFactor:          sql.NullFloat64{Float64: req.Msg.GetSeasonalFactor(), Valid: true},
		ConnectionCostPerKm:     sql.NullFloat64{Float64: req.Msg.GetConnectionCostPerKm(), Valid: true},
		HeatPricePerMwh:         sql.NullFloat64{Float64: req.Msg.GetHeatPricePerMwh(), Valid: true},
		OperatingHoursYear:      sql.NullInt64{Int64: int64(req.Msg.GetOperatingHoursYear()), Valid: true},
	}
	row, err := h.svc.CreateHeatSink(ctx, p)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.CreateHeatSinkResponse{HeatSink: toProtoHeatSink(*row)}), nil
}

func (h *predictionRPC) UpdateHeatSink(ctx context.Context, req *connect.Request[pyv1.UpdateHeatSinkRequest]) (*connect.Response[pyv1.UpdateHeatSinkResponse], error) {
	p := db.UpdateHeatSinkParams{
		ID:                      req.Msg.GetId(),
		Name:                    req.Msg.GetName(),
		LocationLat:             req.Msg.GetLocation().GetLatitude(),
		LocationLng:             req.Msg.GetLocation().GetLongitude(),
		Address:                 sql.NullString{String: req.Msg.GetAddress(), Valid: req.Msg.Address != ""},
		SinkType:                sql.NullString{String: req.Msg.GetSinkType(), Valid: req.Msg.SinkType != ""},
		CapacityMw:              req.Msg.GetCapacityMw(),
		CurrentDemandMw:         sql.NullFloat64{Float64: req.Msg.GetCurrentDemandMw(), Valid: true},
		TemperatureRequirementC: sql.NullFloat64{Float64: req.Msg.GetTemperatureRequirementC(), Valid: true},
		SeasonalFactor:          sql.NullFloat64{Float64: req.Msg.GetSeasonalFactor(), Valid: true},
		ConnectionCostPerKm:     sql.NullFloat64{Float64: req.Msg.GetConnectionCostPerKm(), Valid: true},
		HeatPricePerMwh:         sql.NullFloat64{Float64: req.Msg.GetHeatPricePerMwh(), Valid: true},
		OperatingHoursYear:      sql.NullInt64{Int64: int64(req.Msg.GetOperatingHoursYear()), Valid: true},
	}
	row, err := h.svc.UpdateHeatSink(ctx, req.Msg.GetId(), p)
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.UpdateHeatSinkResponse{HeatSink: toProtoHeatSink(*row)}), nil
}

func (h *predictionRPC) DeleteHeatSink(ctx context.Context, req *connect.Request[pyv1.DeleteHeatSinkRequest]) (*connect.Response[pyv1.DeleteHeatSinkResponse], error) {
	err := h.svc.DeleteHeatSink(ctx, req.Msg.GetId())
	if err != nil {
		if _, ok := err.(*service.NotFoundError); ok {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.DeleteHeatSinkResponse{}), nil
}

func (h *predictionRPC) CalculatePrediction(ctx context.Context, req *connect.Request[pyv1.CalculatePredictionRequest]) (*connect.Response[pyv1.CalculatePredictionResponse], error) {
	id := req.Msg.GetDataCenterId()
	resp, err := h.svc.Calculate(ctx, service.PredictionRequest{DataCenterID: id, AnalysisYears: 10})
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	out := &pyv1.CalculatePredictionResponse{
		DataCenterId: id,
		EnergyMetrics: &pyv1.EnergyMetrics{
			EffectiveItLoadKw: resp.EnergyMetrics.EffectiveITLoadKW,
			TotalPowerKw:      resp.EnergyMetrics.TotalPowerKW,
			AnnualEnergyKwh:   resp.EnergyMetrics.AnnualEnergyKWh,
		},
		HeatRecoveryMetrics: &pyv1.HeatRecoveryMetrics{
			WasteHeatAvailableKw:  resp.HeatRecoveryMetrics.WasteHeatAvailableKW,
			RecoverableHeatKw:     resp.HeatRecoveryMetrics.RecoverableHeatKW,
			AnnualHeatRecoveryKwh: resp.HeatRecoveryMetrics.AnnualHeatRecoveryKWh,
		},
		CarbonMetrics: &pyv1.CarbonMetrics{
			AnnualCo2EmissionsKg: resp.CarbonMetrics.AnnualCO2EmissionsKg,
		},
		FinancialMetrics: &pyv1.FinancialMetrics{
			NetPresentValue:      resp.FinancialMetrics.NetPresentValue,
			InternalRateOfReturn: resp.FinancialMetrics.InternalRateOfReturn,
			SimplePaybackYears:   resp.FinancialMetrics.SimplePaybackYears,
		},
	}
	return connect.NewResponse(out), nil
}

// PredictionResults handlers

func (h *predictionRPC) ListPredictionResults(ctx context.Context, req *connect.Request[pyv1.ListPredictionResultsRequest]) (*connect.Response[pyv1.ListPredictionResultsResponse], error) {
	// pagination
	page := int32(1)
	size := int32(50)
	if req.Msg.GetPagination() != nil {
		if req.Msg.GetPagination().GetPage() > 0 {
			page = req.Msg.GetPagination().GetPage()
		}
		if req.Msg.GetPagination().GetPageSize() > 0 {
			size = req.Msg.GetPagination().GetPageSize()
		}
	}
	limit := int64(size)
	offset := int64((page - 1) * size)
	// filters
	var dcID *int64
	if req.Msg.GetDataCenterId() > 0 {
		v := req.Msg.GetDataCenterId()
		dcID = &v
	}
	var scenario *string
	if req.Msg.GetScenarioName() != "" {
		v := req.Msg.GetScenarioName()
		scenario = &v
	}

	rows, total, err := h.svc.ListPredictionResults(ctx, limit, offset, dcID, scenario)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	out := &pyv1.ListPredictionResultsResponse{Pagination: &pyv1.PaginationMetadata{Page: page, PageSize: size, TotalCount: total}}
	for _, r := range rows {
		out.PredictionResults = append(out.PredictionResults, toProtoPredictionResult(r))
	}
	// compute total pages/flags
	if size > 0 {
		tp := total / int64(size)
		if total%int64(size) != 0 {
			tp++
		}
		out.Pagination.TotalPages = int32(tp)
		out.Pagination.HasNext = int64(page)*int64(size) < total
		out.Pagination.HasPrevious = page > 1
	}
	return connect.NewResponse(out), nil
}
func (h *predictionRPC) GetPredictionResult(ctx context.Context, req *connect.Request[pyv1.GetPredictionResultRequest]) (*connect.Response[pyv1.GetPredictionResultResponse], error) {
	row, err := h.svc.GetPredictionResult(ctx, req.Msg.GetId())
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.GetPredictionResultResponse{PredictionResult: toProtoPredictionResult(*row)}), nil
}

// New parity RPCs stubs
func (h *predictionRPC) DeletePredictionResult(ctx context.Context, req *connect.Request[pyv1.DeletePredictionResultRequest]) (*connect.Response[pyv1.DeletePredictionResultResponse], error) {
	if err := h.svc.DeletePredictionResult(ctx, req.Msg.GetId()); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&pyv1.DeletePredictionResultResponse{}), nil
}

func (h *predictionRPC) ListNearbyHeatSinks(ctx context.Context, req *connect.Request[pyv1.ListNearbyHeatSinksRequest]) (*connect.Response[pyv1.ListNearbyHeatSinksResponse], error) {
	sinks, err := h.svc.ListNearbyHeatSinks(ctx, req.Msg.GetDataCenterId(), req.Msg.GetMaxDistanceKm(), req.Msg.GetLimit())
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}
	out := &pyv1.ListNearbyHeatSinksResponse{}
	for _, hs := range sinks {
		out.HeatSinks = append(out.HeatSinks, toProtoHeatSink(hs))
	}
	return connect.NewResponse(out), nil
}

func (h *predictionRPC) GetPredictionAnalytics(ctx context.Context, _ *connect.Request[pyv1.GetPredictionAnalyticsRequest]) (*connect.Response[pyv1.GetPredictionAnalyticsResponse], error) {
	a, err := h.svc.GetPredictionAnalytics(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	out := &pyv1.GetPredictionAnalyticsResponse{
		PredictionAnalytics: &pyv1.PredictionAnalytics{
			TotalPredictions:      a.TotalPredictions,
			TotalDataCenters:      a.TotalDataCenters,
			TotalCarbonCredits:    a.TotalCarbonCredits,
			TotalHeatSinks:        a.TotalHeatSinks,
			AvgAnnualSavings:      a.AvgAnnualSavings,
			AvgInternalRateReturn: a.AvgInternalRateReturn,
			AvgPaybackPeriodYears: a.AvgPaybackPeriodYears,
		},
	}
	return connect.NewResponse(out), nil
}
