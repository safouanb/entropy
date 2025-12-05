package router

import (
	"database/sql"
	"time"

	pyv1 "github.com/pyrecycleheat/backend/api/gen/go/pyrecycleheat/v1"
	db "github.com/pyrecycleheat/backend/internal/database"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// Helpers to map sqlc models to proto messages
func toProtoTimestamp(s string) *timestamppb.Timestamp {
	if s == "" {
		return nil
	}
	// try RFC3339 first
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return timestamppb.New(t)
	}
	// fallback SQLite datetime 'YYYY-MM-DD HH:MM:SS'
	if t, err := time.Parse("2006-01-02 15:04:05", s); err == nil {
		return timestamppb.New(t)
	}
	return nil
}

func toProtoHeatCenter(hc db.HeatCenter) *pyv1.HeatCenter {
	out := &pyv1.HeatCenter{
		Id:            hc.ID,
		Name:          hc.Name,
		Location:      &pyv1.Location{Latitude: hc.LocationLat, Longitude: hc.LocationLng},
		MaxCapacityMw: hc.MaxCapacityMw,
	}
	if hc.CurrentOutputMw.Valid {
		out.CurrentOutputMw = hc.CurrentOutputMw.Float64
	}
	if hc.EfficiencyPercent.Valid {
		out.EfficiencyPercent = hc.EfficiencyPercent.Float64
	}
	if hc.FuelType.Valid {
		out.FuelType = hc.FuelType.String
	}
	if hc.IsActive.Valid {
		out.IsActive = hc.IsActive.Int64 == 1
	}
	if hc.Address.Valid {
		out.Address = hc.Address.String
	}
	return out
}

func toProtoDemandSite(ds db.DemandSite) *pyv1.DemandSite {
	out := &pyv1.DemandSite{
		Id:           ds.ID,
		Name:         ds.Name,
		Location:     &pyv1.Location{Latitude: ds.LocationLat, Longitude: ds.LocationLng},
		PeakDemandMw: ds.PeakDemandMw,
	}
	if ds.Address.Valid {
		out.Address = ds.Address.String
	}
	if ds.SiteType.Valid {
		out.SiteType = ds.SiteType.String
	}
	if ds.CurrentDemandMw.Valid {
		out.CurrentDemandMw = ds.CurrentDemandMw.Float64
	}
	if ds.AnnualConsumptionMwh.Valid {
		out.AnnualConsumptionMwh = ds.AnnualConsumptionMwh.Float64
	}
	if ds.IsConnected.Valid {
		out.IsConnected = ds.IsConnected.Int64 == 1
	}
	return out
}

func toProtoHeatSink(hs db.HeatSink) *pyv1.HeatSink {
	out := &pyv1.HeatSink{
		Id:         hs.ID,
		Name:       hs.Name,
		Location:   &pyv1.Location{Latitude: hs.LocationLat, Longitude: hs.LocationLng},
		CapacityMw: hs.CapacityMw,
	}
	if hs.Address.Valid {
		out.Address = hs.Address.String
	}
	if hs.SinkType.Valid {
		out.SinkType = hs.SinkType.String
	}
	if hs.CurrentDemandMw.Valid {
		out.CurrentDemandMw = hs.CurrentDemandMw.Float64
	}
	if hs.TemperatureRequirementC.Valid {
		out.TemperatureRequirementC = hs.TemperatureRequirementC.Float64
	}
	if hs.SeasonalFactor.Valid {
		out.SeasonalFactor = hs.SeasonalFactor.Float64
	}
	if hs.ConnectionCostPerKm.Valid {
		out.ConnectionCostPerKm = hs.ConnectionCostPerKm.Float64
	}
	if hs.HeatPricePerMwh.Valid {
		out.HeatPricePerMwh = hs.HeatPricePerMwh.Float64
	}
	if hs.OperatingHoursYear.Valid {
		out.OperatingHoursYear = int32(hs.OperatingHoursYear.Int64)
	}
	return out
}

func toProtoPredictionResult(p db.PredictionResult) *pyv1.PredictionResult {
	out := &pyv1.PredictionResult{
		Id:           p.ID,
		DataCenterId: p.DataCenterID,
	}
	if p.CarbonCreditID.Valid {
		out.CarbonCreditId = p.CarbonCreditID.Int64
	}
	if p.HeatSinkID.Valid {
		out.HeatSinkId = p.HeatSinkID.Int64
	}
	if p.ScenarioName.Valid {
		out.ScenarioName = p.ScenarioName.String
	}
	if p.AnalysisYears.Valid {
		out.AnalysisYears = int32(p.AnalysisYears.Int64)
	}
	if p.TotalCapex.Valid {
		out.TotalCapex = p.TotalCapex.Float64
	}
	if p.AnnualOpex.Valid {
		out.AnnualOpex = p.AnnualOpex.Float64
	}
	if p.AnnualSavings.Valid {
		out.AnnualSavings = p.AnnualSavings.Float64
	}
	if p.NetPresentValue.Valid {
		out.NetPresentValue = p.NetPresentValue.Float64
	}
	if p.InternalRateReturn.Valid {
		out.InternalRateReturn = p.InternalRateReturn.Float64
	}
	if p.PaybackPeriodYears.Valid {
		out.PaybackPeriodYears = p.PaybackPeriodYears.Float64
	}
	if p.InvestmentGrade.Valid {
		out.InvestmentGrade = p.InvestmentGrade.String
	}
	if p.AnnualCo2ReductionKg.Valid {
		out.AnnualCo2ReductionKg = p.AnnualCo2ReductionKg.Float64
	}
	if p.AnnualHeatRecoveryKwh.Valid {
		out.AnnualHeatRecoveryKwh = p.AnnualHeatRecoveryKwh.Float64
	}
	if p.DetailedResults.Valid {
		out.DetailedResultsJson = p.DetailedResults.String
	}
	if p.CreatedAt != "" {
		out.CreatedAt = toProtoTimestamp(p.CreatedAt)
	}
	return out
}

// Helper mappers for prediction entities

func toProtoDataCenter(dc db.DataCenter) *pyv1.DataCenter {
	return &pyv1.DataCenter{
		Id:                  dc.ID,
		Name:                dc.Name,
		Location:            &pyv1.Location{Latitude: dc.LocationLat, Longitude: dc.LocationLng},
		Address:             valString(dc.Address, ""),
		DcType:              valString(dc.DcType, ""),
		TotalItLoadKw:       dc.TotalItLoadKw,
		Pue:                 valFloat64(dc.Pue, 0),
		UtilizationPercent:  valFloat64(dc.UtilizationPercent, 0),
		CoolingType:         valString(dc.CoolingType, ""),
		EnergySource:        valString(dc.EnergySource, ""),
		RenewablePercent:    valFloat64(dc.RenewablePercent, 0),
		ElectricityCostKwh:  valFloat64(dc.ElectricityCostKwh, 0),
		OperatingHoursYear:  valInt32(dc.OperatingHoursYear, 0),
		HeatRecoveryEnabled: valInt32(dc.HeatRecoveryEnabled, 0) == 1,
	}
}

func toProtoCarbonCredit(cc db.CarbonCredit) *pyv1.CarbonCredit {
	return &pyv1.CarbonCredit{
		Id:                   cc.ID,
		ProjectName:          cc.ProjectName,
		CreditType:           valString(cc.CreditType, ""),
		PricePerTon:          cc.PricePerTon,
		AvailableTons:        cc.AvailableTons,
		VintageYear:          valInt32(cc.VintageYear, 0),
		VerificationStandard: valString(cc.VerificationStandard, ""),
		Location:             valString(cc.Location, ""),
		ProjectDescription:   valString(cc.ProjectDescription, ""),
	}
}

// Helper functions to handle nullable SQL types

func valString(ns sql.NullString, def string) string {
	if ns.Valid {
		return ns.String
	}
	return def
}

func valFloat64(nf sql.NullFloat64, def float64) float64 {
	if nf.Valid {
		return nf.Float64
	}
	return def
}

func valInt32(ni sql.NullInt64, def int32) int32 {
	if ni.Valid {
		return int32(ni.Int64)
	}
	return def
}

func boolToInt64(b bool) int64 {
	if b {
		return 1
	}
	return 0
}
