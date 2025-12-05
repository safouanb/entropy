# Financial Modeling Algorithms

## Overview

This document describes the comprehensive financial modeling system including Net Present Value (NPV), Internal Rate of Return (IRR), payback period, depreciation, tax effects, and investment grading.

---

## 1. Net Present Value (NPV) Calculation

### 1.1 Concept

NPV calculates the present value of future cash flows discounted at a specified rate, accounting for the time value of money.

**Core Principle:** A dollar today is worth more than a dollar tomorrow.

### 1.2 Cash Flow Structure

**Formula:**

```
NPV = Σ(CFₜ / (1 + r)^t) for t = 0 to n

where:
  CFₜ = Cash flow at time t
  r = Discount rate
  t = Time period (years)
  n = Total number of periods
```

**Initial Cash Flow:**

```
CF₀ = -total_capex  (negative, represents investment outflow)
```

**Subsequent Cash Flows:**

```
CFₜ = after_tax_savings_t  for t = 1 to n
```

**Source:** `prediction_engine.py:263, 280`

---

### 1.3 After-Tax Savings Calculation

**With Depreciation (Years 1 through depreciation_years):**

```
annual_depreciation = total_capex / depreciation_years
escalated_savings = annual_savings × (1 + escalation_rate)^(t-1)
taxable_income = escalated_savings - annual_depreciation
tax_benefit = max(0, taxable_income × tax_rate)
after_tax_savings = escalated_savings - tax_benefit
```

**After Depreciation Period:**

```
escalated_savings = annual_savings × (1 + escalation_rate)^(t-1)
after_tax_savings = escalated_savings × (1 - tax_rate)
```

**Invariants:**

- `depreciation_years ≤ project_years`
- `0 ≤ tax_rate ≤ 1`
- `escalation_rate` typically 0.02-0.05 (2-5% annual)

**Source:** `prediction_engine.py:267-276`

---

### 1.4 Default Parameters

```python
discount_rate = 0.08        # 8% (weighted average cost of capital)
escalation_rate = 0.03      # 3% annual savings growth
tax_rate = 0.25             # 25% corporate tax rate
depreciation_years = 7      # MACRS 7-year property class
project_years = 10          # 10-year analysis horizon
```

**Source:** `prediction_engine.py:248-252, 34`

---

### 1.5 NPV Implementation

**Python Code:**

```python
def calculate_financial_metrics(self,
                              total_capex: float,
                              annual_savings: float,
                              project_years: int = 10,
                              discount_rate: float = None,
                              escalation_rate: float = 0.03,
                              tax_rate: float = 0.25,
                              depreciation_years: int = 7) -> Dict[str, float]:
    
    if discount_rate is None:
        discount_rate = self.default_discount_rate  # 0.08
    
    # Ensure realistic minimum values
    if total_capex <= 0:
        total_capex = 10000  # Minimum investment
    if annual_savings <= 0:
        annual_savings = 5000  # Minimum savings
    
    cash_flows = [-total_capex]
    annual_depreciation = total_capex / depreciation_years
    
    for year in range(1, project_years + 1):
        escalated_savings = annual_savings * ((1 + escalation_rate) ** (year - 1))
        
        if year <= depreciation_years:
            taxable_income = escalated_savings - annual_depreciation
            tax_benefit = max(0, taxable_income * tax_rate)
            after_tax_savings = escalated_savings - tax_benefit
        else:
            after_tax_savings = escalated_savings * (1 - tax_rate)
        
        cash_flows.append(after_tax_savings)
    
    # Calculate NPV
    npv = sum(cf / ((1 + discount_rate) ** i) for i, cf in enumerate(cash_flows))
    
    return npv
```

**Source:** `prediction_engine.py:245-280`

---

## 2. Internal Rate of Return (IRR) Calculation

### 2.1 Concept

IRR is the discount rate at which NPV equals zero. It represents the effective annual return of the investment.

**Mathematical Definition:**

```
NPV(IRR) = 0

Σ(CFₜ / (1 + IRR)^t) = 0  for t = 0 to n
```

### 2.2 Newton-Raphson Method

**Iterative Formula:**

```
rate_new = rate_old - f(rate_old) / f'(rate_old)

where:
  f(rate) = NPV(rate) = Σ(CFₜ / (1 + rate)^t)
  f'(rate) = dNPV/drate = Σ(-t × CFₜ / (1 + rate)^(t+1))
```

**Algorithm:**

```
1. Initialize: rate = 0.1 (10% starting guess)
2. Calculate NPV at current rate
3. Calculate derivative of NPV
4. Update rate using Newton-Raphson formula
5. Repeat until |NPV| < tolerance or max iterations reached
```

**Source:** `prediction_engine.py:315-339`

---

### 2.3 IRR Implementation

**Python Code:**

```python
def _calculate_irr(self, 
                  cash_flows: List[float], 
                  max_iterations: int = 100, 
                  tolerance: float = 1e-6) -> float:
    
    if len(cash_flows) < 2:
        return 0.0
    
    rate = 0.1  # Initial guess: 10%
    
    for _ in range(max_iterations):
        # Calculate NPV at current rate
        npv = sum(cf / ((1 + rate) ** i) for i, cf in enumerate(cash_flows))
        
        # Calculate derivative
        npv_derivative = sum(-i * cf / ((1 + rate) ** (i + 1)) 
                           for i, cf in enumerate(cash_flows) if i > 0)
        
        # Check convergence
        if abs(npv) < tolerance:
            return rate
        
        # Check for zero derivative (avoid division by zero)
        if abs(npv_derivative) < tolerance:
            break
        
        # Newton-Raphson update
        rate = rate - npv / npv_derivative
        
        # Clamp rate to reasonable bounds
        if rate < -0.99:
            rate = -0.99  # -99% minimum (total loss)
        elif rate > 10:
            rate = 10     # 1000% maximum (unrealistic)
    
    return rate
```

**Invariants:**

- `-0.99 ≤ IRR ≤ 10.0` (clamped for numerical stability)
- IRR converges for most realistic cash flow patterns
- May not converge for unconventional cash flow patterns (multiple sign changes)

**Source:** `prediction_engine.py:315-339`

---

### 2.4 IRR Convergence Conditions

**Guaranteed Convergence:**

- Single initial investment (negative CF₀)
- All subsequent cash flows positive
- Cash flows don't change sign multiple times

**Potential Issues:**

- Multiple IRRs possible with non-conventional cash flows
- No IRR if investment never becomes profitable
- Slow convergence with very long project horizons

---

## 3. Simple Payback Period

### 3.1 Formula

```
payback_years = total_capex / annual_savings
```

**Invariants:**

- `payback_years ≥ 0`
- Returns 999.0 if `annual_savings ≤ 0` (never pays back)

**Limitations:**

- Ignores time value of money (no discounting)
- Doesn't account for cash flows after payback
- Doesn't include tax effects or escalation

**Business Logic:**

- Quick, intuitive metric for decision-makers
- Useful screening tool for initial feasibility
- Should be used alongside NPV and IRR, not alone

**Source:** `prediction_engine.py:286`

---

## 4. Return on Investment (ROI)

### 4.1 Formula

```
ROI_percent = (NPV / total_capex) × 100
```

**Interpretation:**

- ROI > 0: Project creates value
- ROI = 0: Break-even
- ROI < 0: Project destroys value

**Example:**

```
total_capex = $1,000,000
NPV = $500,000
ROI = (500,000 / 1,000,000) × 100 = 50%
```

**Source:** `prediction_engine.py:289`

---

## 5. Investment Grade Classification

### 5.1 Grading Criteria

```
if NPV > 0 and IRR > 15% and payback < 5 years:
    grade = "A - Excellent"
elif NPV > 0 and IRR > 12% and payback < 7 years:
    grade = "B - Good"
elif NPV > 0 and IRR > 8% and payback < 10 years:
    grade = "C - Acceptable"
else:
    grade = "D - Poor"
```

**Criteria Table:**

| Grade | NPV    | IRR   | Payback | Interpretation                    |
|-------|--------|-------|---------|-----------------------------------|
| A     | > 0    | > 15% | < 5 yr  | Excellent investment, high priority |
| B     | > 0    | > 12% | < 7 yr  | Good investment, recommended      |
| C     | > 0    | > 8%  | < 10 yr | Acceptable, marginal             |
| D     | Any    | Any   | Any     | Poor investment, avoid           |

**Business Logic:**

- Grade A: Premier investment, immediate execution
- Grade B: Strong investment, prioritize in portfolio
- Grade C: Marginal, consider if strategic value exists
- Grade D: Reject unless non-financial benefits dominate

**Source:** `prediction_engine.py:341-350`

---

## 6. Error Handling and Edge Cases

### 6.1 NaN and Infinity Protection

**Python Implementation:**

```python
# Ensure realistic values
if math.isnan(npv) or math.isinf(npv):
    npv = annual_savings * project_years - total_capex

if math.isnan(irr) or math.isinf(irr) or irr < -1:
    irr = (annual_savings / total_capex) - discount_rate if total_capex > 0 else 0

if math.isnan(simple_payback) or math.isinf(simple_payback):
    simple_payback = 999.0

if math.isnan(roi_percent) or math.isinf(roi_percent):
    roi_percent = ((annual_savings * project_years - total_capex) / total_capex) * 100
```

**Fallback Logic:**

- NPV: Simple undiscounted calculation
- IRR: Rough approximation from first-year return
- Payback: Set to max value (999 years)
- ROI: Simple calculation without discounting

**Source:** `prediction_engine.py:292-302`

---

### 6.2 Minimum Value Enforcement

**Python Implementation:**

```python
# Ensure we have realistic minimum values
if total_capex <= 0:
    total_capex = 10000  # Minimum investment
if annual_savings <= 0:
    annual_savings = 5000  # Minimum savings
```

**Rationale:**

- Prevents division by zero
- Ensures calculations always complete
- Provides pessimistic estimate rather than error

**Source:** `prediction_engine.py:258-261`

---

## 7. Implementation Requirements for Go

### 7.1 Data Types

```go
type FinancialMetrics struct {
    NetPresentValue      float64 `json:"net_present_value"`
    InternalRateOfReturn float64 `json:"internal_rate_of_return"`  // As decimal (0.15 = 15%)
    SimplePaybackYears   float64 `json:"simple_payback_years"`
    InvestmentGrade      string  `json:"investment_grade"`
    TotalProjectValue    float64 `json:"total_project_value"`      // Sum of all future cash flows
    ROIPercent           float64 `json:"roi_percent"`
}

type FinancialInput struct {
    TotalCapex         float64 `validate:"required,gt=0"`
    AnnualSavings      float64 `validate:"required,gt=0"`
    ProjectYears       int     `validate:"required,gte=1,lte=50"`
    DiscountRate       float64 `validate:"gte=0,lte=1"`           // 0.08 = 8%
    EscalationRate     float64 `validate:"gte=-0.2,lte=0.5"`     // -20% to +50%
    TaxRate            float64 `validate:"gte=0,lte=1"`           // 0.25 = 25%
    DepreciationYears  int     `validate:"gte=1,lte=50"`
}

type CashFlow struct {
    Year              int     `json:"year"`
    GrossSavings      float64 `json:"gross_savings"`
    Depreciation      float64 `json:"depreciation"`
    TaxableIncome     float64 `json:"taxable_income"`
    TaxesPaid         float64 `json:"taxes_paid"`
    AfterTaxCashFlow  float64 `json:"after_tax_cash_flow"`
    DiscountedValue   float64 `json:"discounted_value"`
    CumulativeNPV     float64 `json:"cumulative_npv"`
}
```

### 7.2 Constants

```go
const (
    // Default Financial Parameters
    DefaultDiscountRate      = 0.08   // 8% WACC
    DefaultEscalationRate    = 0.03   // 3% annual growth
    DefaultTaxRate           = 0.25   // 25% corporate tax
    DefaultDepreciationYears = 7      // MACRS 7-year
    DefaultProjectYears      = 10     // 10-year horizon
    
    // IRR Calculation Parameters
    IRRMaxIterations        = 100
    IRRTolerance            = 1e-6
    IRRInitialGuess         = 0.10    // 10%
    IRRMinBound             = -0.99   // -99%
    IRRMaxBound             = 10.0    // 1000%
    
    // Edge Case Handling
    MinCapex                = 10000.0
    MinAnnualSavings        = 5000.0
    MaxPaybackYears         = 999.0
    
    // Investment Grading Thresholds
    GradeA_IRR              = 0.15    // 15%
    GradeA_Payback          = 5.0
    GradeB_IRR              = 0.12    // 12%
    GradeB_Payback          = 7.0
    GradeC_IRR              = 0.08    // 8%
    GradeC_Payback          = 10.0
)
```

### 7.3 Core Functions

```go
// CalculateNPV computes net present value of cash flows
func CalculateNPV(cashFlows []float64, discountRate float64) float64 {
    npv := 0.0
    for i, cf := range cashFlows {
        npv += cf / math.Pow(1+discountRate, float64(i))
    }
    return npv
}

// CalculateIRR uses Newton-Raphson method to find IRR
func CalculateIRR(cashFlows []float64) (float64, error) {
    if len(cashFlows) < 2 {
        return 0.0, errors.New("insufficient cash flows for IRR calculation")
    }
    
    rate := IRRInitialGuess
    
    for iter := 0; iter < IRRMaxIterations; iter++ {
        npv := 0.0
        npvDerivative := 0.0
        
        for i, cf := range cashFlows {
            power := math.Pow(1+rate, float64(i))
            npv += cf / power
            
            if i > 0 {
                npvDerivative += -float64(i) * cf / math.Pow(1+rate, float64(i+1))
            }
        }
        
        // Check convergence
        if math.Abs(npv) < IRRTolerance {
            return rate, nil
        }
        
        // Check for zero derivative
        if math.Abs(npvDerivative) < IRRTolerance {
            break
        }
        
        // Newton-Raphson update
        rate = rate - npv/npvDerivative
        
        // Clamp to bounds
        rate = math.Max(IRRMinBound, math.Min(IRRMaxBound, rate))
    }
    
    // Fallback calculation if no convergence
    if len(cashFlows) > 1 && cashFlows[0] != 0 {
        rate = -cashFlows[1]/cashFlows[0] - DefaultDiscountRate
    }
    
    return rate, nil
}

// GenerateCashFlows creates annual cash flow schedule with tax effects
func GenerateCashFlows(input FinancialInput) []CashFlow {
    flows := make([]CashFlow, input.ProjectYears+1)
    
    // Year 0: Initial investment
    flows[0] = CashFlow{
        Year:             0,
        AfterTaxCashFlow: -input.TotalCapex,
        DiscountedValue:  -input.TotalCapex,
        CumulativeNPV:    -input.TotalCapex,
    }
    
    annualDepreciation := input.TotalCapex / float64(input.DepreciationYears)
    cumulativeNPV := -input.TotalCapex
    
    for year := 1; year <= input.ProjectYears; year++ {
        // Escalate savings
        escalationFactor := math.Pow(1+input.EscalationRate, float64(year-1))
        grossSavings := input.AnnualSavings * escalationFactor
        
        var depreciation, taxableIncome, taxes, afterTax float64
        
        if year <= input.DepreciationYears {
            depreciation = annualDepreciation
            taxableIncome = grossSavings - depreciation
            taxes = math.Max(0, taxableIncome*input.TaxRate)
            afterTax = grossSavings - taxes
        } else {
            depreciation = 0
            taxableIncome = grossSavings
            taxes = grossSavings * input.TaxRate
            afterTax = grossSavings * (1 - input.TaxRate)
        }
        
        discountFactor := math.Pow(1+input.DiscountRate, float64(year))
        discountedValue := afterTax / discountFactor
        cumulativeNPV += discountedValue
        
        flows[year] = CashFlow{
            Year:             year,
            GrossSavings:     grossSavings,
            Depreciation:     depreciation,
            TaxableIncome:    taxableIncome,
            TaxesPaid:        taxes,
            AfterTaxCashFlow: afterTax,
            DiscountedValue:  discountedValue,
            CumulativeNPV:    cumulativeNPV,
        }
    }
    
    return flows
}

// CalculateFinancialMetrics performs comprehensive financial analysis
func CalculateFinancialMetrics(input FinancialInput) (FinancialMetrics, []CashFlow, error) {
    if err := input.Validate(); err != nil {
        return FinancialMetrics{}, nil, err
    }
    
    // Apply minimum values
    capex := math.Max(input.TotalCapex, MinCapex)
    savings := math.Max(input.AnnualSavings, MinAnnualSavings)
    
    // Generate cash flows
    cashFlows := GenerateCashFlows(input)
    
    // Extract just the after-tax values for NPV/IRR
    cashFlowValues := make([]float64, len(cashFlows))
    totalFutureCashFlows := 0.0
    for i, cf := range cashFlows {
        cashFlowValues[i] = cf.AfterTaxCashFlow
        if i > 0 {
            totalFutureCashFlows += cf.AfterTaxCashFlow
        }
    }
    
    // Calculate NPV
    npv := CalculateNPV(cashFlowValues, input.DiscountRate)
    if math.IsNaN(npv) || math.IsInf(npv, 0) {
        npv = savings*float64(input.ProjectYears) - capex
    }
    
    // Calculate IRR
    irr, err := CalculateIRR(cashFlowValues)
    if err != nil || math.IsNaN(irr) || math.IsInf(irr, 0) || irr < -1 {
        if capex > 0 {
            irr = (savings / capex) - input.DiscountRate
        } else {
            irr = 0
        }
    }
    
    // Calculate simple payback
    payback := MaxPaybackYears
    if savings > 0 {
        payback = capex / savings
        if math.IsNaN(payback) || math.IsInf(payback, 0) {
            payback = MaxPaybackYears
        }
    }
    
    // Calculate ROI
    roi := 0.0
    if capex > 0 {
        roi = (npv / capex) * 100
        if math.IsNaN(roi) || math.IsInf(roi, 0) {
            roi = ((savings*float64(input.ProjectYears) - capex) / capex) * 100
        }
    }
    
    // Determine investment grade
    grade := DetermineInvestmentGrade(npv, irr, payback)
    
    return FinancialMetrics{
        NetPresentValue:      npv,
        InternalRateOfReturn: irr,
        SimplePaybackYears:   payback,
        InvestmentGrade:      grade,
        TotalProjectValue:    totalFutureCashFlows,
        ROIPercent:           roi,
    }, cashFlows, nil
}

// DetermineInvestmentGrade classifies investment quality
func DetermineInvestmentGrade(npv, irr, payback float64) string {
    if npv > 0 && irr > GradeA_IRR && payback < GradeA_Payback {
        return "A - Excellent"
    } else if npv > 0 && irr > GradeB_IRR && payback < GradeB_Payback {
        return "B - Good"
    } else if npv > 0 && irr > GradeC_IRR && payback < GradeC_Payback {
        return "C - Acceptable"
    }
    return "D - Poor"
}
```

---

## 8. Test Cases

### 8.1 NPV Calculation Test

```go
func TestNPV(t *testing.T) {
    // Investment: -$100,000
    // Returns: $30,000/year for 5 years
    // Discount rate: 10%
    cashFlows := []float64{-100000, 30000, 30000, 30000, 30000, 30000}
    
    npv := CalculateNPV(cashFlows, 0.10)
    
    // Expected NPV ≈ $13,723.60
    assert.InDelta(t, 13723.60, npv, 1.0)
}
```

### 8.2 IRR Calculation Test

```go
func TestIRR(t *testing.T) {
    // Investment: -$100,000
    // Returns: $30,000/year for 5 years
    // Expected IRR ≈ 15.24%
    cashFlows := []float64{-100000, 30000, 30000, 30000, 30000, 30000}
    
    irr, err := CalculateIRR(cashFlows)
    
    assert.NoError(t, err)
    assert.InDelta(t, 0.1524, irr, 0.001)
}
```

### 8.3 Investment Grade Test

```go
func TestInvestmentGrade(t *testing.T) {
    tests := []struct {
        name    string
        npv     float64
        irr     float64
        payback float64
        want    string
    }{
        {"Excellent", 500000, 0.20, 3.5, "A - Excellent"},
        {"Good", 300000, 0.13, 6.0, "B - Good"},
        {"Acceptable", 100000, 0.09, 9.0, "C - Acceptable"},
        {"Poor - Negative NPV", -50000, 0.05, 15.0, "D - Poor"},
        {"Poor - Low IRR", 100000, 0.05, 12.0, "D - Poor"},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            grade := DetermineInvestmentGrade(tt.npv, tt.irr, tt.payback)
            assert.Equal(t, tt.want, grade)
        })
    }
}
```

---

## 9. References

- **Python Implementation:** `backend/prediction_engine.py:245-350`
- **Financial Theory:**
  - Ross, Westerfield, Jaffe: "Corporate Finance"
  - Brealey, Myers, Allen: "Principles of Corporate Finance"
- **Tax Code:** IRS Publication 946 (MACRS depreciation)
- **Standards:** International Financial Reporting Standards (IFRS)

---

## 10. Notes for Implementation

1. **Precision:** Use `float64` throughout for financial calculations
2. **Rounding:** Round final results to 2 decimal places for currency
3. **Currency:** Support multi-currency with proper conversion
4. **Audit Trail:** Log all input parameters and intermediate calculations
5. **Performance:** Cache IRR calculations when possible (expensive operation)
6. **Validation:** Strict input validation - financial calculations must be reliable
7. **Error Handling:** Never return NaN or Inf - always provide fallback calculations
