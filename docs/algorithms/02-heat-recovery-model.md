# Heat Recovery Potential Model

## Overview

This document describes the mathematical models for calculating recoverable waste heat from data centers, including efficiency factors, transmission losses, and distance-based degradation.

---

## 1. Heat Recovery Calculations

### 1.1 Base Waste Heat Availability

**Formula:**

```
waste_heat_available_kw = effective_it_load_kw × 0.95
```

**Parameters:**

- `effective_it_load_kw`: Actual IT equipment power draw
- `0.95`: Heat conversion efficiency (95%)

**Invariants:**

- `waste_heat_available_kw ≤ effective_it_load_kw`
- Always positive when IT load > 0

**Physical Basis:**

- Nearly all electrical energy in IT equipment converts to heat
- CPUs, GPUs, storage, networking all dissipate heat
- Follows conservation of energy principle

**Source:** `prediction_engine.py:88`

---

### 1.2 Distance-Based Efficiency Factor

**Formula:**

```
distance_efficiency = max(0.5, 1 - (distance_km × 0.05))
```

**Parameters:**

- `distance_km`: Distance from data center to heat sink in kilometers
- `0.05`: Degradation rate (5% per kilometer)
- `0.5`: Minimum efficiency floor (50%)

**Behavior:**

```
distance_km = 0   → distance_efficiency = 1.00  (100%, no loss)
distance_km = 1   → distance_efficiency = 0.95  (95%)
distance_km = 5   → distance_efficiency = 0.75  (75%)
distance_km = 10  → distance_efficiency = 0.50  (50%, floor)
distance_km = 20  → distance_efficiency = 0.50  (50%, floor)
distance_km = 50  → distance_efficiency = 0.50  (50%, floor)
```

**Invariants:**

- `0.5 ≤ distance_efficiency ≤ 1.0`
- Efficiency never drops below 50% regardless of distance
- Linear degradation up to 10km, then constant

**Physical Basis:**

- Heat loss through pipe insulation increases with distance
- Longer pipes = more surface area for heat dissipation
- Flow resistance and pumping losses increase with distance
- 50% floor represents practical minimum for economic viability

**Business Logic:**

- Beyond ~10km, other factors dominate (not just distance)
- Floor ensures very distant connections aren't completely ruled out
- Conservative estimate for feasibility studies

**Source:** `prediction_engine.py:90`

---

### 1.3 Recoverable Heat Calculation

**Formula:**

```
recoverable_heat_kw = waste_heat_kw × heat_recovery_efficiency × 
                      transmission_efficiency × distance_efficiency
```

**Expanded:**

```
recoverable_heat_kw = (effective_it_load_kw × 0.95) × 0.65 × 0.85 × distance_efficiency
```

**Parameters:**

- `waste_heat_kw`: Available waste heat from IT equipment
- `heat_recovery_efficiency`: Heat exchanger efficiency
- `transmission_efficiency`: Pipe transmission efficiency
- `distance_efficiency`: Distance-based degradation

**Constants:**

- **Heat Recovery Efficiency:** `0.65` (65%)
  - Represents heat exchanger effectiveness
  - Practical achievable efficiency for liquid cooling systems
  - Industry standard for data center heat recovery
  
- **Transmission Efficiency:** `0.85` (85%)
  - Heat retained during transmission through pipes
  - Accounts for insulation quality and ambient conditions
  - 15% loss is conservative estimate for insulated district heating pipes

**Invariants:**

- `0 < recoverable_heat_kw ≤ waste_heat_kw`
- `recoverable_heat_kw ≤ effective_it_load_kw × 0.95 × 0.65 × 0.85`
- Maximum theoretical recovery: ~52.4% of IT load (0.95 × 0.65 × 0.85 = 0.524)

**Cascading Efficiency Losses:**

```
100% IT Power
  → 95% becomes waste heat (5% loss to other forms)
    → 65% captured by heat exchanger (35% loss to air cooling)
      → 85% survives transmission (15% loss in pipes)
        → × distance_efficiency (additional distance losses)
          = Recoverable heat at sink
```

**Example Calculation:**

```
IT Load: 1000 kW at 70% utilization = 700 kW effective
Waste heat: 700 × 0.95 = 665 kW
At heat exchanger: 665 × 0.65 = 432.25 kW
After transmission: 432.25 × 0.85 = 367.4 kW
At 5km distance: 367.4 × 0.75 = 275.6 kW recoverable
```

**Source:** `prediction_engine.py:92-95`

---

### 1.4 Annual Heat Recovery

**Formula:**

```
annual_heat_recovery_kwh = recoverable_heat_kw × operating_hours_year
```

**Parameters:**

- `recoverable_heat_kw`: Instantaneous recoverable heat power
- `operating_hours_year`: Annual operating hours

**Invariants:**

- `1 ≤ operating_hours_year ≤ 8760`
- Annual recovery proportional to uptime

**Business Logic:**

- Converts power (kW) to energy (kWh) over time
- Used for cost savings and carbon offset calculations
- Higher uptime = more heat recovery opportunity

**Source:** `prediction_engine.py:97`

---

## 2. Economic Value Calculations

### 2.1 Equivalent Gas Displacement

**Formula:**

```
equivalent_gas_therms = annual_heat_recovery_kwh × 0.0341
```

**Constants:**

- **Conversion Factor:** `0.0341` therms/kWh
  - 1 therm = 100,000 BTU
  - 1 kWh = 3,412 BTU
  - 1 kWh = 3,412 / 100,000 = 0.03412 therms ≈ 0.0341 therms

**Invariants:**

- `equivalent_gas_therms ≥ 0`
- Linear relationship with heat recovery

**Physical Basis:**

- District heating typically uses natural gas boilers
- Heat recovery displaces gas consumption
- 1:1 energy equivalence (energy conservation)

**Source:** `prediction_engine.py:99`

---

### 2.2 Cost Savings from Gas Displacement

**Formula:**

```
gas_cost_savings = equivalent_gas_therms × gas_price_per_therm
```

**Parameters:**

- `gas_price_per_therm`: Current natural gas price ($/therm)

**Constants (Default):**

- **Gas Price:** `$1.20/therm`
  - Average industrial natural gas price in California
  - Subject to market fluctuations
  - Should be parameterized for different regions

**Invariants:**

- `gas_cost_savings ≥ 0`
- `gas_price_per_therm > 0`

**Business Logic:**

- Direct operational cost savings for heat sink operator
- Revenue opportunity for data center (if selling heat)
- Key driver for economic feasibility

**Source:** `prediction_engine.py:100`

---

### 2.3 Carbon Offset from Gas Avoidance

**Formula:**

```
co2_avoided_kg = equivalent_gas_therms × 5.3
```

**Constants:**

- **CO₂ Emission Factor:** `5.3 kg CO₂/therm`
  - Natural gas combustion produces ~5.3 kg CO₂ per therm
  - Based on EPA emission factors
  - Includes complete combustion of methane (CH₄)

**Chemical Basis:**

```
CH₄ + 2O₂ → CO₂ + 2H₂O
1 therm natural gas ≈ 0.0053 metric tons CO₂
```

**Invariants:**

- `co2_avoided_kg ≥ 0`
- Linear relationship with gas displacement

**Business Logic:**

- Quantifies environmental benefit
- Used for carbon credit valuation
- Supports sustainability reporting

**Source:** `prediction_engine.py:102`

---

## 3. Return Structure

The heat recovery calculation returns a comprehensive metrics dictionary:

```python
{
    'waste_heat_available_kw': float,        # Total waste heat from IT
    'recoverable_heat_kw': float,            # Actually recoverable after losses
    'annual_heat_recovery_kwh': float,       # Yearly energy recovery
    'equivalent_gas_therms': float,          # Natural gas displacement
    'annual_gas_cost_savings': float,        # Economic benefit
    'co2_avoided_kg_per_year': float,        # Environmental benefit
    'distance_efficiency_factor': float      # Distance penalty applied
}
```

**Source:** `prediction_engine.py:104-112`

---

## 4. Implementation Requirements for Go

### 4.1 Data Types

```go
type HeatRecoveryMetrics struct {
    WasteHeatAvailableKW      float64 `json:"waste_heat_available_kw"`
    RecoverableHeatKW         float64 `json:"recoverable_heat_kw"`
    AnnualHeatRecoveryKWh     float64 `json:"annual_heat_recovery_kwh"`
    EquivalentGasTherms       float64 `json:"equivalent_gas_therms"`
    AnnualGasCostSavings      float64 `json:"annual_gas_cost_savings"`
    CO2AvoidedKgPerYear       float64 `json:"co2_avoided_kg_per_year"`
    DistanceEfficiencyFactor  float64 `json:"distance_efficiency_factor"`
}

type HeatRecoveryInput struct {
    ITLoadKW            float64 `validate:"required,gt=0"`
    UtilizationPercent  float64 `validate:"required,gte=0,lte=100"`
    OperatingHoursYear  int     `validate:"required,gte=1,lte=8760"`
    DistanceToSinkKM    float64 `validate:"gte=0"`
}
```

### 4.2 Constants

```go
const (
    // Heat Generation
    HeatConversionEfficiency = 0.95  // 95% of IT power becomes waste heat
    
    // Recovery System Efficiencies
    HeatRecoveryEfficiency   = 0.65  // Heat exchanger efficiency
    TransmissionEfficiency   = 0.85  // Pipe transmission efficiency
    
    // Distance-Based Degradation
    DistanceDegradationRate  = 0.05  // 5% loss per kilometer
    MinDistanceEfficiency    = 0.50  // 50% minimum efficiency floor
    
    // Economic Conversions
    KWhToThermsFactor       = 0.0341  // kWh to therms conversion
    DefaultGasPricePerTherm = 1.20    // USD per therm (default)
    
    // Carbon Emissions
    CO2PerThermKg           = 5.3     // kg CO₂ per therm natural gas
)
```

### 4.3 Core Functions

```go
// CalculateDistanceEfficiency computes heat retention based on transmission distance
func CalculateDistanceEfficiency(distanceKM float64) float64 {
    if distanceKM < 0 {
        distanceKM = 0
    }
    
    efficiency := 1.0 - (distanceKM * DistanceDegradationRate)
    
    // Apply floor
    if efficiency < MinDistanceEfficiency {
        efficiency = MinDistanceEfficiency
    }
    
    return efficiency
}

// CalculateHeatRecoveryPotential computes comprehensive heat recovery metrics
func CalculateHeatRecoveryPotential(input HeatRecoveryInput) (HeatRecoveryMetrics, error) {
    if err := input.Validate(); err != nil {
        return HeatRecoveryMetrics{}, err
    }
    
    // Calculate effective IT load
    effectiveITLoad := input.ITLoadKW * (input.UtilizationPercent / 100.0)
    
    // Calculate waste heat
    wasteHeat := effectiveITLoad * HeatConversionEfficiency
    
    // Calculate distance efficiency
    distanceEff := CalculateDistanceEfficiency(input.DistanceToSinkKM)
    
    // Calculate recoverable heat with cascading losses
    recoverableHeat := wasteHeat * 
                       HeatRecoveryEfficiency * 
                       TransmissionEfficiency * 
                       distanceEff
    
    // Calculate annual recovery
    annualRecovery := recoverableHeat * float64(input.OperatingHoursYear)
    
    // Calculate gas displacement
    gasEquivalent := annualRecovery * KWhToThermsFactor
    
    // Calculate cost savings (using default gas price)
    costSavings := gasEquivalent * DefaultGasPricePerTherm
    
    // Calculate CO₂ avoidance
    co2Avoided := gasEquivalent * CO2PerThermKg
    
    return HeatRecoveryMetrics{
        WasteHeatAvailableKW:     wasteHeat,
        RecoverableHeatKW:        recoverableHeat,
        AnnualHeatRecoveryKWh:    annualRecovery,
        EquivalentGasTherms:      gasEquivalent,
        AnnualGasCostSavings:     costSavings,
        CO2AvoidedKgPerYear:      co2Avoided,
        DistanceEfficiencyFactor: distanceEff,
    }, nil
}
```

---

## 5. Test Cases

### 5.1 Distance Efficiency Tests

```go
func TestDistanceEfficiency(t *testing.T) {
    tests := []struct {
        distance float64
        expected float64
    }{
        {0.0, 1.00},    // No distance, no loss
        {1.0, 0.95},    // 1km, 5% loss
        {5.0, 0.75},    // 5km, 25% loss
        {10.0, 0.50},   // 10km, 50% loss (at floor)
        {20.0, 0.50},   // 20km, still at floor
        {100.0, 0.50},  // 100km, still at floor
    }
    
    for _, tt := range tests {
        t.Run(fmt.Sprintf("%.1fkm", tt.distance), func(t *testing.T) {
            result := CalculateDistanceEfficiency(tt.distance)
            assert.InDelta(t, tt.expected, result, 0.001)
        })
    }
}
```

### 5.2 Heat Recovery Integration Test

```go
func TestHeatRecoveryPotential(t *testing.T) {
    input := HeatRecoveryInput{
        ITLoadKW:           1000.0,
        UtilizationPercent: 70.0,
        OperatingHoursYear: 8760,
        DistanceToSinkKM:   5.0,
    }
    
    result, err := CalculateHeatRecoveryPotential(input)
    
    assert.NoError(t, err)
    
    // Verify cascading calculations
    effectiveIT := 700.0           // 1000 × 0.7
    wasteHeat := 665.0             // 700 × 0.95
    distanceEff := 0.75            // 1 - (5 × 0.05)
    recoverable := 665.0 * 0.65 * 0.85 * 0.75  // 275.578125
    
    assert.InDelta(t, wasteHeat, result.WasteHeatAvailableKW, 0.01)
    assert.InDelta(t, recoverable, result.RecoverableHeatKW, 0.01)
    assert.InDelta(t, 0.75, result.DistanceEfficiencyFactor, 0.001)
}
```

### 5.3 Economic Value Tests

```go
func TestEconomicCalculations(t *testing.T) {
    // 100,000 kWh recovered annually
    input := HeatRecoveryInput{
        ITLoadKW:           100.0,
        UtilizationPercent: 80.0,
        OperatingHoursYear: 8760,
        DistanceToSinkKM:   2.0,
    }
    
    result, err := CalculateHeatRecoveryPotential(input)
    assert.NoError(t, err)
    
    // Verify economic conversions
    therms := result.AnnualHeatRecoveryKWh * KWhToThermsFactor
    expectedSavings := therms * DefaultGasPricePerTherm
    expectedCO2 := therms * CO2PerThermKg
    
    assert.InDelta(t, therms, result.EquivalentGasTherms, 0.01)
    assert.InDelta(t, expectedSavings, result.AnnualGasCostSavings, 0.01)
    assert.InDelta(t, expectedCO2, result.CO2AvoidedKgPerYear, 0.01)
}
```

---

## 6. References

- **Python Implementation:** `backend/prediction_engine.py:81-112`
- **Industry Standards:**
  - ASHRAE District Heating Design Guide
  - DOE Federal Energy Management Program (FEMP)
  - European Heat Pump Association efficiency standards
- **Emission Factors:** EPA Greenhouse Gas Equivalencies Calculator
- **Economic Data:** EIA Natural Gas Prices

---

## 7. Notes for Implementation

1. **Parameterization:** Gas price should be configurable per region/country
2. **Currency:** All cost calculations in USD by default, should support multi-currency
3. **Emission Factors:** CO₂ factors vary by fuel type and region, should be configurable
4. **Distance Modeling:** Linear degradation is simplified; real-world may require more sophisticated heat loss models
5. **Seasonal Variation:** Current model assumes constant conditions; actual implementation may need seasonal adjustments
6. **Heat Quality:** Temperature requirements not factored into current model; future enhancement opportunity
