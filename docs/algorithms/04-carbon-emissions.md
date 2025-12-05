# Carbon Emissions Calculation Model

## Overview

This document describes the carbon dioxide (CO₂) emissions calculations for data centers, including grid-based emissions, renewable energy offsets, and carbon offset requirements.

---

## 1. Carbon Emissions from Grid Energy

### 1.1 Base Emission Formula

**Formula:**

```
grid_energy_kwh = annual_energy_kwh × (1 - renewable_percent / 100)
annual_co2_kg = grid_energy_kwh × emission_factor
annual_co2_tons = annual_co2_kg / 1000
```

**Parameters:**

- `annual_energy_kwh`: Total annual energy consumption
- `renewable_percent`: Percentage of energy from renewable sources (0-100)
- `emission_factor`: kg CO₂ per kWh of grid electricity

**Invariants:**

- `0 ≤ renewable_percent ≤ 100`
- `emission_factor > 0`
- `grid_energy_kwh ≤ annual_energy_kwh`

**Source:** `prediction_engine.py:61-79`

---

### 1.2 San Francisco Grid Emission Factor

**Default Value:**

```
sf_emission_factor = 0.2 kg CO₂/kWh
```

**Context:**

- California has one of the cleanest grids in the United States
- High penetration of renewable energy (hydro, wind, solar)
- Low compared to national average (~0.42 kg CO₂/kWh)

**Regional Variation:**

```
Coal-heavy grid:      0.9-1.0 kg CO₂/kWh
National US average:  0.42 kg CO₂/kWh
California:           0.2 kg CO₂/kWh
Renewable-heavy:      0.05-0.1 kg CO₂/kWh
100% renewable:       0.0 kg CO₂/kWh
```

**Source:** `prediction_engine.py:34`

---

### 1.3 Renewable Energy Offset

**Formula:**

```
renewable_energy_kwh = annual_energy_kwh × (renewable_percent / 100)
renewable_energy_kwh = annual_energy_kwh - grid_energy_kwh
```

**Business Logic:**

- On-site solar, wind, or other renewable generation
- Purchased Renewable Energy Certificates (RECs)
- Power Purchase Agreements (PPAs) for renewable energy
- Green power programs from utilities

**Accounting:**

- Only grid energy contributes to CO₂ emissions
- Renewable energy has zero marginal emissions
- Does not account for embodied carbon in renewable infrastructure

**Source:** `prediction_engine.py:69-77`

---

## 2. Carbon Offset Requirements

### 2.1 Total Offset Needed

**Formula:**

```
carbon_offset_required_tons = annual_co2_tons
```

**Business Logic:**

- To achieve carbon neutrality, must offset all grid emissions
- Purchased through carbon credit markets
- Types of offsets:
  - Renewable energy projects
  - Reforestation/afforestation
  - Carbon capture and sequestration
  - Avoided deforestation

**Source:** `prediction_engine.py:78`

---

## 3. Return Structure

```python
{
    'annual_co2_emissions_kg': float,         # Total kg CO₂ per year
    'annual_co2_emissions_tons': float,       # Total metric tons CO₂ per year
    'grid_energy_kwh': float,                 # Energy from grid
    'renewable_energy_kwh': float,            # Energy from renewables
    'carbon_offset_required_tons': float      # Tons of offsets needed for neutrality
}
```

**Source:** `prediction_engine.py:73-79`

---

## 4. Carbon Avoidance (Heat Recovery)

### 4.1 CO₂ Avoided Through Heat Recovery

**Formula:**

```
co2_avoided_kg = equivalent_gas_therms × 5.3
```

**Constants:**

- **Natural Gas CO₂ Factor:** `5.3 kg CO₂/therm`

**Chemical Basis:**

```
CH₄ + 2O₂ → CO₂ + 2H₂O + heat

Complete combustion of natural gas:
1 therm = 100,000 BTU
1 therm ≈ 5.3 kg CO₂ emissions
```

**Business Logic:**

- Heat recovery displaces natural gas in district heating
- Each therm of gas NOT burned = 5.3 kg CO₂ avoided
- Additive to renewable energy benefits
- Can be monetized through carbon markets

**Source:** `prediction_engine.py:102` (in heat recovery module)

---

### 4.2 Total Carbon Impact

**Combined Formula:**

```
net_carbon_impact = baseline_emissions - (renewable_offset + heat_recovery_avoidance)

where:
  baseline_emissions = annual_energy_kwh × grid_emission_factor
  renewable_offset = renewable_energy_kwh × grid_emission_factor
  heat_recovery_avoidance = equivalent_gas_therms × 5.3
```

**Business Logic:**

- Renewable energy reduces grid consumption (direct reduction)
- Heat recovery avoids gas combustion (indirect reduction)
- Both contribute to carbon neutrality goals

---

## 5. Implementation Requirements for Go

### 5.1 Data Types

```go
type CarbonMetrics struct {
    AnnualCO2EmissionsKg       float64 `json:"annual_co2_emissions_kg"`
    AnnualCO2EmissionsTons     float64 `json:"annual_co2_emissions_tons"`
    GridEnergyKWh              float64 `json:"grid_energy_kwh"`
    RenewableEnergyKWh         float64 `json:"renewable_energy_kwh"`
    CarbonOffsetRequiredTons   float64 `json:"carbon_offset_required_tons"`
}

type CarbonInput struct {
    AnnualEnergyKWh    float64 `validate:"required,gte=0"`
    RenewablePercent   float64 `validate:"gte=0,lte=100"`
    EmissionFactor     float64 `validate:"gt=0"`  // Optional, defaults to region
}
```

### 5.2 Constants

```go
const (
    // Grid Emission Factors (kg CO₂/kWh)
    SFEmissionFactor         = 0.2    // San Francisco/California
    USNationalEmissionFactor = 0.42   // US National Average
    CoalHeavyEmissionFactor  = 0.95   // Coal-dominated grid
    CleanGridEmissionFactor  = 0.05   // Very clean grid
    
    // Fuel Emission Factors
    NaturalGasCO2PerTherm   = 5.3    // kg CO₂ per therm
    
    // Conversion Factors
    KgToTons                = 0.001   // kg to metric tons
)

// Regional emission factors map
var EmissionFactorsByRegion = map[string]float64{
    "california":    0.2,
    "pacific_nw":    0.15,
    "northeast":     0.3,
    "midwest":       0.65,
    "southeast":     0.55,
    "texas":         0.50,
    "us_average":    0.42,
}
```

### 5.3 Core Functions

```go
// CalculateCarbonEmissions computes CO₂ emissions from energy consumption
func CalculateCarbonEmissions(input CarbonInput) (CarbonMetrics, error) {
    if err := input.Validate(); err != nil {
        return CarbonMetrics{}, err
    }
    
    // Calculate grid vs renewable energy split
    renewableFraction := input.RenewablePercent / 100.0
    renewableEnergy := input.AnnualEnergyKWh * renewableFraction
    gridEnergy := input.AnnualEnergyKWh * (1 - renewableFraction)
    
    // Calculate emissions (only from grid energy)
    annualCO2Kg := gridEnergy * input.EmissionFactor
    annualCO2Tons := annualCO2Kg * KgToTons
    
    return CarbonMetrics{
        AnnualCO2EmissionsKg:     annualCO2Kg,
        AnnualCO2EmissionsTons:   annualCO2Tons,
        GridEnergyKWh:            gridEnergy,
        RenewableEnergyKWh:       renewableEnergy,
        CarbonOffsetRequiredTons: annualCO2Tons,
    }, nil
}

// GetEmissionFactorForRegion retrieves appropriate emission factor
func GetEmissionFactorForRegion(region string) float64 {
    if factor, ok := EmissionFactorsByRegion[strings.ToLower(region)]; ok {
        return factor
    }
    return USNationalEmissionFactor // Default fallback
}

// CalculateCarbonAvoidance computes CO₂ avoided through heat recovery
func CalculateCarbonAvoidance(gasDisplacedTherms float64) float64 {
    return gasDisplacedTherms * NaturalGasCO2PerTherm
}

// CalculateNetCarbonImpact combines all carbon effects
func CalculateNetCarbonImpact(
    baselineEmissions float64,
    renewableEnergyKWh float64,
    emissionFactor float64,
    heatRecoveryTherms float64,
) float64 {
    // Carbon reduced by using renewables instead of grid
    renewableReduction := renewableEnergyKWh * emissionFactor
    
    // Carbon avoided by displacing natural gas
    heatRecoveryAvoidance := heatRecoveryTherms * NaturalGasCO2PerTherm
    
    // Net impact
    netEmissions := baselineEmissions - renewableReduction - heatRecoveryAvoidance
    
    return math.Max(0, netEmissions) // Can't go negative in accounting
}
```

---

## 6. Carbon Credit Integration

### 6.1 Carbon Credit Cost Calculation

**Formula:**

```
carbon_credit_cost = carbon_offset_required_tons × price_per_ton
```

**Parameters:**

- `carbon_offset_required_tons`: Total CO₂ to offset
- `price_per_ton`: Market price of carbon credits

**Market Prices (Historical Range):**

```
Voluntary Market:   $3-$30/ton (varies by project type)
Compliance Markets: $15-$80/ton (EU ETS, California)
High-quality:       $50-$150/ton (verified, permanent)
```

**Source:** Related to `prediction_models.py` CarbonCredit entity

---

### 6.2 Revenue from Carbon Avoidance

**Formula:**

```
carbon_revenue = co2_avoided_kg × (price_per_ton / 1000)
```

**Business Logic:**

- Heat recovery projects may generate carbon credits
- Revenue stream for data center operator
- Adds to economic feasibility
- Requires verification and certification

---

## 7. Test Cases

### 7.1 Basic Emission Calculation

```go
func TestCarbonEmissions_NoRenewables(t *testing.T) {
    input := CarbonInput{
        AnnualEnergyKWh:  1000000,  // 1 GWh
        RenewablePercent: 0,
        EmissionFactor:   0.42,     // US average
    }
    
    result, err := CalculateCarbonEmissions(input)
    
    assert.NoError(t, err)
    assert.Equal(t, 1000000.0, result.GridEnergyKWh)
    assert.Equal(t, 0.0, result.RenewableEnergyKWh)
    assert.Equal(t, 420000.0, result.AnnualCO2EmissionsKg)  // 1M × 0.42
    assert.Equal(t, 420.0, result.AnnualCO2EmissionsTons)   // 420k / 1000
}
```

### 7.2 Renewable Energy Offset

```go
func TestCarbonEmissions_WithRenewables(t *testing.T) {
    input := CarbonInput{
        AnnualEnergyKWh:  1000000,
        RenewablePercent: 50,       // 50% renewable
        EmissionFactor:   0.42,
    }
    
    result, err := CalculateCarbonEmissions(input)
    
    assert.NoError(t, err)
    assert.Equal(t, 500000.0, result.GridEnergyKWh)        // 50% from grid
    assert.Equal(t, 500000.0, result.RenewableEnergyKWh)   // 50% renewable
    assert.Equal(t, 210000.0, result.AnnualCO2EmissionsKg) // 500k × 0.42
    assert.Equal(t, 210.0, result.AnnualCO2EmissionsTons)
}
```

### 7.3 Heat Recovery Avoidance

```go
func TestCarbonAvoidance(t *testing.T) {
    gasDisplaced := 10000.0 // therms
    
    co2Avoided := CalculateCarbonAvoidance(gasDisplaced)
    
    assert.Equal(t, 53000.0, co2Avoided) // 10000 × 5.3
}
```

### 7.4 Regional Emission Factors

```go
func TestRegionalEmissionFactors(t *testing.T) {
    tests := []struct {
        region   string
        expected float64
    }{
        {"california", 0.2},
        {"texas", 0.5},
        {"midwest", 0.65},
        {"unknown_region", 0.42}, // Falls back to US average
    }
    
    for _, tt := range tests {
        t.Run(tt.region, func(t *testing.T) {
            factor := GetEmissionFactorForRegion(tt.region)
            assert.Equal(t, tt.expected, factor)
        })
    }
}
```

---

## 8. References

- **Python Implementation:** `backend/prediction_engine.py:61-79`
- **Emission Factors:**
  - EPA eGRID Database
  - International Energy Agency (IEA) Emission Factors
  - California Air Resources Board (CARB)
- **Carbon Markets:**
  - Verified Carbon Standard (VCS)
  - Gold Standard
  - California Cap-and-Trade Program
- **Science:**
  - IPCC Guidelines for National Greenhouse Gas Inventories
  - EPA Greenhouse Gas Equivalencies Calculator

---

## 9. Notes for Implementation

1. **Regional Accuracy:** Use location-specific emission factors when available
2. **Time Variation:** Grid emission factors change over time (becoming cleaner)
3. **Renewable Accounting:** Be careful with double-counting renewable credits
4. **Verification:** Carbon avoidance claims should be independently verified
5. **Scope:** Current model covers Scope 2 emissions (purchased electricity); Scope 1 and 3 not included
6. **Accuracy:** Emission factors should be updated annually
7. **Reporting:** Support multiple carbon accounting standards (GHG Protocol, ISO 14064, etc.)
