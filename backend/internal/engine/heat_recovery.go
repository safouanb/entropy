package engine

// HeatRecoveryMetrics captures waste heat and recoverable heat KPIs.
type HeatRecoveryMetrics struct {
	WasteHeatAvailableKW  float64
	RecoverableHeatKW     float64
	AnnualHeatRecoveryKWh float64
	EquivalentGasTherms   float64
	AnnualGasCostSavings  float64
	CO2AvoidedKgPerYear   float64
	DistanceEfficiency    float64
}

// CalculateHeatRecovery computes heat recovery given IT load, utilization, hours, and distance.
// Mirrors docs/algorithms/02-heat-recovery-model.md.
func (e *PredictionEngine) CalculateHeatRecovery(itLoadKW, utilizationPercent float64, operatingHoursPerYear int, distanceToSinkKM float64) HeatRecoveryMetrics {
	if operatingHoursPerYear <= 0 {
		operatingHoursPerYear = 8760
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
	if distanceToSinkKM < 0 {
		distanceToSinkKM = 0
	}

	effectiveIT := itLoadKW * (utilizationPercent / 100.0)
	wasteHeatKW := effectiveIT * 0.95

	distanceEff := 1 - (distanceToSinkKM * 0.05)
	if distanceEff < 0.5 {
		distanceEff = 0.5
	}

	recoverable := wasteHeatKW * e.HeatRecoveryEfficiency * e.TransmissionEfficiency * distanceEff
	annualKWh := recoverable * float64(operatingHoursPerYear)

	// Constants aligned with Python implementation
	gasTherms := annualKWh * 0.0341
	gasSavings := gasTherms * 1.2
	co2Avoided := gasTherms * 5.3

	return HeatRecoveryMetrics{
		WasteHeatAvailableKW:  wasteHeatKW,
		RecoverableHeatKW:     recoverable,
		AnnualHeatRecoveryKWh: annualKWh,
		EquivalentGasTherms:   gasTherms,
		AnnualGasCostSavings:  gasSavings,
		CO2AvoidedKgPerYear:   co2Avoided,
		DistanceEfficiency:    distanceEff,
	}
}
