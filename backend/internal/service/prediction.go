package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"

	db "github.com/pyrecycleheat/backend/internal/database"
	"github.com/pyrecycleheat/backend/internal/engine"
)

type PredictionService struct {
	db      *sql.DB
	queries *db.Queries
	engine  *engine.PredictionEngine
	logger  *slog.Logger
}

func NewPredictionService(dbConn *sql.DB, queries *db.Queries, engine *engine.PredictionEngine, logger *slog.Logger) *PredictionService {
	return &PredictionService{db: dbConn, queries: queries, engine: engine, logger: logger}
}

// Data Centers CRUD

func (s *PredictionService) ListDataCenters(ctx context.Context, limit, offset int64) ([]db.DataCenter, int64, error) {
	total, err := s.queries.CountDataCenters(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("count data centers: %w", err)
	}
	rows, err := s.queries.ListDataCenters(ctx, db.ListDataCentersParams{Limit: limit, Offset: offset})
	if err != nil {
		return nil, 0, fmt.Errorf("list data centers: %w", err)
	}
	return rows, total, nil
}

func (s *PredictionService) GetDataCenter(ctx context.Context, id int64) (*db.DataCenter, error) {
	row, err := s.queries.GetDataCenter(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "DataCenter", ID: id}
		}
		return nil, fmt.Errorf("get data center: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) CreateDataCenter(ctx context.Context, p db.CreateDataCenterParams) (*db.DataCenter, error) {
	row, err := s.queries.CreateDataCenter(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("create data center: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) UpdateDataCenter(ctx context.Context, id int64, p db.UpdateDataCenterParams) (*db.DataCenter, error) {
	p.ID = id
	row, err := s.queries.UpdateDataCenter(ctx, p)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "DataCenter", ID: id}
		}
		return nil, fmt.Errorf("update data center: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) DeleteDataCenter(ctx context.Context, id int64) error {
	if err := s.queries.DeleteDataCenter(ctx, id); err != nil {
		return fmt.Errorf("delete data center: %w", err)
	}
	return nil
}

// Carbon Credits CRUD

func (s *PredictionService) ListCarbonCredits(ctx context.Context, limit, offset int64) ([]db.CarbonCredit, int64, error) {
	total, err := s.queries.CountCarbonCredits(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("count carbon credits: %w", err)
	}
	rows, err := s.queries.ListCarbonCredits(ctx, db.ListCarbonCreditsParams{Limit: limit, Offset: offset})
	if err != nil {
		return nil, 0, fmt.Errorf("list carbon credits: %w", err)
	}
	return rows, total, nil
}

func (s *PredictionService) GetCarbonCredit(ctx context.Context, id int64) (*db.CarbonCredit, error) {
	row, err := s.queries.GetCarbonCredit(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "CarbonCredit", ID: id}
		}
		return nil, fmt.Errorf("get carbon credit: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) CreateCarbonCredit(ctx context.Context, p db.CreateCarbonCreditParams) (*db.CarbonCredit, error) {
	row, err := s.queries.CreateCarbonCredit(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("create carbon credit: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) UpdateCarbonCredit(ctx context.Context, id int64, p db.UpdateCarbonCreditParams) (*db.CarbonCredit, error) {
	p.ID = id
	row, err := s.queries.UpdateCarbonCredit(ctx, p)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "CarbonCredit", ID: id}
		}
		return nil, fmt.Errorf("update carbon credit: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) DeleteCarbonCredit(ctx context.Context, id int64) error {
	if err := s.queries.DeleteCarbonCredit(ctx, id); err != nil {
		return fmt.Errorf("delete carbon credit: %w", err)
	}
	return nil
}

// Heat Sinks CRUD

func (s *PredictionService) ListHeatSinks(ctx context.Context, limit, offset int64) ([]db.HeatSink, int64, error) {
	total, err := s.queries.CountHeatSinks(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("count heat sinks: %w", err)
	}
	rows, err := s.queries.ListHeatSinks(ctx, db.ListHeatSinksParams{Limit: limit, Offset: offset})
	if err != nil {
		return nil, 0, fmt.Errorf("list heat sinks: %w", err)
	}
	return rows, total, nil
}

func (s *PredictionService) GetHeatSink(ctx context.Context, id int64) (*db.HeatSink, error) {
	row, err := s.queries.GetHeatSink(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "HeatSink", ID: id}
		}
		return nil, fmt.Errorf("get heat sink: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) CreateHeatSink(ctx context.Context, p db.CreateHeatSinkParams) (*db.HeatSink, error) {
	row, err := s.queries.CreateHeatSink(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("create heat sink: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) UpdateHeatSink(ctx context.Context, id int64, p db.UpdateHeatSinkParams) (*db.HeatSink, error) {
	p.ID = id
	row, err := s.queries.UpdateHeatSink(ctx, p)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "HeatSink", ID: id}
		}
		return nil, fmt.Errorf("update heat sink: %w", err)
	}
	return &row, nil
}

func (s *PredictionService) DeleteHeatSink(ctx context.Context, id int64) error {
	if err := s.queries.DeleteHeatSink(ctx, id); err != nil {
		return fmt.Errorf("delete heat sink: %w", err)
	}
	return nil
}

// Prediction Results listing/getting
func (s *PredictionService) ListPredictionResults(ctx context.Context, limit, offset int64, dataCenterID *int64, scenarioName *string) ([]db.PredictionResult, int64, error) {
	var rows []db.PredictionResult
	var err error
	switch {
	case dataCenterID != nil && scenarioName == nil:
		rows, err = s.queries.GetPredictionResultsByDataCenter(ctx, *dataCenterID)
	case scenarioName != nil && dataCenterID == nil:
		rows, err = s.queries.GetPredictionResultsByScenario(ctx, sql.NullString{String: *scenarioName, Valid: true})
	default:
		rows, err = s.queries.ListPredictionResults(ctx, db.ListPredictionResultsParams{Limit: limit, Offset: offset})
	}
	if err != nil {
		return nil, 0, fmt.Errorf("list prediction results: %w", err)
	}
	total, _ := s.queries.CountPredictionResults(ctx)
	return rows, total, nil
}

func (s *PredictionService) GetPredictionResult(ctx context.Context, id int64) (*db.PredictionResult, error) {
	row, err := s.queries.GetPredictionResult(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "PredictionResult", ID: id}
		}
		return nil, fmt.Errorf("get prediction result: %w", err)
	}
	return &row, nil
}

// New parity: delete prediction result
func (s *PredictionService) DeletePredictionResult(ctx context.Context, id int64) error {
	if err := s.queries.DeletePredictionResult(ctx, id); err != nil {
		return fmt.Errorf("delete prediction result: %w", err)
	}
	return nil
}

// New parity: list nearby heat sinks for a data center within distance and limit
func (s *PredictionService) ListNearbyHeatSinks(ctx context.Context, dataCenterID int64, maxDistanceKM float64, limit int32) ([]db.HeatSink, error) {
	dc, err := s.queries.GetDataCenter(ctx, dataCenterID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &NotFoundError{Resource: "DataCenter", ID: dataCenterID}
		}
		return nil, fmt.Errorf("get data center: %w", err)
	}
	sinks, err := s.queries.ListHeatSinks(ctx, db.ListHeatSinksParams{Limit: int64(1000), Offset: 0})
	if err != nil {
		return nil, fmt.Errorf("list heat sinks: %w", err)
	}
	type pair struct {
		hs   db.HeatSink
		dist float64
	}
	pairs := make([]pair, 0, len(sinks))
	for _, hs := range sinks {
		d := engine.HaversineDistanceKM(dc.LocationLat, dc.LocationLng, hs.LocationLat, hs.LocationLng)
		if d <= maxDistanceKM {
			pairs = append(pairs, pair{hs: hs, dist: d})
		}
	}
	// simple selection sort for top limit
	n := int(limit)
	if n <= 0 || n > len(pairs) {
		n = len(pairs)
	}
	for i := 0; i < n; i++ {
		minIdx := i
		for j := i + 1; j < len(pairs); j++ {
			if pairs[j].dist < pairs[minIdx].dist {
				minIdx = j
			}
		}
		pairs[i], pairs[minIdx] = pairs[minIdx], pairs[i]
	}
	out := make([]db.HeatSink, 0, n)
	for i := 0; i < n; i++ {
		out = append(out, pairs[i].hs)
	}
	return out, nil
}

// New parity: analytics summary for predictions
type PredictionAnalyticsSummary struct {
	TotalPredictions      int64
	TotalDataCenters      int64
	TotalCarbonCredits    int64
	TotalHeatSinks        int64
	AvgAnnualSavings      float64
	AvgInternalRateReturn float64
	AvgPaybackPeriodYears float64
}

func (s *PredictionService) GetPredictionAnalytics(ctx context.Context) (*PredictionAnalyticsSummary, error) {
	// reuse queries from prediction_results and counts
	totalPreds, err := s.queries.CountPredictionResults(ctx)
	if err != nil {
		return nil, fmt.Errorf("count predictions: %w", err)
	}
	totalDCs, err := s.queries.CountDataCenters(ctx)
	if err != nil {
		return nil, fmt.Errorf("count data centers: %w", err)
	}
	totalCCs, err := s.queries.CountCarbonCredits(ctx)
	if err != nil {
		return nil, fmt.Errorf("count carbon credits: %w", err)
	}
	totalHS, err := s.queries.CountHeatSinks(ctx)
	if err != nil {
		return nil, fmt.Errorf("count heat sinks: %w", err)
	}

	// compute averages via SQL aggregate using existing list (fallback simple calc)
	rows, err := s.queries.ListPredictionResults(ctx, db.ListPredictionResultsParams{Limit: 100000, Offset: 0})
	if err != nil {
		return nil, fmt.Errorf("list predictions: %w", err)
	}
	var sumSavings, sumIRR, sumPay float64
	for _, r := range rows {
		if r.AnnualSavings.Valid {
			sumSavings += r.AnnualSavings.Float64
		}
		if r.InternalRateReturn.Valid {
			sumIRR += r.InternalRateReturn.Float64
		}
		if r.PaybackPeriodYears.Valid {
			sumPay += r.PaybackPeriodYears.Float64
		}
	}
	denom := float64(len(rows))
	avgSavings := 0.0
	avgIRR := 0.0
	avgPay := 0.0
	if denom > 0 {
		avgSavings = sumSavings / denom
		avgIRR = sumIRR / denom
		avgPay = sumPay / denom
	}
	return &PredictionAnalyticsSummary{
		TotalPredictions:      totalPreds,
		TotalDataCenters:      totalDCs,
		TotalCarbonCredits:    totalCCs,
		TotalHeatSinks:        totalHS,
		AvgAnnualSavings:      avgSavings,
		AvgInternalRateReturn: avgIRR,
		AvgPaybackPeriodYears: avgPay,
	}, nil
}

type PredictionRequest struct {
	DataCenterID          int64
	CarbonCreditID        int64
	HeatSinkID            int64
	ScenarioName          string
	AnalysisYears         int
	DiscountRate          float64
	CustomPUE             *float64
	CustomEfficiency      *float64
	CustomElectricityRate *float64
	CustomCarbonPrice     *float64
}

type PredictionResponse struct {
	EnergyMetrics       engine.EnergyMetrics
	HeatRecoveryMetrics engine.HeatRecoveryMetrics
	CarbonMetrics       engine.CarbonMetrics
	FinancialMetrics    engine.FinancialMetrics
}

func (s *PredictionService) Calculate(ctx context.Context, req PredictionRequest) (*PredictionResponse, error) {
	dc, err := s.GetDataCenter(ctx, req.DataCenterID)
	if err != nil {
		return nil, err
	}

	pue := ptrOrDefaultFloat64(req.CustomPUE, valFloat64(dc.Pue, 1.5))
	util := valFloat64(dc.UtilizationPercent, 70)
	hours := int(valInt64(dc.OperatingHoursYear, 8760))
	energy := s.engine.CalculateEnergy(dc.TotalItLoadKw, pue, util, hours)

	heatRec := s.engine.CalculateHeatRecovery(dc.TotalItLoadKw, util, hours, 0)

	carbon := s.engine.CalculateCarbon(energy.AnnualEnergyKWh, valFloat64(dc.RenewablePercent, 0))

	annualNet := heatRec.AnnualGasCostSavings
	disc := req.DiscountRate
	if disc <= 0 {
		disc = 0.08
	}
	totalCapex := 0.0
	fin := s.engine.CalculateFinancial(totalCapex, annualNet, req.AnalysisYears, disc)

	return &PredictionResponse{
		EnergyMetrics:       energy,
		HeatRecoveryMetrics: heatRec,
		CarbonMetrics:       carbon,
		FinancialMetrics:    fin,
	}, nil
}
