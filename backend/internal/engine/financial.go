package engine

import (
	"math"

	"github.com/shopspring/decimal"
)

// FinancialMetrics captures core investment KPIs.
type FinancialMetrics struct {
	NetPresentValue      float64
	InternalRateOfReturn float64 // percent
	SimplePaybackYears   float64
}

// CalculateFinancial computes NPV, IRR, and payback based on CAPEX and annual net cash flow.
// Uses native Go implementations and decimal for money precision.
func (e *PredictionEngine) CalculateFinancial(totalCapex, annualNetCashFlow float64, years int, discountRate float64) FinancialMetrics {
	if years <= 0 {
		years = 10
	}
	if discountRate < 0 {
		discountRate = 0
	}

	// Convert to decimal for money operations
	capexDec := decimal.NewFromFloat(totalCapex)
	cashFlowDec := decimal.NewFromFloat(annualNetCashFlow)

	// Build cash flows: -capex at t0, +annualNetCashFlow each year
	cashFlows := make([]float64, 0, years+1)
	cashFlows = append(cashFlows, -totalCapex)
	for i := 0; i < years; i++ {
		cashFlows = append(cashFlows, annualNetCashFlow)
	}

	// NPV calculation
	npv := 0.0
	for i, cf := range cashFlows {
		npv += cf / math.Pow(1+discountRate, float64(i))
	}
	if math.IsNaN(npv) || math.IsInf(npv, 0) {
		npv = 0.0
	}

	// IRR using Newton-Raphson
	irr := internalRateOfReturn(cashFlows, 0.1)
	if math.IsNaN(irr) || math.IsInf(irr, 0) || irr < -0.99 || irr > 10 {
		irr = 0.0
	}

	// Simple payback using decimal for precision
	payback := 999.0
	if cashFlowDec.GreaterThan(decimal.Zero) {
		paybackDec := capexDec.Div(cashFlowDec)
		payback, _ = paybackDec.Float64()
		if payback > 999.0 || math.IsNaN(payback) {
			payback = 999.0
		}
	}

	return FinancialMetrics{
		NetPresentValue:      round2(npv),
		InternalRateOfReturn: round2(irr * 100),
		SimplePaybackYears:   round1(payback),
	}
}

// internalRateOfReturn is a fallback Newton-Raphson implementation.
func internalRateOfReturn(cashFlows []float64, guess float64) float64 {
	if len(cashFlows) < 2 {
		return 0
	}
	rate := guess
	iterations := 0
	maxIterations := 100
	for iterations <= maxIterations {
		npv := 0.0
		d := 0.0
		for i, cf := range cashFlows {
			denom := math.Pow(1+rate, float64(i))
			npv += cf / denom
			if i > 0 {
				d += -float64(i) * cf / math.Pow(1+rate, float64(i+1))
			}
		}
		if math.Abs(npv) < 1e-6 {
			return rate
		}
		if math.Abs(d) < 1e-10 {
			break
		}
		rate -= npv / d
		if rate < -0.99 {
			rate = -0.99
		}
		if rate > 10 {
			rate = 10
		}
		iterations++
	}
	return rate
}

func round2(v float64) float64 { return math.Round(v*100) / 100 }
func round1(v float64) float64 { return math.Round(v*10) / 10 }
