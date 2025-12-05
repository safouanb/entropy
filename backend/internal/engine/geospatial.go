package engine

import (
	"fmt"
	"sync"

	"github.com/paulmach/orb"
	"github.com/paulmach/orb/geo"
)

// distanceCache provides a simple in-memory cache for distance calculations.
type distanceCache struct {
	mu    sync.RWMutex
	cache map[string]float64
}

var globalDistanceCache = &distanceCache{
	cache: make(map[string]float64),
}

func (dc *distanceCache) get(key string) (float64, bool) {
	dc.mu.RLock()
	defer dc.mu.RUnlock()
	val, ok := dc.cache[key]
	return val, ok
}

func (dc *distanceCache) set(key string, val float64) {
	dc.mu.Lock()
	defer dc.mu.Unlock()
	// Simple size limit to prevent unbounded growth
	if len(dc.cache) > 10000 {
		// Clear half the cache (naive eviction)
		count := 0
		for k := range dc.cache {
			delete(dc.cache, k)
			count++
			if count >= 5000 {
				break
			}
		}
	}
	dc.cache[key] = val
}

// HaversineDistanceKM computes the great-circle distance between two points in km using orb/geo.
// Results are cached for repeated lookups.
func HaversineDistanceKM(lat1, lon1, lat2, lon2 float64) float64 {
	// Create cache key (order-independent for bidirectional lookups)
	key := fmt.Sprintf("%.6f,%.6f-%.6f,%.6f", lat1, lon1, lat2, lon2)

	if dist, ok := globalDistanceCache.get(key); ok {
		return dist
	}

	p1 := orb.Point{lon1, lat1}
	p2 := orb.Point{lon2, lat2}

	// geo.Distance returns meters
	distMeters := geo.Distance(p1, p2)
	distKM := distMeters / 1000.0

	globalDistanceCache.set(key, distKM)

	return distKM
}
