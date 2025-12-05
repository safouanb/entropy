package engine

// EnergyMetrics captures core energy KPIs.
type EnergyMetrics struct {
	EffectiveITLoadKW    float64
	TotalPowerKW         float64
	AnnualEnergyKWh      float64
	CoolingLoadKW        float64
	WasteHeatGeneratedKW float64
}

// CalculateEnergy computes energy consumption metrics given IT load, PUE and utilization.
// Mirrors docs/algorithms/01-energy-consumption-model.md.
func (e *PredictionEngine) CalculateEnergy(itLoadKW, pue, utilizationPercent float64, operatingHoursPerYear int) EnergyMetrics {
	if operatingHoursPerYear <= 0 {
		operatingHoursPerYear = 8760
	}
	// Invariants
	if pue < 1.0 {
		pue = 1.0
	}
	if utilizationPercent < 0 {
		utilizationPercent = 0
	}
	if utilizationPercent > 100 {
		utilizationPercent = 100
	}
	if itLoadKW < 0 {
		itLoadKW = 0
	}

	effectiveIT := itLoadKW * (utilizationPercent / 100.0)
	totalPower := effectiveIT * pue
	annualEnergy := totalPower * float64(operatingHoursPerYear)
	coolingLoad := totalPower - effectiveIT
	wasteHeat := effectiveIT * 0.95

	return EnergyMetrics{
		EffectiveITLoadKW:    effectiveIT,
		TotalPowerKW:         totalPower,
		AnnualEnergyKWh:      annualEnergy,
		CoolingLoadKW:        coolingLoad,
		WasteHeatGeneratedKW: wasteHeat,
	}
}
