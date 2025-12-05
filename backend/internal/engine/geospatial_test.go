package engine

import (
	"math"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHaversineDistanceKM(t *testing.T) {
	tests := []struct {
		name      string
		lat1      float64
		lon1      float64
		lat2      float64
		lon2      float64
		wantKM    float64
		tolerance float64
	}{
		{
			name:      "San Francisco to Los Angeles",
			lat1:      37.7749,
			lon1:      -122.4194,
			lat2:      34.0522,
			lon2:      -118.2437,
			wantKM:    559.0,
			tolerance: 10.0, // ±10km tolerance
		},
		{
			name:      "New York to London",
			lat1:      40.7128,
			lon1:      -74.0060,
			lat2:      51.5074,
			lon2:      -0.1278,
			wantKM:    5570.0,
			tolerance: 300.0, // Wider tolerance for long distances (different geodesic methods)
		},
		{
			name:      "same location",
			lat1:      37.7749,
			lon1:      -122.4194,
			lat2:      37.7749,
			lon2:      -122.4194,
			wantKM:    0.0,
			tolerance: 0.1,
		},
		{
			name:      "short distance",
			lat1:      37.7749,
			lon1:      -122.4194,
			lat2:      37.7849,
			lon2:      -122.4094,
			wantKM:    1.4,
			tolerance: 0.5,
		},
		{
			name:      "equator crossing",
			lat1:      10.0,
			lon1:      0.0,
			lat2:      -10.0,
			lon2:      0.0,
			wantKM:    2223.0,
			tolerance: 10.0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := HaversineDistanceKM(tt.lat1, tt.lon1, tt.lat2, tt.lon2)

			// Check result is within tolerance
			diff := math.Abs(got - tt.wantKM)
			assert.LessOrEqual(t, diff, tt.tolerance,
				"Distance %.2f km differs from expected %.2f km by %.2f km (tolerance: %.2f km)",
				got, tt.wantKM, diff, tt.tolerance)

			// Sanity checks
			assert.False(t, math.IsNaN(got), "Distance should not be NaN")
			assert.False(t, math.IsInf(got, 0), "Distance should not be Inf")
			assert.GreaterOrEqual(t, got, 0.0, "Distance should be non-negative")
		})
	}
}

func TestHaversineDistanceKM_Symmetry(t *testing.T) {
	// Distance from A to B should equal distance from B to A
	lat1, lon1 := 37.7749, -122.4194
	lat2, lon2 := 34.0522, -118.2437

	distAB := HaversineDistanceKM(lat1, lon1, lat2, lon2)
	distBA := HaversineDistanceKM(lat2, lon2, lat1, lon1)

	assert.InDelta(t, distAB, distBA, 0.01, "Distance should be symmetric")
}

func TestHaversineDistanceKM_Caching(t *testing.T) {
	lat1, lon1 := 37.7749, -122.4194
	lat2, lon2 := 34.0522, -118.2437

	// First call (cache miss)
	dist1 := HaversineDistanceKM(lat1, lon1, lat2, lon2)

	// Second call (cache hit)
	dist2 := HaversineDistanceKM(lat1, lon1, lat2, lon2)

	// Results should be identical
	assert.Equal(t, dist1, dist2, "Cached result should match original")

	// Third call with different coordinates (cache miss)
	dist3 := HaversineDistanceKM(40.7128, -74.0060, 51.5074, -0.1278)

	// Should be different from first result
	assert.NotEqual(t, dist1, dist3, "Different coordinates should yield different distance")
}

func TestHaversineDistanceKM_EdgeCases(t *testing.T) {
	t.Run("north pole to south pole", func(t *testing.T) {
		dist := HaversineDistanceKM(90.0, 0.0, -90.0, 0.0)
		// Should be approximately half Earth's circumference
		expected := 20015.0 // km (half of ~40,030 km)
		assert.InDelta(t, expected, dist, 100.0, "Pole-to-pole distance")
	})

	t.Run("date line crossing", func(t *testing.T) {
		// Points on opposite sides of the date line
		dist := HaversineDistanceKM(0.0, 179.0, 0.0, -179.0)
		// Should be short distance, not around the world
		assert.Less(t, dist, 300.0, "Date line crossing should take shortest path")
	})

	t.Run("extreme precision", func(t *testing.T) {
		// Very close points
		dist := HaversineDistanceKM(37.774900, -122.419400, 37.774901, -122.419401)
		assert.Less(t, dist, 0.01, "Very close points should have tiny distance")
		assert.GreaterOrEqual(t, dist, 0.0, "Distance should be non-negative")
	})
}

func BenchmarkHaversineDistanceKM(b *testing.B) {
	lat1, lon1 := 37.7749, -122.4194
	lat2, lon2 := 34.0522, -118.2437

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = HaversineDistanceKM(lat1, lon1, lat2, lon2)
	}
}

func BenchmarkHaversineDistanceKM_Cached(b *testing.B) {
	lat1, lon1 := 37.7749, -122.4194
	lat2, lon2 := 34.0522, -118.2437

	// Prime the cache
	_ = HaversineDistanceKM(lat1, lon1, lat2, lon2)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = HaversineDistanceKM(lat1, lon1, lat2, lon2)
	}
}
