# Energy Consumption Model

## Overview

This document describes the mathematical models and algorithms used to calculate data center energy consumption, including IT load, Power Usage Effectiveness (PUE), and waste heat generation.

---

## 1. Energy Consumption Calculation

### 1.1 Effective IT Load

**Formula:**

```
effective_it_load_kw = it_load_kw × (utilization_percent / 100)
```

**Parameters:**

- `it_load_kw`: Total IT equipment power capacity in kilowatts
- `utilization_percent`: Average utilization percentage (0-100)

**Invariants:**

- `0 ≤ utilization_percent ≤ 100`
- `it_load_kw > 0`
- `effective_it_load_kw ≤ it_load_kw`

**Business Logic:**

- Represents actual power draw based on workload utilization
- Lower utilization = lower energy consumption
- Used as basis for all downstream calculations

**Source:** `prediction_engine.py:42-47`

---

### 1.2 Total Power Consumption

**Formula:**

```
total_power_kw = effective_it_load_kw × PUE
```

**Parameters:**

- `effective_it_load_kw`: Actual IT equipment power draw
- `PUE`: Power Usage Effectiveness ratio

**Invariants:**

- `PUE ≥ 1.0` (theoretical minimum, perfectly efficient)
- `1.0 ≤ PUE ≤ 3.0` (practical range in implementation)
- Typical values:
  - Excellent: 1.1-1.2
  - Good: 1.2-1.5
  - Average: 1.5-2.0
  - Poor: 2.0-3.0

**Business Logic:**

- PUE accounts for all non-IT power consumption (cooling, lighting, UPS losses, etc.)
- PUE = Total Facility Power / IT Equipment Power
- Lower PUE indicates more efficient data center

**Source:** `prediction_engine.py:48`

---

### 1.3 Annual Energy Consumption

**Formula:**

```
annual_energy_kwh = total_power_kw × operating_hours_year
```

**Parameters:**

- `total_power_kw`: Total facility power consumption
- `operating_hours_year`: Annual operating hours

**Invariants:**

- `1 ≤ operating_hours_year ≤ 8760` (8760 hours = 365 days × 24 hours)
- Typical values:
  - 24/7 operation: 8760 hours
  - Business hours only: ~2080 hours (40 hrs/week × 52 weeks)

**Business Logic:**

- Converts instantaneous power (kW) to energy consumed over time (kWh)
- Used for cost calculations and carbon emissions
- Annual scope enables yearly financial modeling

**Source:** `prediction_engine.py:49`

---

### 1.4 Cooling Load Calculation

**Formula:**

```
cooling_load_kw = total_power_kw - effective_it_load_kw
```

**Derivation:**

```
total_power_kw = effective_it_load_kw × PUE
cooling_load_kw = effective_it_load_kw × PUE - effective_it_load_kw
cooling_load_kw = effective_it_load_kw × (PUE - 1)
```

**Invariants:**

- `cooling_load_kw ≥ 0`
- `cooling_load_kw = 0` when `PUE = 1.0` (theoretical)

**Business Logic:**

- Represents power consumed by cooling systems, UPS losses, lighting, etc.
- Higher PUE → higher cooling load
- Critical for heat recovery potential assessment

**Source:** `prediction_engine.py:51`

---

### 1.5 Waste Heat Generation

**Formula:**

```
waste_heat_kw = effective_it_load_kw × 0.95
```

**Constants:**

- **Heat Conversion Efficiency:** `0.95` (95%)

**Invariants:**

- `waste_heat_kw ≤ effective_it_load_kw`
- `0.90 ≤ heat_conversion_factor ≤ 1.0` (typical range)

**Physical Basis:**

- Nearly all electrical energy consumed by IT equipment converts to heat
- ~95% becomes waste heat (thermal energy)
- ~5% lost to other forms (electromagnetic radiation, etc.)
- Based on thermodynamic principles: electrical resistance generates heat

**Business Logic:**

- Waste heat is the source for heat recovery systems
- Higher IT load → more waste heat available
- Foundation for heat recovery potential calculations

**Source:** `prediction_engine.py:58`

---

## 2. Implementation Requirements for Go

### 2.1 Data Types

```go
type EnergyMetrics struct {
    EffectiveITLoadKW           float64 `json:"effective_it_load_kw"`
    TotalPowerConsumptionKW     float64 `json:"total_power_consumption_kw"`
    AnnualEnergyConsumptionKWh  float64 `json:"annual_energy_consumption_kwh"`
    CoolingLoadKW               float64 `json:"cooling_load_kw"`
    WasteHeatGeneratedKW        float64 `json:"waste_heat_generated_kw"`
}

type EnergyCalculationInput struct {
    ITLoadKW            float64 `validate:"required,gt=0"`
    PUE                 float64 `validate:"required,gte=1.0,lte=3.0"`
    UtilizationPercent  float64 `validate:"required,gte=0,lte=100"`
    OperatingHoursYear  int     `validate:"required,gte=1,lte=8760"`
}
```

### 2.2 Constants

```go
const (
    // Physical Constants
    HeatConversionEfficiency = 0.95 // 95% of IT power becomes waste heat
    
    // Validation Bounds
    MinPUE              = 1.0
    MaxPUE              = 3.0
    MinUtilization      = 0.0
    MaxUtilization      = 100.0
    HoursPerYear        = 8760
    
    // Typical PUE Ranges (for reference/validation)
    ExcellentPUE = 1.2
    GoodPUE      = 1.5
    AveragePUE   = 2.0
    PoorPUE      = 2.5
)
```

### 2.3 Validation Rules

```go
func (input *EnergyCalculationInput) Validate() error {
    if input.ITLoadKW <= 0 {
        return errors.New("IT load must be greater than zero")
    }
    if input.PUE < MinPUE || input.PUE > MaxPUE {
        return fmt.Errorf("PUE must be between %.1f and %.1f", MinPUE, MaxPUE)
    }
    if input.UtilizationPercent < 0 || input.UtilizationPercent > 100 {
        return errors.New("utilization percent must be between 0 and 100")
    }
    if input.OperatingHoursYear < 1 || input.OperatingHoursYear > HoursPerYear {
        return fmt.Errorf("operating hours must be between 1 and %d", HoursPerYear)
    }
    return nil
}
```

### 2.4 Function Signature

```go
// CalculateEnergyConsumption computes energy metrics for a data center
// based on IT load, PUE, utilization, and operating hours.
func CalculateEnergyConsumption(input EnergyCalculationInput) (EnergyMetrics, error) {
    if err := input.Validate(); err != nil {
        return EnergyMetrics{}, err
    }
    
    // Implementation following formulas above
    effectiveITLoad := input.ITLoadKW * (input.UtilizationPercent / 100.0)
    totalPower := effectiveITLoad * input.PUE
    annualEnergy := totalPower * float64(input.OperatingHoursYear)
    coolingLoad := totalPower - effectiveITLoad
    wasteHeat := effectiveITLoad * HeatConversionEfficiency
    
    return EnergyMetrics{
        EffectiveITLoadKW:           effectiveITLoad,
        TotalPowerConsumptionKW:     totalPower,
        AnnualEnergyConsumptionKWh:  annualEnergy,
        CoolingLoadKW:               coolingLoad,
        WasteHeatGeneratedKW:        wasteHeat,
    }, nil
}
```

---

## 3. Test Cases

### 3.1 Basic Calculation Test

```go
func TestEnergyConsumption_Basic(t *testing.T) {
    input := EnergyCalculationInput{
        ITLoadKW:           1000.0,
        PUE:                1.5,
        UtilizationPercent: 70.0,
        OperatingHoursYear: 8760,
    }
    
    result, err := CalculateEnergyConsumption(input)
    
    assert.NoError(t, err)
    assert.Equal(t, 700.0, result.EffectiveITLoadKW)       // 1000 × 0.7
    assert.Equal(t, 1050.0, result.TotalPowerConsumptionKW) // 700 × 1.5
    assert.Equal(t, 9198000.0, result.AnnualEnergyConsumptionKWh) // 1050 × 8760
    assert.Equal(t, 350.0, result.CoolingLoadKW)            // 1050 - 700
    assert.Equal(t, 665.0, result.WasteHeatGeneratedKW)     // 700 × 0.95
}
```

### 3.2 Edge Cases

```go
func TestEnergyConsumption_EdgeCases(t *testing.T) {
    tests := []struct {
        name    string
        input   EnergyCalculationInput
        wantErr bool
    }{
        {
            name: "Minimum PUE (perfectly efficient)",
            input: EnergyCalculationInput{
                ITLoadKW: 100, PUE: 1.0, UtilizationPercent: 100, OperatingHoursYear: 8760,
            },
            wantErr: false,
        },
        {
            name: "Maximum PUE (inefficient)",
            input: EnergyCalculationInput{
                ITLoadKW: 100, PUE: 3.0, UtilizationPercent: 50, OperatingHoursYear: 8760,
            },
            wantErr: false,
        },
        {
            name: "Zero utilization",
            input: EnergyCalculationInput{
                ITLoadKW: 1000, PUE: 1.5, UtilizationPercent: 0, OperatingHoursYear: 8760,
            },
            wantErr: false,
        },
        {
            name: "Invalid PUE below 1.0",
            input: EnergyCalculationInput{
                ITLoadKW: 100, PUE: 0.9, UtilizationPercent: 70, OperatingHoursYear: 8760,
            },
            wantErr: true,
        },
        {
            name: "Invalid utilization above 100%",
            input: EnergyCalculationInput{
                ITLoadKW: 100, PUE: 1.5, UtilizationPercent: 150, OperatingHoursYear: 8760,
            },
            wantErr: true,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            _, err := CalculateEnergyConsumption(tt.input)
            if tt.wantErr {
                assert.Error(t, err)
            } else {
                assert.NoError(t, err)
            }
        })
    }
}
```

---

## 4. References

- **Python Implementation:** `backend/prediction_engine.py:41-59`
- **Industry Standards:**
  - PUE defined by The Green Grid (<https://www.thegreengrid.org/>)
  - ASHRAE TC 9.9 for data center thermal guidelines
- **Physics Basis:** First Law of Thermodynamics (energy conservation)

---

## 5. Notes for Implementation

1. **Floating Point Precision:** Use `float64` for all calculations to maintain precision
2. **Error Handling:** All invalid inputs must return descriptive errors
3. **Unit Consistency:** All power values in kW, energy in kWh, time in hours
4. **Performance:** These are pure functions with no side effects - highly cacheable
5. **Logging:** Log input parameters for audit trail in production
