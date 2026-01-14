package engine

// ScenarioResult captures the feasibility metrics for a specific ownership model.
type ScenarioResult struct {
	OwnershipModel string `json:"ownershipModel"` // "DC_OWNS", "UTILITY_OWNS", "THIRD_PARTY"

	// Infrastructure
	RequiresHeatExchanger bool    `json:"requiresHeatExchanger"`
	RequiresPipeline      bool    `json:"requiresPipeline"`
	PipelineLengthKm      float64 `json:"pipelineLengthKm"`
	RequiresHeatPump      bool    `json:"requiresHeatPump"`

	// Heat Delivered (after losses)
	HeatDeliveredMinMwhYear float64 `json:"heatDeliveredMinMwhYear"`
	HeatDeliveredMaxMwhYear float64 `json:"heatDeliveredMaxMwhYear"`

	// Financial Ranges
	CapexMinEur float64 `json:"capexMinEur"`
	CapexMaxEur float64 `json:"capexMaxEur"`
	// InvestmentRequired captures the actual cash outlier for the owner
	InvestmentRequiredMinEur float64 `json:"investmentRequiredMinEur"`
	InvestmentRequiredMaxEur float64 `json:"investmentRequiredMaxEur"`

	OpexMinEurYear float64 `json:"opexMinEurYear"`
	OpexMaxEurYear float64 `json:"opexMaxEurYear"`

	PaybackMinYears float64 `json:"paybackMinYears"`
	PaybackMaxYears float64 `json:"paybackMaxYears"`

	IRRMinPercent float64 `json:"irrMinPercent"`
	IRRMaxPercent float64 `json:"irrMaxPercent"`

	// Emissions
	CO2AvoidedMinKgYear float64 `json:"co2AvoidedMinKgYear"`
	CO2AvoidedMaxKgYear float64 `json:"co2AvoidedMaxKgYear"`
}

// FeasibilityInput captures the assumptions from the intake form.
type FeasibilityInput struct {
	ThermalLoadMinKw      float64
	ThermalLoadMaxKw      float64
	DistanceKm            float64
	SupplyTempRequiredC   float64
	TemperatureSourceC    float64 // Assumption: ~30C for air cooling, ~50C for liquid
	ExistingCooling       bool
	ExistingDHInfra       bool
	AvailabilityProfile   string // "base", "peak"
	InvestmentWillingness string // "low", "medium", "high"
	TimeHorizonYears      int
}

// CalculateScenarios generates results for all 3 ownership models.
func (e *PredictionEngine) CalculateScenarios(input FeasibilityInput) []ScenarioResult {
	scenarios := []string{"DC_OWNS", "UTILITY_OWNS", "THIRD_PARTY"}
	results := make([]ScenarioResult, 0, len(scenarios))

	for _, model := range scenarios {
		results = append(results, e.evaluateScenario(model, input))
	}
	return results
}

func (e *PredictionEngine) evaluateScenario(model string, input FeasibilityInput) ScenarioResult {
	res := ScenarioResult{
		OwnershipModel:   model,
		PipelineLengthKm: input.DistanceKm,
	}

	// 1. Technical Feasibility & Infra Sizing
	// Assume source temp based on cooling type valid for now, or default.
	if input.TemperatureSourceC == 0 {
		input.TemperatureSourceC = 35.0 // Default air cooling return temp
	}

	res.RequiresHeatExchanger = true
	res.RequiresPipeline = input.DistanceKm > 0

	// Heat pump needed if source temp < required temp
	// (Add 5C buffer for HEX losses)
	res.RequiresHeatPump = input.TemperatureSourceC < (input.SupplyTempRequiredC + 5)

	// 2. Heat Delivery Calculation (MWh/year)
	// Base load = 8760 hrs * 0.9 uptime. Peak = 4000 hrs equivalent ?
	// Let's use simplified hours for "base" vs "peak"
	hoursPerYear := 8760.0
	if input.AvailabilityProfile == "peak" {
		hoursPerYear = 4000.0 // Conservative estimate for intermittent
	}

	// Heat loss estimate: 2% per km?
	lossFactor := 0.02 * input.DistanceKm
	if lossFactor > 0.5 {
		lossFactor = 0.5 // Cap losses
	}
	efficiency := 1.0 - lossFactor

	res.HeatDeliveredMinMwhYear = (input.ThermalLoadMinKw * hoursPerYear / 1000.0) * efficiency
	res.HeatDeliveredMaxMwhYear = (input.ThermalLoadMaxKw * hoursPerYear / 1000.0) * efficiency

	// 3. CAPEX Estimation
	// Very rough bounded logic for MVP

	// HEX Cost: ~50-100 EUR/kW
	hexCostMin := input.ThermalLoadMinKw * 50
	hexCostMax := input.ThermalLoadMaxKw * 100

	// Heat Pump Cost: ~300-600 EUR/kW (electrical input capacity? or thermal output?)
	// Let's assume EUR/kW thermal output
	hpCostMin := 0.0
	hpCostMax := 0.0
	if res.RequiresHeatPump {
		hpCostMin = input.ThermalLoadMinKw * 300
		hpCostMax = input.ThermalLoadMaxKw * 600
	}

	// Pipeline Cost: ~500-1500 EUR/m depending on diameter/digging
	// Typically 1000 EUR/m = 1M EUR/km
	pipelineCostMin := input.DistanceKm * 800000
	pipelineCostMax := input.DistanceKm * 1500000

	if input.ExistingDHInfra {
		// Cheaper connection if infra exists
		pipelineCostMin *= 0.2
		pipelineCostMax *= 0.5
	}

	totalCapexMin := hexCostMin + hpCostMin + pipelineCostMin
	totalCapexMax := hexCostMax + hpCostMax + pipelineCostMax

	// 4. Allocation based on Ownership Model
	// Who pays for what?
	var myCapexMin, myCapexMax float64

	// Assumptions
	elecPrice := 0.15 // EUR/kWh
	cop := 3.5        // Heat Pump COP

	switch model {
	case "DC_OWNS":
		// DC pays everything
		myCapexMin = totalCapexMin
		myCapexMax = totalCapexMax

	case "UTILITY_OWNS":
		// DC pays ~10% (connection), returns are small/zero (free cooling)
		myCapexMin = totalCapexMin * 0.1
		myCapexMax = totalCapexMax * 0.1

	case "THIRD_PARTY":
		// ESCO model: DC pays 0 CAPEX
		myCapexMin = 0
		myCapexMax = 0
	}

	// Add ownership-specific investment (who pays?)
	res.InvestmentRequiredMinEur = myCapexMin
	res.InvestmentRequiredMaxEur = myCapexMax

	// If calculating for the whole project ecosystem (feasibility):
	// Regulators often want "Economic Feasibility" (Project IRR) vs "Financial Feasibility" (Investor IRR).
	// Let's stick to Project Feasibility for now (total CAPEX vs total Value) to keep it simple and consistent,
	// BUT the `ScenarioResult` fields imply specific attribution.
	// Re-reading spec: "For each scenario... DC owns CAPEX... Utility owns CAPEX... You compute: CAPEX range, OPEX range..."
	// This implies "What does the implementation look like under this model?"

	// Let's use Total Project CAPEX/OPEX but filter specific fields if needed.
	// Actually, usually "DC Owns" means "DC builds and operates".
	res.CapexMinEur = totalCapexMin
	res.CapexMaxEur = totalCapexMax

	// OPEX: Maintenance (2% of CAPEX) + Electricity (if HP)
	maintMin := totalCapexMin * 0.02
	maintMax := totalCapexMax * 0.03

	elecCostYearMin := 0.0
	elecCostYearMax := 0.0
	if res.RequiresHeatPump {
		// Heat produced = Electrical Energy * COP
		// Electrical Energy = Heat Delivered / COP
		// Actually COP applies to heat output.
		// MWh Elec = MWh Heat / COP
		elecMwhMin := res.HeatDeliveredMinMwhYear / cop
		elecMwhMax := res.HeatDeliveredMaxMwhYear / cop
		elecCostYearMin = elecMwhMin * 1000 * elecPrice
		elecCostYearMax = elecMwhMax * 1000 * elecPrice
	}

	res.OpexMinEurYear = maintMin + elecCostYearMin
	res.OpexMaxEurYear = maintMax + elecCostYearMax

	// Revenue / Savings (Whole Project View)
	// Value = Heat Sales (replacing gas)
	// Gas replacement value ~ 0.08 EUR/kWh depending on efficiency
	gasPrice := 0.08
	valueMin := res.HeatDeliveredMinMwhYear * 1000 * gasPrice
	valueMax := res.HeatDeliveredMaxMwhYear * 1000 * gasPrice

	// Net Cash Flow
	cashFlowMin := valueMin - res.OpexMaxEurYear // Conservative
	cashFlowMax := valueMax - res.OpexMinEurYear // Optimistic

	// 5. Financial Metrics
	// We calculate pessimistic (High CAPEX, Low CashFlow) and optimistic (Low CAPEX, High CashFlow)
	pessimisticMetrics := e.CalculateFinancial(res.CapexMaxEur, cashFlowMin, input.TimeHorizonYears, 0.06)
	optimisticMetrics := e.CalculateFinancial(res.CapexMinEur, cashFlowMax, input.TimeHorizonYears, 0.06)

	res.PaybackMaxYears = pessimisticMetrics.SimplePaybackYears
	res.PaybackMinYears = optimisticMetrics.SimplePaybackYears

	res.IRRMinPercent = pessimisticMetrics.InternalRateOfReturn
	res.IRRMaxPercent = optimisticMetrics.InternalRateOfReturn

	// 6. Emissions (Scope 1 Avoided)
	// Gas boiler emission factor: ~0.2 kg CO2 / kWh
	// Heat Pump grid emission factor: ~0.4 kg CO2 / kWh (depending on grid)
	// Savings = (Heat * 0.2) - (Elec * 0.4)

	gasCo2Factor := 0.202  // kg/kWh (Natural gas)
	gridCo2Factor := 0.350 // kg/kWh (EU Avg approx)

	co2BaseMin := res.HeatDeliveredMinMwhYear * 1000 * gasCo2Factor
	co2BaseMax := res.HeatDeliveredMaxMwhYear * 1000 * gasCo2Factor

	co2PenaltyMin := 0.0
	co2PenaltyMax := 0.0
	if res.RequiresHeatPump {
		elecMwhMin := res.HeatDeliveredMinMwhYear / cop
		elecMwhMax := res.HeatDeliveredMaxMwhYear / cop
		co2PenaltyMin = elecMwhMin * 1000 * gridCo2Factor
		co2PenaltyMax = elecMwhMax * 1000 * gridCo2Factor
	}

	res.CO2AvoidedMinKgYear = co2BaseMin - co2PenaltyMax // Conservative
	res.CO2AvoidedMaxKgYear = co2BaseMax - co2PenaltyMin // Best case

	return res
}
