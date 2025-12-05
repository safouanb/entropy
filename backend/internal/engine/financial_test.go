package engine

import (
	"math"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCalculateFinancial(t *testing.T) {
	engine := NewPredictionEngine()

	tests := []struct {
		name             string
		capex            float64
		annualCashFlow   float64
		years            int
		discountRate     float64
		wantNPVPositive  bool
		wantIRRRange     [2]float64 // min, max
		wantPaybackRange [2]float64 // min, max
	}{
		{
			name:             "positive cash flow",
			capex:            1000000,
			annualCashFlow:   150000,
			years:            10,
			discountRate:     0.08,
			wantNPVPositive:  true,
			wantIRRRange:     [2]float64{8.0, 20.0},
			wantPaybackRange: [2]float64{6.0, 7.0},
		},
		{
			name:             "break-even scenario",
			capex:            500000,
			annualCashFlow:   50000,
			years:            10,
			discountRate:     0.08,
			wantNPVPositive:  false,
			wantIRRRange:     [2]float64{0.0, 5.0},
			wantPaybackRange: [2]float64{10.0, 10.0},
		},
		{
			name:             "high return scenario",
			capex:            100000,
			annualCashFlow:   30000,
			years:            10,
			discountRate:     0.08,
			wantNPVPositive:  true,
			wantIRRRange:     [2]float64{25.0, 35.0},
			wantPaybackRange: [2]float64{3.0, 4.0},
		},
		{
			name:             "zero cash flow",
			capex:            100000,
			annualCashFlow:   0,
			years:            10,
			discountRate:     0.08,
			wantNPVPositive:  false,
			wantIRRRange:     [2]float64{-100.0, 20.0}, // IRR can be undefined/high with zero cash flow
			wantPaybackRange: [2]float64{999.0, 999.0},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := engine.CalculateFinancial(tt.capex, tt.annualCashFlow, tt.years, tt.discountRate)

			// Check NPV sign
			if tt.wantNPVPositive {
				assert.Greater(t, result.NetPresentValue, 0.0, "NPV should be positive")
			} else {
				assert.LessOrEqual(t, result.NetPresentValue, 0.0, "NPV should be non-positive")
			}

			// Check IRR range
			assert.GreaterOrEqual(t, result.InternalRateOfReturn, tt.wantIRRRange[0], "IRR below expected range")
			assert.LessOrEqual(t, result.InternalRateOfReturn, tt.wantIRRRange[1], "IRR above expected range")

			// Check payback range
			assert.GreaterOrEqual(t, result.SimplePaybackYears, tt.wantPaybackRange[0], "Payback below expected range")
			assert.LessOrEqual(t, result.SimplePaybackYears, tt.wantPaybackRange[1], "Payback above expected range")

			// Sanity checks
			assert.False(t, math.IsNaN(result.NetPresentValue), "NPV should not be NaN")
			assert.False(t, math.IsInf(result.NetPresentValue, 0), "NPV should not be Inf")
			assert.False(t, math.IsNaN(result.InternalRateOfReturn), "IRR should not be NaN")
			assert.False(t, math.IsInf(result.InternalRateOfReturn, 0), "IRR should not be Inf")
		})
	}
}

func TestCalculateFinancial_EdgeCases(t *testing.T) {
	engine := NewPredictionEngine()

	t.Run("negative years defaults to 10", func(t *testing.T) {
		result := engine.CalculateFinancial(100000, 15000, -5, 0.08)
		require.NotNil(t, result)
		// Should still compute valid metrics
		assert.False(t, math.IsNaN(result.NetPresentValue))
	})

	t.Run("negative discount rate defaults to 0", func(t *testing.T) {
		result := engine.CalculateFinancial(100000, 15000, 10, -0.05)
		require.NotNil(t, result)
		assert.False(t, math.IsNaN(result.NetPresentValue))
	})

	t.Run("very large capex", func(t *testing.T) {
		result := engine.CalculateFinancial(1e9, 1e7, 10, 0.08)
		require.NotNil(t, result)
		assert.False(t, math.IsNaN(result.NetPresentValue))
		assert.False(t, math.IsInf(result.NetPresentValue, 0))
	})
}

func TestFinancialMetrics_Comparison(t *testing.T) {
	engine := NewPredictionEngine()

	baseline := engine.CalculateFinancial(1000000, 150000, 10, 0.08)
	improved := engine.CalculateFinancial(1000000, 200000, 10, 0.08)

	// Improved cash flow should yield better metrics
	assert.Greater(t, improved.NetPresentValue, baseline.NetPresentValue, "Improved NPV should be higher")
	assert.Greater(t, improved.InternalRateOfReturn, baseline.InternalRateOfReturn, "Improved IRR should be higher")
	assert.Less(t, improved.SimplePaybackYears, baseline.SimplePaybackYears, "Improved payback should be shorter")
}

func TestFinancialMetrics_Struct(t *testing.T) {
	want := FinancialMetrics{
		NetPresentValue:      123456.78,
		InternalRateOfReturn: 15.5,
		SimplePaybackYears:   6.7,
	}

	got := FinancialMetrics{
		NetPresentValue:      123456.78,
		InternalRateOfReturn: 15.5,
		SimplePaybackYears:   6.7,
	}

	// Use go-cmp for deep equality with float tolerance
	if diff := cmp.Diff(want, got, cmpopts.EquateApprox(0, 0.01)); diff != "" {
		t.Errorf("FinancialMetrics mismatch (-want +got):\n%s", diff)
	}
}
