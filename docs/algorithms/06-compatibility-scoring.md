# Compatibility Scoring Algorithm

## Overview

This document describes the multi-factor weighted scoring algorithm used to match data centers (heat sources) with heat sinks for optimal heat recovery partnerships.

---

## 1. Overall Scoring Formula

### 1.1 Weighted Composite Score

**Formula:**

```
compatibility_score = (score_distance × w_distance) + 
                     (score_capacity × w_capacity) + 
                     (score_temp × w_temp) + 
                     (score_availability × w_availability) + 
                     (score_price × w_price)
```

**Weight Distribution:**

```
w_distance     = 0.50  (50%)
w_capacity     = 0.15  (15%)
w_temp         = 0.10  (10%)
w_availability = 0.15  (15%)
w_price        = 0.10  (10%)
```

**Invariants:**

- `0 ≤ compatibility_score ≤ 1.0`
- `Σweights = 1.0` (weights sum to 100%)
- All individual scores normalized to [0, 1] range

**Source:** `compatibility_scoring.py:67-73`

---

## 2. Individual Scoring Factors

### 2.1 Distance Score (50% weight)

**Formula:**

```
if distance > dmax:
    score_distance = 0
else:
    score_distance = exp(-(distance / 20.0))
```

**Parameters:**

- `distance`: Haversine distance in kilometers
- `dmax = 20 km`: Maximum economical distance

**Behavior:**

```
distance = 0 km   → score = 1.00   (100%)
distance = 5 km   → score = 0.78   (78%)
distance = 10 km  → score = 0.61   (61%)
distance = 15 km  → score = 0.47   (47%)
distance = 20 km  → score = 0.37   (37%)
distance > 20 km  → score = 0.00   (0%)
```

**Mathematical Form:**

- Exponential decay: `f(d) = e^(-d/20)`
- Hard cutoff at 20 km
- Captures diminishing feasibility with distance

**Business Logic:**

- Distance is the most critical factor (50% weight)
- Heat loss and pumping costs increase with distance
- Beyond 20 km considered economically unfeasible
- Exponential decay reflects real-world cost curves

**Source:** `compatibility_scoring.py:61-64`

---

### 2.2 Capacity Score (15% weight)

**Formula:**

```
score_capacity = min(1, source_capacity / sink_capacity)
```

**Parameters:**

- `source_capacity`: Data center heat capacity (Watts)
- `sink_capacity`: Heat sink demand capacity (Watts)

**Behavior:**

```
source/sink = 0.5  → score = 0.5  (under-supply)
source/sink = 1.0  → score = 1.0  (perfect match)
source/sink = 2.0  → score = 1.0  (over-supply, capped)
```

**Invariants:**

- `0 ≤ score_capacity ≤ 1.0`
- Score capped at 1.0 (no bonus for excess capacity)

**Business Logic:**

- Perfect match (ratio = 1.0) scores highest
- Under-supply scored proportionally (0.5 ratio = 0.5 score)
- Over-supply not penalized (score capped at 1.0)
- Ensures source can meet at least some demand

**Source:** `compatibility_scoring.py:57`

---

### 2.3 Temperature Score (10% weight)

**Formula:**

```
score_temp = 1 / (1 + exp((-1/k) × ΔT))

where:
  ΔT = sink_temp - source_temp
  k = 5 (temperature sensitivity parameter)
```

**Sigmoid Function Behavior:**

```
ΔT = -10°C  → score ≈ 0.12  (source much hotter than needed)
ΔT = -5°C   → score ≈ 0.27  (source moderately hotter)
ΔT = 0°C    → score = 0.50  (equal temperatures)
ΔT = +5°C   → score ≈ 0.73  (source cooler, needs heat pump)
ΔT = +10°C  → score ≈ 0.88  (source much cooler)
```

**Mathematical Form:**

- Sigmoid (logistic) function
- Centered at ΔT = 0
- Parameter k controls steepness (k=5 gives gradual transition)

**Physical Interpretation:**

- Positive ΔT: Sink needs higher temperature than source provides
  - Requires heat pump (energy penalty)
  - Higher ΔT = more energy needed
  - Still possible, but less efficient
- Negative ΔT: Source hotter than sink needs
  - Direct use possible
  - Excess heat wasted
  - Good situation

**Business Logic:**

- Slight preference for source cooler than sink (can use heat pump)
- Moderate penalty for source much hotter than needed
- Reflects thermodynamic efficiency considerations

**Source:** `compatibility_scoring.py:55`

---

### 2.4 Availability Score (15% weight)

**Formula:**

```
score_availability = source_availability / hours_in_a_year

where:
  hours_in_a_year = 8760
```

**Parameters:**

- `source_availability`: Annual operating hours of data center

**Behavior:**

```
24/7 operation (8760 hrs) → score = 1.00  (100%)
12/7 operation (4380 hrs) → score = 0.50  (50%)
Business hours (2080 hrs) → score = 0.24  (24%)
```

**Invariants:**

- `0 ≤ score_availability ≤ 1.0`
- `1 ≤ source_availability ≤ 8760`

**Business Logic:**

- Higher uptime = more reliable heat supply
- Continuous operation (24/7) scores highest
- Intermittent operation reduces system economics
- Critical for district heating which needs reliable supply

**Source:** `compatibility_scoring.py:58`

---

### 2.5 Price Score (10% weight)

**Formula:**

```
score_price = 1 / (1 + (source_price - sink_price) / price_scale)

where:
  price_scale = 50 (USD)
```

**Parameters:**

- `source_price`: Data center's asking price for heat (USD/unit)
- `sink_price`: Heat sink's willing-to-pay price (USD/unit)

**Behavior:**

```
Δprice = -$50  → score ≈ 0.67  (sink willing to pay $50 more than asked)
Δprice = $0    → score = 0.50  (prices match exactly)
Δprice = +$50  → score ≈ 0.33  (source asking $50 more than offered)
Δprice = +$100 → score ≈ 0.25  (large price gap)
```

**Mathematical Form:**

- Inverse linear scaling with price_scale denominator
- Centered at Δprice = 0
- Symmetric around center

**Business Logic:**

- Perfect price match = 0.50 score (neutral)
- Sink willing to pay more = higher score (good for source)
- Source asking too much = lower score (economic barrier)
- Price_scale of $50 sets sensitivity of scoring

**Source:** `compatibility_scoring.py:59`

---

## 3. Score Interpretation

### 3.1 Grading Scale

```
0.85 - 1.00:  Excellent match (strongly recommended)
0.70 - 0.85:  Good match (acceptable)
0.40 - 0.70:  Low match (not recommended)
0.00 - 0.40:  Incompatible (avoid)
```

**Source:** `compatibility_scoring.py:86-96`

---

### 3.2 Example Calculation

**Scenario:**

```
Distance:     5 km
Source capacity: 1000 W
Sink capacity:   1200 W
Source temp:   60°C
Sink temp:     65°C (ΔT = +5)
Availability:  8760 hrs (24/7)
Source price:  $10/unit
Sink price:    $12/unit
```

**Individual Scores:**

```
score_distance = exp(-5/20) = 0.78
score_capacity = min(1, 1000/1200) = 0.83
score_temp = 1/(1+exp(-1/5 × 5)) = 0.73
score_availability = 8760/8760 = 1.00
score_price = 1/(1+(10-12)/50) = 0.52
```

**Weighted Score:**

```
score = (0.78 × 0.50) + (0.83 × 0.15) + (0.73 × 0.10) + 
        (1.00 × 0.15) + (0.52 × 0.10)
score = 0.39 + 0.125 + 0.073 + 0.15 + 0.052
score = 0.79  →  "Good match (acceptable)"
```

---

## 4. Implementation Requirements for Go

### 4.1 Data Types

```go
type CompatibilityInput struct {
    // Geospatial
    SourceLat  float64 `validate:"required,gte=-90,lte=90"`
    SourceLon  float64 `validate:"required,gte=-180,lte=180"`
    SinkLat    float64 `validate:"required,gte=-90,lte=90"`
    SinkLon    float64 `validate:"required,gte=-180,lte=180"`
    
    // Capacity
    SourceCapacityW float64 `validate:"required,gt=0"`
    SinkCapacityW   float64 `validate:"required,gt=0"`
    
    // Temperature
    SourceTempC float64 `validate:"required"`
    SinkTempC   float64 `validate:"required"`
    
    // Availability
    SourceAvailabilityHours int `validate:"required,gte=1,lte=8760"`
    
    // Pricing
    SourcePriceUSD float64 `validate:"required"`
    SinkPriceUSD   float64 `validate:"required"`
}

type CompatibilityResult struct {
    OverallScore       float64            `json:"overall_score"`
    Grade              string             `json:"grade"`
    Distance           float64            `json:"distance_km"`
    IndividualScores   IndividualScores   `json:"individual_scores"`
    Recommendation     string             `json:"recommendation"`
}

type IndividualScores struct {
    Distance     float64 `json:"distance"`
    Capacity     float64 `json:"capacity"`
    Temperature  float64 `json:"temperature"`
    Availability float64 `json:"availability"`
    Price        float64 `json:"price"`
}
```

### 4.2 Constants

```go
const (
    // Scoring Weights
    WeightDistance     = 0.50
    WeightCapacity     = 0.15
    WeightTemperature  = 0.10
    WeightAvailability = 0.15
    WeightPrice        = 0.10
    
    // Distance Parameters
    MaxEconomicalDistanceKm = 20.0
    DistanceDecayFactor     = 20.0  // For exponential decay
    
    // Temperature Parameters
    TempSensitivityK = 5.0  // Sigmoid steepness parameter
    
    // Availability Parameters
    HoursPerYear = 8760
    
    // Price Parameters
    PriceScale = 50.0  // USD, controls price sensitivity
    
    // Grading Thresholds
    GradeExcellentMin = 0.85
    GradeGoodMin      = 0.70
    GradeLowMin       = 0.40
)
```

### 4.3 Core Functions

```go
// CalculateDistanceScore computes distance-based compatibility (exponential decay)
func CalculateDistanceScore(distanceKm float64) float64 {
    if distanceKm > MaxEconomicalDistanceKm {
        return 0.0
    }
    return math.Exp(-distanceKm / DistanceDecayFactor)
}

// CalculateCapacityScore computes capacity matching score
func CalculateCapacityScore(sourceCapacity, sinkCapacity float64) float64 {
    ratio := sourceCapacity / sinkCapacity
    return math.Min(1.0, ratio)
}

// CalculateTemperatureScore computes temperature compatibility (sigmoid function)
func CalculateTemperatureScore(sourceTempC, sinkTempC float64) float64 {
    deltaT := sinkTempC - sourceTempC
    return 1.0 / (1.0 + math.Exp((-1.0/TempSensitivityK)*deltaT))
}

// CalculateAvailabilityScore computes uptime-based score
func CalculateAvailabilityScore(availabilityHours int) float64 {
    return float64(availabilityHours) / float64(HoursPerYear)
}

// CalculatePriceScore computes price compatibility score
func CalculatePriceScore(sourcePrice, sinkPrice float64) float64 {
    priceDiff := sourcePrice - sinkPrice
    return 1.0 / (1.0 + priceDiff/PriceScale)
}

// CalculateCompatibilityScore performs full compatibility analysis
func CalculateCompatibilityScore(input CompatibilityInput) (CompatibilityResult, error) {
    if err := input.Validate(); err != nil {
        return CompatibilityResult{}, err
    }
    
    // Calculate distance
    from := Coordinate{Latitude: input.SourceLat, Longitude: input.SourceLon}
    to := Coordinate{Latitude: input.SinkLat, Longitude: input.SinkLon}
    distance, err := HaversineDistance(from, to)
    if err != nil {
        return CompatibilityResult{}, fmt.Errorf("distance calculation failed: %w", err)
    }
    
    // Calculate individual scores
    scores := IndividualScores{
        Distance:     CalculateDistanceScore(distance),
        Capacity:     CalculateCapacityScore(input.SourceCapacityW, input.SinkCapacityW),
        Temperature:  CalculateTemperatureScore(input.SourceTempC, input.SinkTempC),
        Availability: CalculateAvailabilityScore(input.SourceAvailabilityHours),
        Price:        CalculatePriceScore(input.SourcePriceUSD, input.SinkPriceUSD),
    }
    
    // Calculate weighted overall score
    overallScore := (scores.Distance * WeightDistance) +
                    (scores.Capacity * WeightCapacity) +
                    (scores.Temperature * WeightTemperature) +
                    (scores.Availability * WeightAvailability) +
                    (scores.Price * WeightPrice)
    
    // Determine grade and recommendation
    grade := DetermineGrade(overallScore)
    recommendation := GenerateRecommendation(overallScore, scores)
    
    return CompatibilityResult{
        OverallScore:     overallScore,
        Grade:            grade,
        Distance:         distance,
        IndividualScores: scores,
        Recommendation:   recommendation,
    }, nil
}

// DetermineGrade assigns letter grade based on overall score
func DetermineGrade(score float64) string {
    if score >= GradeExcellentMin {
        return "A - Excellent"
    } else if score >= GradeGoodMin {
        return "B - Good"
    } else if score >= GradeLowMin {
        return "C - Low"
    }
    return "D - Incompatible"
}

// GenerateRecommendation provides detailed recommendation
func GenerateRecommendation(score float64, individual IndividualScores) string {
    if score >= GradeExcellentMin {
        return "This match is strongly recommended. All factors align well for a successful heat recovery partnership."
    } else if score >= GradeGoodMin {
        return "This match is acceptable. Proceed with detailed feasibility study."
    } else if score >= GradeLowMin {
        // Identify weakest factor
        weakest := "distance"
        weakestScore := individual.Distance
        
        if individual.Capacity < weakestScore {
            weakest = "capacity mismatch"
            weakestScore = individual.Capacity
        }
        if individual.Temperature < weakestScore {
            weakest = "temperature incompatibility"
            weakestScore = individual.Temperature
        }
        if individual.Availability < weakestScore {
            weakest = "low availability"
            weakestScore = individual.Availability
        }
        if individual.Price < weakestScore {
            weakest = "price disagreement"
        }
        
        return fmt.Sprintf("This match is not recommended. Primary concern: %s. Consider addressing this factor.", weakest)
    }
    return "This match is incompatible. Fundamental barriers exist that make heat recovery economically unfeasible."
}
```

---

## 5. Test Cases

```go
func TestCompatibilityScore_ExcellentMatch(t *testing.T) {
    input := CompatibilityInput{
        SourceLat: 37.7749, SourceLon: -122.4194,
        SinkLat:   37.7850, SinkLon:   -122.4100,  // ~2km away
        SourceCapacityW: 1000000,  // 1 MW
        SinkCapacityW:   900000,   // 0.9 MW (good match)
        SourceTempC: 60,
        SinkTempC:   65,  // +5°C (acceptable)
        SourceAvailabilityHours: 8760,  // 24/7
        SourcePriceUSD: 10,
        SinkPriceUSD:   12,  // Sink willing to pay more
    }
    
    result, err := CalculateCompatibilityScore(input)
    
    assert.NoError(t, err)
    assert.Greater(t, result.OverallScore, 0.85)
    assert.Equal(t, "A - Excellent", result.Grade)
}

func TestCompatibilityScore_TooFarDistance(t *testing.T) {
    input := CompatibilityInput{
        SourceLat: 37.7749, SourceLon: -122.4194,
        SinkLat:   37.9749, SinkLon:   -122.0194,  // >20km away
        SourceCapacityW: 1000000,
        SinkCapacityW:   1000000,
        SourceTempC: 60,
        SinkTempC:   60,
        SourceAvailabilityHours: 8760,
        SourcePriceUSD: 10,
        SinkPriceUSD:   10,
    }
    
    result, err := CalculateCompatibilityScore(input)
    
    assert.NoError(t, err)
    assert.Less(t, result.OverallScore, 0.50)  // Distance score = 0 dominates
    assert.Equal(t, "D - Incompatible", result.Grade)
}
```

---

## 6. References

- **Python Implementation:** `compatibility_scoring.py:1-99`
- **Research Basis:**
  - District heating feasibility studies
  - Thermodynamic efficiency principles
  - Economic viability analysis

---

## 7. Notes for Implementation

1. **Weight Tuning:** Weights may need adjustment based on real-world data
2. **Regional Variation:** Distance thresholds may vary by region (urban vs rural)
3. **Dynamic Pricing:** Price scoring should support dynamic market prices
4. **Multi-Criteria Decision Analysis:** This is a form of MCDA (Multi-Criteria Decision Analysis)
5. **Sensitivity:** Small weight changes significantly impact ranking
6. **Validation:** All inputs must be validated before scoring
7. **Extensibility:** Design should allow adding new factors (e.g., regulatory, environmental)
