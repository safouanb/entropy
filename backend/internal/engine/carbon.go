package engine

// CarbonMetrics captures emissions and offsets.
type CarbonMetrics struct {
	AnnualCO2EmissionsKg float64
	GridEnergyKWh        float64
	RenewableEnergyKWh   float64
}

// CalculateCarbon computes CO2 emissions based on annual energy and renewable share.
// Mirrors docs/algorithms/04-carbon-emissions.md.
func (e *PredictionEngine) CalculateCarbon(annualEnergyKWh, renewablePercent float64) CarbonMetrics {
	if renewablePercent < 0 {
		renewablePercent = 0
	}
	if renewablePercent > 100 {
		renewablePercent = 100
	}
	gridEnergy := annualEnergyKWh * (1 - renewablePercent/100.0)
	co2Kg := gridEnergy * e.CarbonIntensityKgPerKWh
	return CarbonMetrics{
		AnnualCO2EmissionsKg: co2Kg,
		GridEnergyKWh:        gridEnergy,
		RenewableEnergyKWh:   annualEnergyKWh - gridEnergy,
	}
}
