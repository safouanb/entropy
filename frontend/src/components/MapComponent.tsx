import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { api } from '../services/api';
import type { HeatCenter, DemandSite, DataCenter } from '../services/api';
import type { MapMarker } from '../types';

interface LegacyDataCenter {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  provider: string;
  capacity: string;
  established: string;
  website?: string;
  address?: string;
}

interface MapComponentProps {
  searchQuery?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ searchQuery }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [selectedDataCenter, setSelectedDataCenter] = useState<LegacyDataCenter | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [heatCenters, setHeatCenters] = useState<HeatCenter[]>([]);
  const [demandSites, setDemandSites] = useState<DemandSite[]>([]);
  const [dataCenters, setDataCenters] = useState<DataCenter[]>([]);
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
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        if (!mapContainer.current) return;

        map.current = new google.maps.Map(mapContainer.current, {
          center: SF_CENTER,
          zoom: 12,
          mapTypeId: is3D ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP,
          tilt: is3D ? 45 : 0,
          heading: is3D ? -17.6 : 0,
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
          streetViewControl: true,
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
  }, [is3D, mapLoaded]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dataCentersResponse, heatCentersResponse, demandSitesResponse] = await Promise.all([
          api.dataCenters.getAll(),
          fetch('/api/heat-centers').catch(() => ({ json: () => [] })),
          fetch('/api/demand-sites').catch(() => ({ json: () => [] }))
        ]);

        setDataCenters(dataCentersResponse);
        
        // Mock data for heat centers and demand sites if API doesn't exist
        setHeatCenters([
          {
            id: 1,
            name: 'Mission Bay Heat Center',
            latitude: 37.7706,
            longitude: -122.3892,
            capacity: '50MW',
            type: 'geothermal',
            status: 'active'
          },
          {
            id: 2,
            name: 'SOMA District Heat',
            latitude: 37.7749,
            longitude: -122.4194,
            capacity: '75MW',
            type: 'waste_heat',
            status: 'active'
          }
        ]);

        setDemandSites([
          {
            id: 1,
            name: 'Financial District',
            latitude: 37.7946,
            longitude: -122.4014,
            demand: '25MW',
            type: 'commercial',
            status: 'connected'
          },
          {
            id: 2,
            name: 'Union Square',
            latitude: 37.7880,
            longitude: -122.4074,
            demand: '15MW',
            type: 'mixed',
            status: 'potential'
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

    // Create data center markers
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
        const legacyDataCenter: LegacyDataCenter = {
          id: dataCenter.id,
          name: dataCenter.name,
          description: `IT Load: ${dataCenter.total_it_load_kw}kW, PUE: ${dataCenter.pue}`,
          latitude: dataCenter.location_lat,
          longitude: dataCenter.location_lng,
          provider: 'Enterprise',
          capacity: `${dataCenter.total_it_load_kw}kW`,
          established: new Date(dataCenter.created_at || '2024-01-01').getFullYear().toString(),
          address: dataCenter.address || `${dataCenter.location_lat.toFixed(4)}, ${dataCenter.location_lng.toFixed(4)}`
        };
        
        setSelectedDataCenter(legacyDataCenter);
        
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

    // Create heat center markers
    heatCenters.forEach(heatCenter => {
      const marker = new google.maps.Marker({
        position: { lat: heatCenter.latitude, lng: heatCenter.longitude },
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
                <strong>Type:</strong> ${heatCenter.type}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Capacity:</strong> ${heatCenter.capacity}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Status:</strong> ${heatCenter.status}
              </p>
            </div>
          `
        });
        
        infoWindowRef.current.open(map.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Create demand site markers
    demandSites.forEach(demandSite => {
      const marker = new google.maps.Marker({
        position: { lat: demandSite.latitude, lng: demandSite.longitude },
        map: map.current,
        title: demandSite.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10B981',
          fillOpacity: 0.8,
          strokeColor: '#059669',
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
                ${demandSite.name}
              </h3>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Type:</strong> ${demandSite.type}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Demand:</strong> ${demandSite.demand}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Status:</strong> ${demandSite.status}
              </p>
            </div>
          `
        });
        
        infoWindowRef.current.open(map.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, dataCenters, heatCenters, demandSites]);

  // Handle search functionality
  useEffect(() => {
    if (!searchQuery || !map.current || !mapLoaded) return;

    const searchService = new google.maps.places.PlacesService(map.current);
    
    const request = {
      query: searchQuery,
      bounds: SF_BOUNDS,
      fields: ['name', 'geometry', 'formatted_address']
    };

    searchService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        if (place.geometry && place.geometry.location) {
          map.current?.setCenter(place.geometry.location);
          map.current?.setZoom(15);
        }
      }
    });
  }, [searchQuery, mapLoaded]);

  const toggle3D = useCallback(() => {
    if (!map.current) return;
    
    const new3D = !is3D;
    setIs3D(new3D);
    
    if (new3D) {
      map.current.setMapTypeId(google.maps.MapTypeId.SATELLITE);
      map.current.setTilt(45);
      map.current.setHeading(-17.6);
    } else {
      map.current.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.current.setTilt(0);
      map.current.setHeading(0);
    }
  }, [is3D]);

  const resetView = useCallback(() => {
    if (!map.current) return;
    
    map.current.setCenter(SF_CENTER);
    map.current.setZoom(12);
    
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    setSelectedDataCenter(null);
  }, []);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="h-full w-full" />
      
      {mapLoaded && (
        <>
          <MapControls
            is3D={is3D}
            onToggle3D={toggle3D}
            onResetView={resetView}
            selectedMarker={selectedMarker}
          />
          
          {selectedDataCenter && (
            <DataCenterPopup
              dataCenter={selectedDataCenter}
              onClose={() => setSelectedDataCenter(null)}
            />
          )}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
            <h4 className="font-semibold text-gray-900 mb-3">Map Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">Data Centers ({dataCenters.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-700">Heat Centers ({heatCenters.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Demand Sites ({demandSites.length})</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapComponent;