package engine

import (
	"context"
	"fmt"

	"golang.org/x/sync/errgroup"
)

// SensitivityParam defines a parameter to vary in sensitivity analysis.
type SensitivityParam struct {
	Name   string
	Values []float64
}

// SensitivityResult captures the outcome of a single sensitivity run.
type SensitivityResult struct {
	ParamName  string
	ParamValue float64
	NPV        float64
	IRR        float64
	Payback    float64
}

// RunSensitivityAnalysis performs parallel sensitivity analysis across multiple parameters.
// Each parameter is varied independently while others remain at baseline.
func (e *PredictionEngine) RunSensitivityAnalysis(
	ctx context.Context,
	baseCapex float64,
	baseCashFlow float64,
	years int,
	discountRate float64,
	params []SensitivityParam,
) ([]SensitivityResult, error) {
	g, ctx := errgroup.WithContext(ctx)
	resultsChan := make(chan SensitivityResult, 100)

	// Launch goroutines for each parameter variation
	for _, param := range params {
		param := param // capture loop variable
		for _, value := range param.Values {
			value := value // capture loop variable

			g.Go(func() error {
				select {
				case <-ctx.Done():
					return ctx.Err()
				default:
				}

				// Apply parameter variation (simplified: adjust cash flow proportionally)
				adjustedCashFlow := baseCashFlow
				if param.Name == "cash_flow_multiplier" {
					adjustedCashFlow = baseCashFlow * value
				}

				// Calculate financial metrics
				metrics := e.CalculateFinancial(baseCapex, adjustedCashFlow, years, discountRate)

				result := SensitivityResult{
					ParamName:  param.Name,
					ParamValue: value,
					NPV:        metrics.NetPresentValue,
					IRR:        metrics.InternalRateOfReturn,
					Payback:    metrics.SimplePaybackYears,
				}

				select {
				case resultsChan <- result:
				case <-ctx.Done():
					return ctx.Err()
				}

				return nil
			})
		}
	}

	// Close results channel when all goroutines complete
	go func() {
		_ = g.Wait()
		close(resultsChan)
	}()

	// Collect results
	var results []SensitivityResult
	for result := range resultsChan {
		results = append(results, result)
	}

	// Check for errors
	if err := g.Wait(); err != nil {
		return nil, fmt.Errorf("sensitivity analysis: %w", err)
	}

	return results, nil
}
