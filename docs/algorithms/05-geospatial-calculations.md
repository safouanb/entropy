# Geospatial Distance Calculations

## Overview

This document describes the geospatial algorithms used to calculate distances between data centers and heat sinks, accounting for Earth's curvature using the Haversine formula.

---

## 1. Haversine Distance Formula

### 1.1 Mathematical Foundation

The Haversine formula calculates the great-circle distance between two points on a sphere given their longitudes and latitudes.

**Formula:**

```
a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c

where:
  φ₁, φ₂ = latitude of point 1 and point 2 (in radians)
  λ₁, λ₂ = longitude of point 1 and point 2 (in radians)
  Δφ = φ₂ − φ₁
  Δλ = λ₂ − λ₁
  R = Earth's radius (mean radius = 6,371 km)
  d = distance between points (in kilometers)
```

**Source:** `prediction_engine.py:114-119`, `compatibility_scoring.py:21-30`

---

### 1.2 Python Implementation (Backend)

```python
def calculate_distance_to_heat_sink(self,
                                  dc_lat: float, dc_lng: float,
                                  sink_lat: float, sink_lng: float) -> float:
    distance = geodesic((dc_lat, dc_lng), (sink_lat, sink_lng)).kilometers
    return round(distance, 2)
```

**Note:** Backend uses geopy's geodesic function, which uses the more accurate WGS-84 ellipsoid model rather than pure Haversine.

**Source:** `prediction_engine.py:114-119`

---

### 1.3 Python Implementation (Compatibility Scoring)

```python
def haversine_km(lat1, lon1, lat2, lon2):
    """Return the distance between two points in km factoring in earth curvature."""
    # convert degrees -> radians
    psi1, psi2 = math.radians(lat1), math.radians(lat2)
    delta_psi = math.radians(lat2 - lat1)
    del_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_psi/2)**2 + math.cos(psi1) * math.cos(psi2) * math.sin(del_lambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    R = 6371.0  # Earth's mean radius in km
    
    return R * c
```

**Source:** `compatibility_scoring.py:21-30`

---

## 2. Geodesic vs Haversine

### 2.1 Differences

**Haversine (Spherical Earth):**

- Assumes Earth is a perfect sphere
- Simpler calculation
- Accuracy: ±0.5% for most distances
- Fast computation

**Geodesic (Ellipsoid Earth):**

- Uses WGS-84 ellipsoid model
- Earth is slightly flattened at poles
- Accuracy: ±0.01% for most distances
- More complex calculation
- Used by GPS systems

**Source:** Referenced in geopy documentation

---

### 2.2 When to Use Each

**Use Haversine:**

- Quick estimates
- Educational purposes
- When sub-kilometer accuracy not needed
- Performance-critical applications

**Use Geodesic:**

- High-accuracy requirements
- Long distances (>1000 km)
- Official measurements
- Integration with GPS/GIS systems

---

## 3. Earth's Radius Constants

### 3.1 Radius Values

```
Mean Radius (volumetric):     6,371.0 km
Equatorial Radius (semi-major): 6,378.137 km
Polar Radius (semi-minor):    6,356.752 km
Authalic Radius (surface):    6,371.007 km
```

**Current Implementation:**

- Backend (geopy): Uses WGS-84 ellipsoid (6,378.137 km equatorial)
- Compatibility scoring: Uses 6,371.0 km mean radius

**Source:**

- `compatibility_scoring.py:29`
- `compatibility_scoring.py:7` (radius_earth constant)

---

## 4. Coordinate Validation

### 4.1 Valid Ranges

**Latitude:**

```
-90° ≤ latitude ≤ +90°
-90°: South Pole
  0°: Equator
+90°: North Pole
```

**Longitude:**

```
-180° ≤ longitude ≤ +180°
-180°: International Date Line (west)
   0°: Prime Meridian (Greenwich)
+180°: International Date Line (east)
```

### 4.2 Invariants

- Latitude and longitude must be in decimal degrees
- Coordinate pairs must be valid Earth surface points
- Distance between same point must equal zero
- Distance function must be symmetric: d(A,B) = d(B,A)

---

## 5. Implementation Requirements for Go

### 5.1 Data Types

```go
type Coordinate struct {
    Latitude  float64 `json:"latitude" validate:"required,gte=-90,lte=90"`
    Longitude float64 `json:"longitude" validate:"required,gte=-180,lte=180"`
}

type DistanceResult struct {
    DistanceKM      float64     `json:"distance_km"`
    DistanceMiles   float64     `json:"distance_miles"`
    From            Coordinate  `json:"from"`
    To              Coordinate  `json:"to"`
    CalculationMethod string    `json:"calculation_method"` // "haversine" or "geodesic"
}
```

### 5.2 Constants

```go
const (
    // Earth Radii
    EarthRadiusMeanKm       = 6371.0      // Mean radius for Haversine
    EarthRadiusEquatorialKm = 6378.137    // WGS-84 semi-major axis
    EarthRadiusPolarKm      = 6356.752    // WGS-84 semi-minor axis
    
    // Conversions
    DegreesToRadians = math.Pi / 180.0
    RadiansToDegrees = 180.0 / math.Pi
    KmToMiles        = 0.621371
    MilesToKm        = 1.60934
    
    // Validation
    MinLatitude  = -90.0
    MaxLatitude  = 90.0
    MinLongitude = -180.0
    MaxLongitude = 180.0
)
```

### 5.3 Core Functions

```go
// HaversineDistance calculates great-circle distance using Haversine formula
func HaversineDistance(from, to Coordinate) (float64, error) {
    if err := from.Validate(); err != nil {
        return 0, fmt.Errorf("invalid 'from' coordinate: %w", err)
    }
    if err := to.Validate(); err != nil {
        return 0, fmt.Errorf("invalid 'to' coordinate: %w", err)
    }
    
    // Convert to radians
    lat1 := from.Latitude * DegreesToRadians
    lat2 := to.Latitude * DegreesToRadians
    deltaLat := (to.Latitude - from.Latitude) * DegreesToRadians
    deltaLon := (to.Longitude - from.Longitude) * DegreesToRadians
    
    // Haversine formula
    a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
         math.Cos(lat1)*math.Cos(lat2)*
         math.Sin(deltaLon/2)*math.Sin(deltaLon/2)
    
    c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
    
    distance := EarthRadiusMeanKm * c
    
    return distance, nil
}

// Validate checks if coordinates are within valid ranges
func (c Coordinate) Validate() error {
    if c.Latitude < MinLatitude || c.Latitude > MaxLatitude {
        return fmt.Errorf("latitude %.6f out of range [%.1f, %.1f]", 
                         c.Latitude, MinLatitude, MaxLatitude)
    }
    if c.Longitude < MinLongitude || c.Longitude > MaxLongitude {
        return fmt.Errorf("longitude %.6f out of range [%.1f, %.1f]", 
                         c.Longitude, MinLongitude, MaxLongitude)
    }
    return nil
}

// CalculateDistance computes distance with multiple options
func CalculateDistance(from, to Coordinate, method string) (DistanceResult, error) {
    var distanceKm float64
    var err error
    
    switch method {
    case "haversine":
        distanceKm, err = HaversineDistance(from, to)
    case "geodesic":
        // Use external library like github.com/golang/geo for geodesic
        distanceKm, err = GeodesicDistance(from, to)
    default:
        return DistanceResult{}, fmt.Errorf("unknown calculation method: %s", method)
    }
    
    if err != nil {
        return DistanceResult{}, err
    }
    
    return DistanceResult{
        DistanceKM:        math.Round(distanceKm*100) / 100, // Round to 2 decimals
        DistanceMiles:     math.Round(distanceKm*KmToMiles*100) / 100,
        From:              from,
        To:                to,
        CalculationMethod: method,
    }, nil
}

// GeodesicDistance uses WGS-84 ellipsoid (more accurate)
// Implementation would use github.com/golang/geo or similar library
func GeodesicDistance(from, to Coordinate) (float64, error) {
    // This is a placeholder - actual implementation would use
    // a proper geodesic library like:
    // import "github.com/golang/geo/s2"
    // or implement Vincenty's formulae
    
    // For now, fallback to Haversine with warning
    log.Warn("Geodesic calculation not implemented, using Haversine")
    return HaversineDistance(from, to)
}
```

---

## 6. Practical Distance Ranges

### 6.1 District Heating Context

**Economical Ranges:**

```
< 5 km:   Highly economical, minimal losses
5-10 km:  Economical, standard district heating
10-20 km: Marginal, requires economic justification
> 20 km:  Generally uneconomical (see compatibility scoring)
```

**Source:** `compatibility_scoring.py:8` (dmax = 20 km)

---

### 6.2 Urban Distances (San Francisco Examples)

```
Market St to Embarcadero:     ~2.5 km
Mission to Presidio:          ~8 km
SF to Oakland:                ~13 km
SF to San Jose:               ~75 km
```

---

## 7. Test Cases

### 7.1 Known Distance Tests

```go
func TestHaversineDistance_KnownValues(t *testing.T) {
    tests := []struct {
        name     string
        from     Coordinate
        to       Coordinate
        expected float64
        delta    float64
    }{
        {
            name: "San Francisco City Hall to Transamerica Pyramid",
            from: Coordinate{Latitude: 37.7794, Longitude: -122.4192},
            to:   Coordinate{Latitude: 37.7952, Longitude: -122.4028},
            expected: 2.07, // ~2.07 km
            delta: 0.1,
        },
        {
            name: "New York to London",
            from: Coordinate{Latitude: 40.7128, Longitude: -74.0060},
            to:   Coordinate{Latitude: 51.5074, Longitude: -0.1278},
            expected: 5570, // ~5,570 km
            delta: 10,
        },
        {
            name: "Equator crossing",
            from: Coordinate{Latitude: -5, Longitude: 0},
            to:   Coordinate{Latitude: 5, Longitude: 0},
            expected: 1111, // ~1,111 km (10 degrees latitude)
            delta: 5,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            distance, err := HaversineDistance(tt.from, tt.to)
            assert.NoError(t, err)
            assert.InDelta(t, tt.expected, distance, tt.delta)
        })
    }
}
```

### 7.2 Symmetry Test

```go
func TestHaversineDistance_Symmetry(t *testing.T) {
    from := Coordinate{Latitude: 37.7749, Longitude: -122.4194}
    to := Coordinate{Latitude: 37.8044, Longitude: -122.2712}
    
    d1, err1 := HaversineDistance(from, to)
    d2, err2 := HaversineDistance(to, from)
    
    assert.NoError(t, err1)
    assert.NoError(t, err2)
    assert.Equal(t, d1, d2, "Distance should be symmetric")
}
```

### 7.3 Same Point Test

```go
func TestHaversineDistance_SamePoint(t *testing.T) {
    point := Coordinate{Latitude: 37.7749, Longitude: -122.4194}
    
    distance, err := HaversineDistance(point, point)
    
    assert.NoError(t, err)
    assert.InDelta(t, 0.0, distance, 0.001, "Distance to same point should be zero")
}
```

### 7.4 Validation Tests

```go
func TestCoordinate_Validation(t *testing.T) {
    tests := []struct {
        name    string
        coord   Coordinate
        wantErr bool
    }{
        {"Valid SF", Coordinate{37.7749, -122.4194}, false},
        {"North Pole", Coordinate{90, 0}, false},
        {"South Pole", Coordinate{-90, 0}, false},
        {"Date Line East", Coordinate{0, 180}, false},
        {"Date Line West", Coordinate{0, -180}, false},
        {"Invalid Latitude High", Coordinate{91, 0}, true},
        {"Invalid Latitude Low", Coordinate{-91, 0}, true},
        {"Invalid Longitude High", Coordinate{0, 181}, true},
        {"Invalid Longitude Low", Coordinate{0, -181}, true},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := tt.coord.Validate()
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

## 8. Performance Considerations

### 8.1 Optimization Strategies

**Caching:**

```go
// Cache frequently calculated distances
type DistanceCache struct {
    cache map[string]float64
    mutex sync.RWMutex
}

func (dc *DistanceCache) Get(from, to Coordinate) (float64, bool) {
    key := fmt.Sprintf("%.6f,%.6f-%.6f,%.6f", 
                      from.Latitude, from.Longitude,
                      to.Latitude, to.Longitude)
    
    dc.mutex.RLock()
    defer dc.mutex.RUnlock()
    
    distance, ok := dc.cache[key]
    return distance, ok
}
```

**Approximate Distance (Fast):**

```go
// For quick filtering, use simple approximation
func ApproximateDistanceKm(from, to Coordinate) float64 {
    // Simple Euclidean approximation (valid for short distances)
    lat1 := from.Latitude * DegreesToRadians
    lat2 := to.Latitude * DegreesToRadians
    lon1 := from.Longitude * DegreesToRadians
    lon2 := to.Longitude * DegreesToRadians
    
    x := (lon2 - lon1) * math.Cos((lat1+lat2)/2)
    y := lat2 - lat1
    
    return math.Sqrt(x*x + y*y) * EarthRadiusMeanKm
}
```

---

## 9. References

- **Python Implementation:**
  - `backend/prediction_engine.py:114-119`
  - `compatibility_scoring.py:21-30`
- **Mathematical Foundation:**
  - R.W. Sinnott, "Virtues of the Haversine", Sky and Telescope, 1984
  - Vincenty, T. "Direct and Inverse Solutions of Geodesics on the Ellipsoid"
- **Libraries:**
  - Python: geopy (<https://github.com/geopy/geopy>)
  - Go: github.com/golang/geo
  - Go: github.com/kellydunn/golang-geo
- **Standards:**
  - WGS-84 (World Geodetic System 1984)
  - EPSG:4326 (Geographic coordinate system)

---

## 10. Notes for Implementation

1. **Precision:** Use float64 for all coordinate calculations
2. **Rounding:** Round final distances to 2 decimal places (10-meter precision)
3. **Units:** Always work in kilometers internally, provide mile conversion if needed
4. **Validation:** Strict coordinate validation before any calculation
5. **Edge Cases:** Handle poles and date line crossing properly
6. **Library Choice:** Consider using established geodesic library for production
7. **Performance:** Cache results for frequently queried coordinate pairs
8. **Accuracy Trade-off:** Haversine sufficient for <1000km; use geodesic for long distances or high-precision needs
