package engine

import "math"

// PredictionEngine encapsulates configuration for core calculations.
type PredictionEngine struct {
	// Grid carbon intensity in kg CO2 per kWh.
	CarbonIntensityKgPerKWh float64
	// Heat recovery efficiency (0..1).
	HeatRecoveryEfficiency float64
	// Transmission efficiency (0..1).
	TransmissionEfficiency float64
}

// NewPredictionEngine returns a PredictionEngine with sensible defaults.
func NewPredictionEngine() *PredictionEngine {
	return &PredictionEngine{
		CarbonIntensityKgPerKWh: 0.5936, // default documentation value
		HeatRecoveryEfficiency:  0.85,
		TransmissionEfficiency:  0.98,
	}
}

// clamp constrains v to [min, max].
func clamp(v, min, max float64) float64 {
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}

// almostEqual compares two floats with relative tolerance.
func almostEqual(a, b, relTol float64) bool {
	diff := math.Abs(a - b)
	return diff <= relTol*math.Max(1, math.Max(math.Abs(a), math.Abs(b)))
}
