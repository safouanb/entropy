import React, { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import type { HeatCenter, DemandSite, DataCenter } from '../services/api';

interface SimpleMapComponentProps {
  height?: string;
  width?: string;
  className?: string;
}

/**
 * Simple map component that can be embedded anywhere to show data centers and heat centers
 */
const SimpleMapComponent: React.FC<SimpleMapComponentProps> = ({ 
  height = '400px', 
  width = '100%',
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [dataCenters, setDataCenters] = useState<DataCenter[]>([]);
  const [heatCenters, setHeatCenters] = useState<HeatCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const SF_CENTER = { lat: 37.7749, lng: -122.4194 };
  const SF_BOUNDS = {
    north: 37.85,
    south: 37.7,
    east: -121.9,
    west: -122.55
  };

  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainer.current || mapLoaded) return;

    const initMap = async () => {
      try {
        // Load Google Maps script dynamically
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places,geometry`;
          script.async = true;
          script.defer = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google Maps'));
            document.head.appendChild(script);
          });
        }

        if (!mapContainer.current) return;

        map.current = new google.maps.Map(mapContainer.current, {
          center: SF_CENTER,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          restriction: {
            latLngBounds: SF_BOUNDS,
            strictBounds: false
          },
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true
        });

        setMapLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Failed to load Google Maps');
        setIsLoading(false);
      }
    };

    initMap();
  }, [mapLoaded]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const dataCentersResponse = await api.dataCenters.getAll();
        setDataCenters(dataCentersResponse);
        
        // Mock heat centers data (since API might not exist)
        setHeatCenters([
          {
            id: 1,
            name: 'Mission Bay Heat Center',
            location_lat: 37.7706,
            location_lng: -122.3892,
            max_capacity_mw: 50,
            fuel_type: 'geothermal',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'SOMA District Heat',
            location_lat: 37.7749,
            location_lng: -122.4194,
            max_capacity_mw: 75,
            fuel_type: 'waste_heat',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 3,
            name: 'Financial District Heat Hub',
            location_lat: 37.7946,
            location_lng: -122.4014,
            max_capacity_mw: 40,
            fuel_type: 'combined_heat_power',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
          }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load map data');
      }
    };

    loadData();
  }, []);

  // Create markers when map is loaded and data is available
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create data center markers (blue)
    dataCenters.forEach(dataCenter => {
      const marker = new google.maps.Marker({
        position: { lat: dataCenter.location_lat, lng: dataCenter.location_lng },
        map: map.current,
        title: dataCenter.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3B82F6',
          fillOpacity: 0.8,
          strokeColor: '#1E40AF',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        
        infoWindowRef.current = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                ${dataCenter.name}
              </h3>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Type:</strong> Data Center
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>IT Load:</strong> ${dataCenter.total_it_load_kw}kW
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>PUE:</strong> ${dataCenter.pue}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Created:</strong> ${new Date(dataCenter.created_at || '2024-01-01').toLocaleDateString()}
              </p>
            </div>
          `
        });
        
        infoWindowRef.current.open(map.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Create heat center markers (red)
    heatCenters.forEach(heatCenter => {
      const marker = new google.maps.Marker({
        position: { lat: heatCenter.location_lat, lng: heatCenter.location_lng },
        map: map.current,
        title: heatCenter.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#EF4444',
          fillOpacity: 0.8,
          strokeColor: '#DC2626',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        
        infoWindowRef.current = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                ${heatCenter.name}
              </h3>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Type:</strong> Heat Center
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Fuel Type:</strong> ${heatCenter.fuel_type || 'N/A'}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Capacity:</strong> ${heatCenter.max_capacity_mw}MW
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Status:</strong> ${heatCenter.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          `
        });
        
        infoWindowRef.current.open(map.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, dataCenters, heatCenters]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height, width }}
      >
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height, width }}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="h-full w-full" />
      
      {mapLoaded && (
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-700">Data Centers ({dataCenters.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-700">Heat Centers ({heatCenters.length})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMapComponent;