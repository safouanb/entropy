# Sensitivity Analysis and Yearly Breakdown Models

## Overview

This document describes the algorithms for generating yearly cash flow breakdowns with escalation and performing sensitivity analysis on key parameters.

---

## 1. Yearly Breakdown with Escalation

### 1.1 Purpose

Generate year-by-year projections of savings accounting for:

- Annual escalation of costs/savings
- Cumulative savings over project life
- Escalation factors for financial planning

### 1.2 Formula

**For Each Year (t = 1 to project_years):**

```
escalation_factor_t = (1 + escalation_rate)^(t-1)
annual_savings_t = annual_savings_base × escalation_factor_t
cumulative_savings_t = Σ(annual_savings_i) for i = 1 to t
```

**Parameters:**

- `annual_savings_base`: First-year savings (baseline)
- `escalation_rate = 0.03` (3% default, typical for energy costs)
- `project_years = 10` (default analysis horizon)

**Source:** `prediction_engine.py:352-371`

---

### 1.3 Python Implementation

```python
def generate_yearly_breakdown(self,
                            annual_savings: float,
                            project_years: int = 10,
                            escalation_rate: float = 0.03) -> List[Dict]:
    
    yearly_data = []
    cumulative_savings = 0
    
    for year in range(1, project_years + 1):
        escalated_savings = annual_savings * ((1 + escalation_rate) ** (year - 1))
        cumulative_savings += escalated_savings
        
        yearly_data.append({
            'year': year,
            'annual_savings': round(escalated_savings, 2),
            'cumulative_savings': round(cumulative_savings, 2),
            'escalation_factor': round((1 + escalation_rate) ** (year - 1), 3)
        })
    
    return yearly_data
```

**Source:** `prediction_engine.py:352-371`

---

### 1.4 Example Calculation

**Given:**

- Base annual savings: $100,000
- Escalation rate: 3% per year
- Project horizon: 5 years

**Yearly Breakdown:**

| Year | Escalation Factor | Annual Savings | Cumulative Savings |
|------|-------------------|----------------|-------------------|
| 1    | 1.000             | $100,000       | $100,000          |
| 2    | 1.030             | $103,000       | $203,000          |
| 3    | 1.061             | $106,090       | $309,090          |
| 4    | 1.093             | $109,273       | $418,363          |
| 5    | 1.126             | $112,551       | $530,914          |

**Total 5-Year Savings:** $530,914

---

### 1.5 Escalation Rate Context

**Typical Escalation Rates:**

```
Energy costs:        2-5% per year
General inflation:   2-3% per year
Labor costs:         3-4% per year
Conservative:        2% per year
Moderate:            3% per year (default)
Aggressive:          4-5% per year
```

**Business Logic:**

- Accounts for rising energy costs over time
- Reflects real-world cost inflation
- Makes multi-year projections more realistic
- Important for long-term investment decisions

---

## 2. Sensitivity Analysis

### 2.1 Purpose

Evaluate how changes in key input parameters affect financial outcomes:

- Identify critical variables
- Quantify risk exposure
- Support "what-if" scenario planning
- Build confidence intervals

### 2.2 Python Implementation

```python
def perform_sensitivity_analysis(self,
                               base_inputs: Dict,
                               sensitivity_ranges: Dict) -> Dict:
    
    sensitivity_results = {}
    
    for param, range_values in sensitivity_ranges.items():
        param_results = []
        
        for value in range_values:
            modified_inputs = base_inputs.copy()
            modified_inputs[param] = value
            
            # Simplified calculation for demonstration
            param_results.append({
                'parameter_value': value,
                'npv_impact': value * 1000,  # Simplified
                'irr_impact': value * 0.01   # Simplified
            })
        
        sensitivity_results[param] = param_results
    
    return sensitivity_results
```

**Note:** Current implementation is simplified placeholder. Full implementation would recalculate financial metrics for each parameter variation.

**Source:** `prediction_engine.py:373-391`

---

### 2.3 Sensitivity Analysis Methodology

**Full Implementation Should:**

1. **Define Parameters to Test:**

   ```
   - IT load (±20%)
   - PUE (±10%)
   - Electricity cost (±20%)
   - Distance to sink (±50%)
   - Heat recovery efficiency (±15%)
   ```

2. **For Each Parameter:**

   ```
   for each parameter:
       for each test_value in range:
           modified_inputs = base_inputs.copy()
           modified_inputs[parameter] = test_value
           
           # Recalculate all metrics
           energy_metrics = calculate_energy(modified_inputs)
           financial_metrics = calculate_financial(modified_inputs)
           
           # Store results
           sensitivity_results[parameter][test_value] = {
               'npv': financial_metrics.npv,
               'irr': financial_metrics.irr,
               'payback': financial_metrics.payback,
               'annual_savings': financial_metrics.savings
           }
   ```

3. **Calculate Impact Metrics:**

   ```
   sensitivity_index = (Δoutput / baseline_output) / (Δinput / baseline_input)
   ```

   - High sensitivity index = critical parameter
   - Low sensitivity index = less important parameter

---

### 2.4 Tornado Diagram Data

**Purpose:** Identify most influential parameters

**Calculation:**

```
For each parameter:
    low_case_npv = calculate_npv(parameter at -20%)
    high_case_npv = calculate_npv(parameter at +20%)
    
    npv_range = high_case_npv - low_case_npv
    
Sort parameters by npv_range (descending)
```

**Typical Ranking (Most to Least Sensitive):**

1. Electricity rate (highest impact)
2. IT load / utilization
3. PUE
4. Distance to heat sink
5. Heat recovery efficiency
6. Escalation rate

---

## 3. Implementation Requirements for Go

### 3.1 Data Types

```go
type YearlyBreakdown struct {
    Year              int     `json:"year"`
    AnnualSavings     float64 `json:"annual_savings"`
    CumulativeSavings float64 `json:"cumulative_savings"`
    EscalationFactor  float64 `json:"escalation_factor"`
}

type SensitivityParameter struct {
    ParameterName  string               `json:"parameter_name"`
    BaseValue      float64              `json:"base_value"`
    TestValues     []float64            `json:"test_values"`
    Results        []SensitivityResult  `json:"results"`
}

type SensitivityResult struct {
    TestValue       float64 `json:"test_value"`
    PercentChange   float64 `json:"percent_change"`
    NPV             float64 `json:"npv"`
    IRR             float64 `json:"irr"`
    PaybackYears    float64 `json:"payback_years"`
    AnnualSavings   float64 `json:"annual_savings"`
}

type SensitivityAnalysis struct {
    BaseCase    FinancialMetrics     `json:"base_case"`
    Parameters  []SensitivityParameter `json:"parameters"`
    TornadoData []TornadoEntry       `json:"tornado_data"` // Sorted by impact
}

type TornadoEntry struct {
    ParameterName string  `json:"parameter_name"`
    LowCaseNPV    float64 `json:"low_case_npv"`
    HighCaseNPV   float64 `json:"high_case_npv"`
    NPVRange      float64 `json:"npv_range"`
    Sensitivity   float64 `json:"sensitivity_index"`
}
```

### 3.2 Constants

```go
const (
    // Yearly Breakdown
    DefaultEscalationRate  = 0.03   // 3% annual
    DefaultProjectYears    = 10
    
    // Sensitivity Analysis
    DefaultSensitivityRange = 0.20  // ±20%
    
    // Sensitivity Test Ranges
    ITLoadVariation        = 0.20   // ±20%
    PUEVariation           = 0.10   // ±10%
    ElectricityVariation   = 0.20   // ±20%
    DistanceVariation      = 0.50   // ±50%
    EfficiencyVariation    = 0.15   // ±15%
)
```

### 3.3 Core Functions

```go
// GenerateYearlyBreakdown creates year-by-year projections with escalation
func GenerateYearlyBreakdown(
    annualSavingsBase float64,
    projectYears int,
    escalationRate float64,
) []YearlyBreakdown {
    
    breakdown := make([]YearlyBreakdown, projectYears)
    cumulativeSavings := 0.0
    
    for year := 1; year <= projectYears; year++ {
        escalationFactor := math.Pow(1+escalationRate, float64(year-1))
        annualSavings := annualSavingsBase * escalationFactor
        cumulativeSavings += annualSavings
        
        breakdown[year-1] = YearlyBreakdown{
            Year:              year,
            AnnualSavings:     math.Round(annualSavings*100) / 100,
            CumulativeSavings: math.Round(cumulativeSavings*100) / 100,
            EscalationFactor:  math.Round(escalationFactor*1000) / 1000,
        }
    }
    
    return breakdown
}

// PerformSensitivityAnalysis evaluates parameter impact on financial metrics
func PerformSensitivityAnalysis(
    baseInputs FinancialInput,
    parameters []string,
    testRange float64,
) (SensitivityAnalysis, error) {
    
    // Calculate base case
    baseMetrics, _, err := CalculateFinancialMetrics(baseInputs)
    if err != nil {
        return SensitivityAnalysis{}, err
    }
    
    analysis := SensitivityAnalysis{
        BaseCase:   baseMetrics,
        Parameters: make([]SensitivityParameter, 0, len(parameters)),
    }
    
    // Test each parameter
    for _, paramName := range parameters {
        paramAnalysis := analyzeParameter(paramName, baseInputs, testRange)
        analysis.Parameters = append(analysis.Parameters, paramAnalysis)
    }
    
    // Generate tornado diagram data
    analysis.TornadoData = generateTornadoData(analysis.Parameters, baseMetrics.NetPresentValue)
    
    return analysis, nil
}

// analyzeParameter tests a single parameter across a range of values
func analyzeParameter(
    paramName string,
    baseInputs FinancialInput,
    testRange float64,
) SensitivityParameter {
    
    baseValue := getParameterValue(baseInputs, paramName)
    
    // Generate test values: -20%, -10%, 0%, +10%, +20%
    testValues := []float64{
        baseValue * (1 - testRange),
        baseValue * (1 - testRange/2),
        baseValue,
        baseValue * (1 + testRange/2),
        baseValue * (1 + testRange),
    }
    
    results := make([]SensitivityResult, len(testValues))
    
    for i, testValue := range testValues {
        // Modify inputs with test value
        modifiedInputs := baseInputs
        setParameterValue(&modifiedInputs, paramName, testValue)
        
        // Recalculate metrics
        metrics, _, err := CalculateFinancialMetrics(modifiedInputs)
        if err != nil {
            log.Warn("Sensitivity calculation failed", "param", paramName, "value", testValue)
            continue
        }
        
        percentChange := ((testValue - baseValue) / baseValue) * 100
        
        results[i] = SensitivityResult{
            TestValue:     testValue,
            PercentChange: percentChange,
            NPV:           metrics.NetPresentValue,
            IRR:           metrics.InternalRateOfReturn,
            PaybackYears:  metrics.SimplePaybackYears,
            AnnualSavings: 0, // Would need to calculate from metrics
        }
    }
    
    return SensitivityParameter{
        ParameterName: paramName,
        BaseValue:     baseValue,
        TestValues:    testValues,
        Results:       results,
    }
}

// generateTornadoData creates sorted impact rankings
func generateTornadoData(
    parameters []SensitivityParameter,
    baseNPV float64,
) []TornadoEntry {
    
    tornado := make([]TornadoEntry, len(parameters))
    
    for i, param := range parameters {
        // Find low and high case NPVs
        var lowNPV, highNPV float64
        
        for _, result := range param.Results {
            if result.PercentChange < 0 {
                lowNPV = result.NPV
            } else if result.PercentChange > 0 {
                highNPV = result.NPV
            }
        }
        
        npvRange := math.Abs(highNPV - lowNPV)
        
        // Calculate sensitivity index
        percentInputChange := 20.0 // Assuming ±20% test range
        percentOutputChange := ((npvRange / 2) / baseNPV) * 100
        sensitivity := percentOutputChange / percentInputChange
        
        tornado[i] = TornadoEntry{
            ParameterName: param.ParameterName,
            LowCaseNPV:    lowNPV,
            HighCaseNPV:   highNPV,
            NPVRange:      npvRange,
            Sensitivity:   sensitivity,
        }
    }
    
    // Sort by NPV range (descending)
    sort.Slice(tornado, func(i, j int) bool {
        return tornado[i].NPVRange > tornado[j].NPVRange
    })
    
    return tornado
}

// Helper functions for parameter access
func getParameterValue(inputs FinancialInput, paramName string) float64 {
    switch paramName {
    case "it_load_kw":
        return inputs.ITLoadKW
    case "pue":
        return inputs.PUE
    case "electricity_rate":
        return inputs.ElectricityRate
    // Add more parameters as needed
    default:
        return 0
    }
}

func setParameterValue(inputs *FinancialInput, paramName string, value float64) {
    switch paramName {
    case "it_load_kw":
        inputs.ITLoadKW = value
    case "pue":
        inputs.PUE = value
    case "electricity_rate":
        inputs.ElectricityRate = value
    // Add more parameters as needed
    }
}
```

---

## 4. Test Cases

### 4.1 Yearly Breakdown Test

```go
func TestYearlyBreakdown(t *testing.T) {
    breakdown := GenerateYearlyBreakdown(100000, 5, 0.03)
    
    assert.Equal(t, 5, len(breakdown))
    
    // Year 1
    assert.Equal(t, 1, breakdown[0].Year)
    assert.InDelta(t, 100000, breakdown[0].AnnualSavings, 1.0)
    assert.InDelta(t, 100000, breakdown[0].CumulativeSavings, 1.0)
    assert.InDelta(t, 1.000, breakdown[0].EscalationFactor, 0.001)
    
    // Year 2
    assert.Equal(t, 2, breakdown[1].Year)
    assert.InDelta(t, 103000, breakdown[1].AnnualSavings, 1.0)
    assert.InDelta(t, 203000, breakdown[1].CumulativeSavings, 1.0)
    assert.InDelta(t, 1.030, breakdown[1].EscalationFactor, 0.001)
    
    // Year 5
    assert.Equal(t, 5, breakdown[4].Year)
    assert.InDelta(t, 112551, breakdown[4].AnnualSavings, 1.0)
    assert.InDelta(t, 530914, breakdown[4].CumulativeSavings, 1.0)
}
```

### 4.2 Sensitivity Analysis Test

```go
func TestSensitivityAnalysis(t *testing.T) {
    baseInputs := FinancialInput{
        ITLoadKW:       1000.0,
        PUE:            1.5,
        ElectricityRate: 0.15,
        // ... other fields
    }
    
    parameters := []string{"it_load_kw", "pue", "electricity_rate"}
    
    analysis, err := PerformSensitivityAnalysis(baseInputs, parameters, 0.20)
    
    assert.NoError(t, err)
    assert.Equal(t, 3, len(analysis.Parameters))
    assert.Equal(t, 3, len(analysis.TornadoData))
    
    // Tornado data should be sorted by impact
    assert.Greater(t, analysis.TornadoData[0].NPVRange, 
                   analysis.TornadoData[1].NPVRange)
}
```

---

## 5. References

- **Python Implementation:** `backend/prediction_engine.py:352-391`
- **Financial Analysis:** Sensitivity analysis in capital budgeting
- **Risk Management:** Monte Carlo simulation techniques

---

## 6. Notes for Implementation

1. **Performance:** Sensitivity analysis can be computationally expensive; consider caching
2. **Parallelization:** Test different parameters in parallel for speed
3. **Granularity:** Offer both coarse (±20%) and fine (±5%) sensitivity tests
4. **Visualization:** Generate data suitable for tornado diagrams and spider plots
5. **Monte Carlo:** Consider adding probabilistic simulation for advanced users
6. **Correlation:** Account for parameter correlations in advanced analysis
7. **Reporting:** Provide clear interpretation of sensitivity results for non-technical users
