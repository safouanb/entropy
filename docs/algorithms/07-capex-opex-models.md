# CAPEX and OPEX Calculation Models

## Overview

This document describes the Capital Expenditure (CAPEX) and Operating Expenditure (OPEX) calculation models for data center and heat recovery infrastructure.

---

## 1. Capital Expenditure (CAPEX) Calculations

### 1.1 Base Data Center CAPEX

**Formula:**

```
base_dc_capex = it_load_kw × 8000
```

**Parameters:**

- `it_load_kw`: Total IT equipment power capacity
- `8000`: Cost per kW (USD/kW)

**Industry Context:**

- $5,000-12,000 per kW is typical range
- $8,000/kW is moderate estimate
- Includes:
  - IT equipment racks and servers
  - Cooling infrastructure
  - Power distribution
  - UPS systems
  - Generator backup
  - Building shell and raised floor
  - Network infrastructure

**Invariants:**

- `it_load_kw > 0`
- `base_dc_capex = it_load_kw × 8000`

**Source:** `prediction_engine.py:128`

---

### 1.2 Heat Recovery Infrastructure CAPEX

**Formula:**

```
if heat_recovery_enabled:
    heat_exchanger_cost = it_load_kw × heat_exchanger_cost_per_kw × size_factor
    connection_cost = base_connection_cost + (distance_km × connection_cost_per_km)
    heat_recovery_capex = heat_exchanger_cost + connection_cost
else:
    heat_recovery_capex = 0
```

**Parameters:**

- `heat_exchanger_cost_per_kw = $150/kW` (default)
- `heat_exchanger_size_factor = 1.0` (default, can be adjusted)
- `base_connection_cost = $50,000` (fixed costs)
- `connection_cost_per_km = $100,000/km` (default)
- `distance_km`: Distance to heat sink

**Components:**

**Heat Exchanger Cost:**

```
heat_exchanger_cost = it_load_kw × $150 × size_factor
```

- Includes plate heat exchangers
- Temperature monitoring equipment
- Control systems
- Installation labor

**Connection Infrastructure Cost:**

```
connection_cost = $50,000 + (distance_km × $100,000)
```

- **Fixed Costs ($50,000):**
  - Connection permits
  - Engineering design
  - Project management
  - System integration
  
- **Variable Costs ($100,000/km):**
  - Insulated pipe installation
  - Trenching and excavation
  - Pumps and circulation equipment
  - Flow control valves

**Total Heat Recovery CAPEX:**

```
heat_recovery_capex = heat_exchanger_cost + connection_cost
```

**Source:** `prediction_engine.py:131-139`

---

### 1.3 Total Project CAPEX

**Formula:**

```
total_project_capex = base_dc_capex + heat_recovery_capex
```

**Return Structure:**

```python
{
    'base_data_center_capex': float,
    'heat_exchanger_cost': float,
    'connection_infrastructure_cost': float,
    'total_heat_recovery_capex': float,
    'total_project_capex': float,
    'capex_per_kw': float  # total_capex / it_load_kw
}
```

**Source:** `prediction_engine.py:143-151`

---

## 2. Operating Expenditure (OPEX) Calculations

### 2.1 Annual Electricity Cost

**Formula:**

```
annual_electricity_cost = annual_energy_consumption_kwh × electricity_rate_per_kwh
```

**Parameters:**

- `annual_energy_consumption_kwh`: Total annual energy use
- `electricity_rate_per_kwh = $0.15/kWh` (default)

**Rate Variations:**

```
Residential:      $0.12-0.20/kWh
Commercial:       $0.10-0.15/kWh
Industrial:       $0.08-0.12/kWh
California avg:   $0.19/kWh
US avg:           $0.13/kWh
```

**Invariants:**

- `electricity_rate_per_kwh > 0`
- Linear relationship with energy consumption

**Source:** `prediction_engine.py:161`

---

### 2.2 Base Maintenance Cost

**Formula:**

```
base_maintenance_cost = it_load_kw × 200
```

**Parameters:**

- `it_load_kw`: IT equipment capacity
- `$200/kW/year`: Annual maintenance rate

**Includes:**

- Preventive maintenance
- Equipment servicing
- Parts replacement
- Labor costs
- Service contracts
- Cleaning and inspections

**Industry Benchmarks:**

- $150-250/kW/year typical range
- $200/kW is moderate estimate

**Source:** `prediction_engine.py:163`

---

### 2.3 Heat Recovery System Maintenance

**Formula:**

```
if heat_recovery_enabled:
    heat_recovery_capex = (it_load_kw × heat_exchanger_cost_per_kw +
                          base_connection_cost +
                          (distance_km × connection_cost_per_km))
    heat_recovery_maintenance = heat_recovery_capex × maintenance_rate
else:
    heat_recovery_maintenance = 0
```

**Parameters:**

- `maintenance_rate = 0.03` (3% of CAPEX per year, default)

**Maintenance Rate Context:**

- 2-5% of CAPEX typical for mechanical systems
- 3% is moderate estimate
- Covers:
  - Heat exchanger cleaning
  - Pipe inspection
  - Pump maintenance
  - Control system servicing
  - Leak detection and repair

**Source:** `prediction_engine.py:165-170`

---

### 2.4 Total Annual OPEX

**Formula:**

```
total_annual_opex = annual_electricity_cost + 
                    base_maintenance_cost + 
                    heat_recovery_maintenance
```

**Return Structure:**

```python
{
    'annual_electricity_cost': float,
    'base_maintenance_cost': float,
    'heat_recovery_maintenance_cost': float,
    'total_annual_opex': float,
    'opex_per_kwh': float  # total_opex / annual_energy_kwh
}
```

**Source:** `prediction_engine.py:172-182`

---

## 3. Savings Calculation Between Scenarios

### 3.1 Scenario Comparison Model

**Formula:**

```
additional_capex = max(improved_capex - base_capex, 0)

base_opex = base_case['total_annual_opex']
improved_opex = improved_case['total_annual_opex']

energy_savings_kwh = max(base_energy - improved_energy, 0)
energy_cost_savings = energy_savings_kwh × electricity_rate

maintenance_savings = max(base_opex - improved_opex, 0)
heat_savings = improved_case['annual_gas_cost_savings']

total_annual_savings = energy_cost_savings + maintenance_savings + heat_savings

payback_years = additional_capex / total_annual_savings  (if savings > 0)
```

**Components:**

**Additional CAPEX Required:**

- Incremental investment for improved case
- Only positive values counted (no credit for lower CAPEX)

**Energy Cost Savings:**

- From efficiency improvements (better PUE, etc.)
- Valued at electricity rate

**Maintenance Savings:**

- Difference in annual maintenance costs
- Could be positive or negative

**Heat Recovery Savings:**

- Value of natural gas displaced
- Additional revenue/savings from heat recovery

**Source:** `prediction_engine.py:184-243`

---

### 3.2 Minimum Savings Guarantee

**Logic:**

```python
if energy_savings_kwh > 0 or heat_savings > 0:
    # Ensure minimum realistic savings
    if total_annual_savings < energy_savings_kwh * MinValuePerKWhSaved:
        total_annual_savings = energy_savings_kwh * MinValuePerKWhSaved + heat_savings
    
    # Minimum $50k annual savings for any efficiency improvement
    total_annual_savings = max(total_annual_savings, 50000)
```

**Rationale:**

- Ensures conservative but realistic estimates
- Prevents unrealistically low savings calculations
- At least $0.10/kWh value for energy savings
- Minimum $50k threshold for project viability

**Source:** `prediction_engine.py:216-222`

---

## 4. Implementation Requirements for Go

### 4.1 Data Types

```go
type CAPEXMetrics struct {
    BaseDataCenterCAPEX           float64 `json:"base_data_center_capex"`
    HeatExchangerCost             float64 `json:"heat_exchanger_cost"`
    ConnectionInfrastructureCost  float64 `json:"connection_infrastructure_cost"`
    TotalHeatRecoveryCAPEX        float64 `json:"total_heat_recovery_capex"`
    TotalProjectCAPEX             float64 `json:"total_project_capex"`
    CAPEXPerKW                    float64 `json:"capex_per_kw"`
}

type OPEXMetrics struct {
    AnnualElectricityCost        float64 `json:"annual_electricity_cost"`
    BaseMaintenanceCost          float64 `json:"base_maintenance_cost"`
    HeatRecoveryMaintenanceCost  float64 `json:"heat_recovery_maintenance_cost"`
    TotalAnnualOPEX              float64 `json:"total_annual_opex"`
    OPEXPerKWh                   float64 `json:"opex_per_kwh"`
}

type CAPEXInput struct {
    ITLoadKW                float64 `validate:"required,gt=0"`
    HeatRecoveryEnabled     bool
    DistanceToSinkKM        float64 `validate:"gte=0"`
    ConnectionCostPerKM     float64 `validate:"gte=0"` // Default: 100000
    HeatExchangerSizeFactor float64 `validate:"gt=0"`  // Default: 1.0
}

type OPEXInput struct {
    ITLoadKW                 float64 `validate:"required,gt=0"`
    AnnualEnergyConsumptionKWh float64 `validate:"required,gte=0"`
    HeatRecoveryEnabled      bool
    DistanceToSinkKM         float64 `validate:"gte=0"`
    ElectricityRatePerKWh    float64 `validate:"required,gt=0"` // Default: 0.15
    MaintenanceRate          float64 `validate:"gte=0,lte=0.1"` // Default: 0.03
}
```

### 4.2 Constants

```go
const (
    // CAPEX Constants
    BaseDataCenterCostPerKW      = 8000.0    // USD per kW
    HeatExchangerCostPerKW       = 150.0     // USD per kW
    BaseConnectionCost           = 50000.0   // USD
    DefaultConnectionCostPerKM   = 100000.0  // USD per km
    DefaultHeatExchangerSizeFactor = 1.0
    
    // OPEX Constants
    DefaultElectricityRate       = 0.15      // USD per kWh
    BaseMaintenanceCostPerKW     = 200.0     // USD per kW per year
    DefaultMaintenanceRate       = 0.03      // 3% of CAPEX per year
    
    // Savings Calculation
    MinAnnualSavings            = 50000.0    // USD
    MinValuePerKWhSaved         = 0.10       // USD per kWh
)
```

### 4.3 Core Functions

```go
// CalculateCAPEX computes capital expenditure for data center and heat recovery
func CalculateCAPEX(input CAPEXInput) (CAPEXMetrics, error) {
    if err := input.Validate(); err != nil {
        return CAPEXMetrics{}, err
    }
    
    // Base data center CAPEX
    baseDCCAPEX := input.ITLoadKW * BaseDataCenterCostPerKW
    
    var heatExchangerCost, connectionCost, heatRecoveryCAPEX float64
    
    if input.HeatRecoveryEnabled {
        // Heat exchanger cost
        heatExchangerCost = input.ITLoadKW * 
                           HeatExchangerCostPerKW * 
                           input.HeatExchangerSizeFactor
        
        // Connection infrastructure cost
        connectionCost = BaseConnectionCost + 
                        (input.DistanceToSinkKM * input.ConnectionCostPerKM)
        
        heatRecoveryCAPEX = heatExchangerCost + connectionCost
    }
    
    totalCAPEX := baseDCCAPEX + heatRecoveryCAPEX
    capexPerKW := totalCAPEX / input.ITLoadKW
    
    return CAPEXMetrics{
        BaseDataCenterCAPEX:          baseDCCAPEX,
        HeatExchangerCost:            heatExchangerCost,
        ConnectionInfrastructureCost: connectionCost,
        TotalHeatRecoveryCAPEX:       heatRecoveryCAPEX,
        TotalProjectCAPEX:            totalCAPEX,
        CAPEXPerKW:                   capexPerKW,
    }, nil
}

// CalculateOPEX computes annual operating expenditure
func CalculateOPEX(input OPEXInput) (OPEXMetrics, error) {
    if err := input.Validate(); err != nil {
        return OPEXMetrics{}, err
    }
    
    // Annual electricity cost
    electricityCost := input.AnnualEnergyConsumptionKWh * input.ElectricityRatePerKWh
    
    // Base maintenance cost
    baseMaintenance := input.ITLoadKW * BaseMaintenanceCostPerKW
    
    var heatRecoveryMaintenance float64
    
    if input.HeatRecoveryEnabled {
        // Calculate heat recovery CAPEX for maintenance calculation
        heatRecoveryCAPEX := (input.ITLoadKW * HeatExchangerCostPerKW) +
                            BaseConnectionCost +
                            (input.DistanceToSinkKM * DefaultConnectionCostPerKM)
        
        heatRecoveryMaintenance = heatRecoveryCAPEX * input.MaintenanceRate
    }
    
    totalOPEX := electricityCost + baseMaintenance + heatRecoveryMaintenance
    
    opexPerKWh := 0.0
    if input.AnnualEnergyConsumptionKWh > 0 {
        opexPerKWh = totalOPEX / input.AnnualEnergyConsumptionKWh
    }
    
    return OPEXMetrics{
        AnnualElectricityCost:       electricityCost,
        BaseMaintenanceCost:         baseMaintenance,
        HeatRecoveryMaintenanceCost: heatRecoveryMaintenance,
        TotalAnnualOPEX:             totalOPEX,
        OPEXPerKWh:                  opexPerKWh,
    }, nil
}

// CalculateSavingsScenarios compares base case to improved case
func CalculateSavingsScenarios(baseCase, improvedCase ScenarioMetrics) SavingsMetrics {
    // Calculate additional CAPEX required (only positive values)
    additionalCAPEX := math.Max(improvedCase.TotalCAPEX - baseCase.TotalCAPEX, 0)
    
    // Calculate energy savings
    energySavingsKWh := math.Max(baseCase.AnnualEnergyKWh - improvedCase.AnnualEnergyKWh, 0)
    energyCostSavings := energySavingsKWh * DefaultElectricityRate
    
    // Calculate maintenance savings
    maintenanceSavings := math.Max(baseCase.AnnualOPEX - improvedCase.AnnualOPEX, 0)
    
    // Add heat recovery savings
    heatSavings := improvedCase.AnnualGasCostSavings
    
    // Calculate total annual savings
    totalAnnualSavings := energyCostSavings + maintenanceSavings + heatSavings
    
    // Apply minimum savings guarantees
    if energySavingsKWh > 0 || heatSavings > 0 {
        // Ensure at least $0.10/kWh value
        minValue := energySavingsKWh * MinValuePerKWhSaved
        if totalAnnualSavings < minValue {
            totalAnnualSavings = energySavingsKWh*MinValuePerKWhSaved + heatSavings
        }
        
        // Ensure minimum $50k for any efficiency improvement
        totalAnnualSavings = math.Max(totalAnnualSavings, MinAnnualSavings)
    }
    
    // Calculate payback period
    paybackYears := 999.0
    if totalAnnualSavings > 0 {
        paybackYears = additionalCAPEX / totalAnnualSavings
    }
    
    // Calculate CO2 reduction
    co2ReductionKg := math.Max(baseCase.AnnualCO2Kg - improvedCase.AnnualCO2Kg, 0) +
                      improvedCase.CO2AvoidedKg
    
    return SavingsMetrics{
        AdditionalCAPEXRequired: additionalCAPEX,
        AnnualOPEXSavings:       maintenanceSavings,
        AnnualEnergySavings:     energyCostSavings,
        AnnualHeatSavings:       heatSavings,
        NetAnnualSavings:        totalAnnualSavings,
        CAPEXPaybackYears:       paybackYears,
        AnnualCO2ReductionKg:    co2ReductionKg,
    }
}
```

---

## 5. Test Cases

### 5.1 Basic CAPEX Test

```go
func TestCAPEX_BaseDataCenter(t *testing.T) {
    input := CAPEXInput{
        ITLoadKW:            1000.0,
        HeatRecoveryEnabled: false,
        DistanceToSinkKM:    0,
    }
    
    result, err := CalculateCAPEX(input)
    
    assert.NoError(t, err)
    assert.Equal(t, 8000000.0, result.BaseDataCenterCAPEX)  // 1000 × 8000
    assert.Equal(t, 0.0, result.TotalHeatRecoveryCAPEX)
    assert.Equal(t, 8000000.0, result.TotalProjectCAPEX)
    assert.Equal(t, 8000.0, result.CAPEXPerKW)
}
```

### 5.2 Heat Recovery CAPEX Test

```go
func TestCAPEX_WithHeatRecovery(t *testing.T) {
    input := CAPEXInput{
        ITLoadKW:             1000.0,
        HeatRecoveryEnabled:  true,
        DistanceToSinkKM:     5.0,
        ConnectionCostPerKM:  100000.0,
        HeatExchangerSizeFactor: 1.0,
    }
    
    result, err := CalculateCAPEX(input)
    
    assert.NoError(t, err)
    
    expectedHeatExchanger := 1000.0 * 150.0  // $150,000
    expectedConnection := 50000.0 + (5.0 * 100000.0)  // $550,000
    expectedHeatRecovery := expectedHeatExchanger + expectedConnection  // $700,000
    
    assert.Equal(t, expectedHeatExchanger, result.HeatExchangerCost)
    assert.Equal(t, expectedConnection, result.ConnectionInfrastructureCost)
    assert.Equal(t, expectedHeatRecovery, result.TotalHeatRecoveryCAPEX)
}
```

---

## 6. References

- **Python Implementation:** `backend/prediction_engine.py:121-243`
- **Industry Data:**
  - Uptime Institute data center cost surveys
  - ASHRAE district heating cost guidelines
  - DOE industrial energy efficiency programs

---

## 7. Notes for Implementation

1. **Regional Costs:** Adjust cost factors for different regions/countries
2. **Currency:** Support multi-currency calculations
3. **Escalation:** Consider adding cost escalation factors for multi-year projects
4. **Granularity:** May need more detailed cost breakdowns for large projects
5. **Validation:** All cost parameters must be positive
6. **Audit Trail:** Log all cost calculations for financial audits
7. **Sensitivity:** Costs are subject to market conditions and should be regularly updated
