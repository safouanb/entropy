import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Server, Zap, Building2 } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import DataCenterPopup from './DataCenterPopup';
import MapControls from './MapControls';
import { api } from '@/services/api';
import type { HeatCenter, DemandSite, MapMarker } from '@/types';
import type { DataCenter as ApiDataCenter } from '@/services/api';

/**
 * Legacy interface maintained for backward compatibility with existing popup components
 */
interface DataCenter {
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

interface GoogleMapComponentProps {
  searchQuery?: string;
}

/**
 * Google Maps component that renders an interactive map of San Francisco
 * showing heat centers and demand sites with custom markers
 */
const GoogleMapComponent = ({ searchQuery }: GoogleMapComponentProps) => {
  // Map instance and container references
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  // Component state management
  const [selectedDataCenter, setSelectedDataCenter] = useState<DataCenter | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [heatCenters, setHeatCenters] = useState<HeatCenter[]>([]);
  const [demandSites, setDemandSites] = useState<DemandSite[]>([]);
  const [dataCenters, setDataCenters] = useState<DataCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Google Maps API Key from environment variables
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBV_0bshCoVQCWNa5GkHkIaRb4MvHQY3EI';

  // San Francisco coordinates and bounds
  const SF_CENTER = { lat: 37.7749, lng: -122.4194 };
  const SF_BOUNDS = {
    north: 37.85,
    south: 37.7,
    east: -121.9,
    west: -122.55,
  };

  /**
   * Initialize Google Maps when component mounts
   */
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Google Maps API options
    setOptions({
      key: GOOGLE_MAPS_API_KEY,
      v: 'weekly'
    });

    // Load the maps library and initialize the map
    importLibrary('maps').then(() => {
      if (!mapContainer.current) return;

      // Initialize Google Map
      map.current = new google.maps.Map(mapContainer.current, {
        center: SF_CENTER,
        zoom: 13,
        mapTypeId: is3D ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP,
        restriction: {
          latLngBounds: SF_BOUNDS,
          strictBounds: false,
        },
        maxZoom: 18,
        minZoom: 10,
        styles: [
          // Hide all POI (Points of Interest) completely
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          },
          // Hide all transit information
          {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }]
          },
          // Hide all business listings and establishments
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          // Hide restaurants, cafes, etc.
          {
            featureType: 'poi.attraction',
            stylers: [{ visibility: 'off' }]
          },
          // Hide parks and recreational areas
          {
            featureType: 'poi.park',
            stylers: [{ visibility: 'off' }]
          },
          // Hide schools and institutions
          {
            featureType: 'poi.school',
            stylers: [{ visibility: 'off' }]
          },
          // Hide medical facilities
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'off' }]
          },
          // Hide government buildings
          {
            featureType: 'poi.government',
            stylers: [{ visibility: 'off' }]
          },
          // Hide places of worship
          {
            featureType: 'poi.place_of_worship',
            stylers: [{ visibility: 'off' }]
          },
          // Hide sports complexes
          {
            featureType: 'poi.sports_complex',
            stylers: [{ visibility: 'off' }]
          },
          // Simplify administrative labels
          {
            featureType: 'administrative',
            elementType: 'labels.text',
            stylers: [{ visibility: 'simplified' }]
          },
          // Simplify road labels
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'simplified' }]
          }
        ],
        // Completely disable all controls and branding
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        streetViewControl: false,
        fullscreenControl: false,
        scaleControl: false,
        rotateControl: false,
        // Disable default UI to remove development watermarks
        disableDefaultUI: false,
        // Remove Google branding and development notices
        clickableIcons: false,
      });

      setMapLoaded(true);
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
      setError('Failed to load Google Maps');
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  /**
   * Load heat centers and demand sites data from the backend API
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [heatCentersData, demandSitesData, dataCentersData] = await Promise.all([
          api.heatCenters.getAll(),
          api.demandSites.getAll(),
          api.dataCenters.getAll()
        ]);
        
        setHeatCenters(heatCentersData);
        setDemandSites(demandSitesData);
        
        // Transform API data centers to legacy format for compatibility
        const transformedDataCenters: DataCenter[] = dataCentersData.map(dc => ({
          id: dc.id,
          name: dc.name,
          description: `${dc.dc_type || 'Data Center'} - ${dc.total_it_load_kw || 0}kW IT Load`,
          latitude: dc.location_lat,
          longitude: dc.location_lng,
          provider: 'Enterprise',
          capacity: `${dc.total_it_load_kw || 0}kW`,
          established: '2024',
          website: '',
          address: dc.address || ''
        }));
        
        setDataCenters(transformedDataCenters);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data from backend');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Add markers to the map once data is loaded and map is ready
   */
  useEffect(() => {
    if (!loading && !error && mapLoaded && map.current) {
      addAllMarkers();
    }
  }, [heatCenters, demandSites, dataCenters, loading, error, mapLoaded]);

  /**
   * Creates a heat center marker with clean, professional styling
   */
  const createHeatCenterMarker = (heatCenter: HeatCenter) => {
    if (!map.current) return null;

    const marker = new google.maps.Marker({
      position: { lat: heatCenter.location_lat, lng: heatCenter.location_lng },
      map: map.current,
      title: heatCenter.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#dc2626', // Clean red color for heat centers
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      zIndex: 1000,
    });

    // Add click listener
    marker.addListener('click', () => {
      // Center the map on the clicked marker with better framing
      if (map.current) {
        map.current.panTo({ lat: heatCenter.location_lat, lng: heatCenter.location_lng });
        
        // Set appropriate zoom level for better framing
        const currentZoom = map.current.getZoom();
        if (currentZoom && currentZoom < 14) {
          map.current.setZoom(14);
        }
      }
      
      const mapMarker: MapMarker = {
        id: heatCenter.id,
        name: heatCenter.name,
        type: 'heat_center',
        latitude: heatCenter.location_lat,
        longitude: heatCenter.location_lng,
        status: heatCenter.is_active ? 'active' : 'inactive',
        data: heatCenter
      };
      setSelectedMarker(mapMarker);
      showInfoWindow(marker, mapMarker);
    });

    return marker;
  };

  /**
   * Creates a demand site marker with clean, professional styling
   */
  const createDemandSiteMarker = (demandSite: DemandSite) => {
    if (!map.current) return null;

    const marker = new google.maps.Marker({
      position: { lat: demandSite.location_lat, lng: demandSite.location_lng },
      map: map.current,
      title: demandSite.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#2563eb', // Clean blue color for demand sites
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      zIndex: 999,
    });

    // Add click listener
    marker.addListener('click', () => {
      // Center the map on the clicked marker with better framing
      if (map.current) {
        map.current.panTo({ lat: demandSite.location_lat, lng: demandSite.location_lng });
        
        // Set appropriate zoom level for better framing
        const currentZoom = map.current.getZoom();
        if (currentZoom && currentZoom < 14) {
          map.current.setZoom(14);
        }
      }
      
      const mapMarker: MapMarker = {
        id: demandSite.id,
        name: demandSite.name,
        type: 'demand_site',
        latitude: demandSite.location_lat,
        longitude: demandSite.location_lng,
        status: demandSite.is_connected ? 'connected' : 'disconnected',
        data: demandSite
      };
      setSelectedMarker(mapMarker);
      showInfoWindow(marker, mapMarker);
    });

    return marker;
  };

  /**
   * Creates a data center marker with clean, professional styling
   */
  const createDataCenterMarker = (dataCenter: DataCenter) => {
    if (!map.current) return null;

    const marker = new google.maps.Marker({
      position: { lat: dataCenter.latitude, lng: dataCenter.longitude },
      map: map.current,
      title: dataCenter.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#16a34a', // Clean green color for data centers
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      zIndex: 1001,
    });

    // Add click listener
    marker.addListener('click', () => {
      // Center the map on the clicked marker with better framing
      if (map.current) {
        map.current.panTo({ lat: dataCenter.latitude, lng: dataCenter.longitude });
        
        // Set appropriate zoom level for better framing
        const currentZoom = map.current.getZoom();
        if (currentZoom && currentZoom < 14) {
          map.current.setZoom(14);
        }
      }
      
      const mapMarker: MapMarker = {
        id: dataCenter.id,
        name: dataCenter.name,
        type: 'data_center',
        latitude: dataCenter.latitude,
        longitude: dataCenter.longitude,
        status: 'active',
        data: dataCenter
      };
      setSelectedMarker(mapMarker);
      setSelectedDataCenter(dataCenter);
      showInfoWindow(marker, mapMarker);
    });

    return marker;
  };

  /**
   * Add all markers to the map
   */
  const addAllMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add heat center markers
    heatCenters.forEach((heatCenter: HeatCenter) => {
      const marker = createHeatCenterMarker(heatCenter);
      if (marker) {
        markersRef.current.push(marker);
      }
    });

    // Add demand site markers
    demandSites.forEach((demandSite: DemandSite) => {
      const marker = createDemandSiteMarker(demandSite);
      if (marker) {
        markersRef.current.push(marker);
      }
    });

    // Add data center markers
    dataCenters.forEach((dataCenter: DataCenter) => {
      const marker = createDataCenterMarker(dataCenter);
      if (marker) {
        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });
      map.current.fitBounds(bounds);
      
      // Set a reasonable zoom level for SF
      const listener = google.maps.event.addListener(map.current, 'bounds_changed', () => {
        if (map.current && map.current.getZoom() && map.current.getZoom()! > 15) {
          map.current.setZoom(13);
        }
        google.maps.event.removeListener(listener);
      });
    }
  };

  /**
   * Show info window with marker details
   */
  const showInfoWindow = (marker: google.maps.Marker, mapMarker: MapMarker) => {
    if (!map.current) return;

    // Close existing info window
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // Create popup content
    const popupEl = document.createElement('div');
    const root = createRoot(popupEl);
    
    root.render(
      <DataCenterPopup
        marker={mapMarker}
        onClose={() => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          setSelectedMarker(null);
        }}
      />
    );

    // Create and show info window
    infoWindowRef.current = new google.maps.InfoWindow({
      content: popupEl,
      maxWidth: 400,
    });

    infoWindowRef.current.open(map.current, marker);

    // Add click listener to map to close popup when clicking outside
    const mapClickListener = map.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      // Check if the click was on the marker itself
      const clickedPosition = event.latLng;
      const markerPosition = marker.getPosition();
      
      if (clickedPosition && markerPosition) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          clickedPosition,
          markerPosition
        );
        
        // If click is more than 50 meters away from marker, close popup
        if (distance > 50) {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          setSelectedMarker(null);
          // Remove the click listener
          google.maps.event.removeListener(mapClickListener);
        }
      }
    });

    // Clean up listener when info window is closed
    infoWindowRef.current.addListener('closeclick', () => {
      google.maps.event.removeListener(mapClickListener);
      setSelectedMarker(null);
    });
  };

  /**
   * Handle search filtering
   */
  useEffect(() => {
    if (!searchQuery) {
      markersRef.current.forEach(marker => {
        marker.setVisible(true);
      });
      return;
    }

    const query = searchQuery.toLowerCase();
    markersRef.current.forEach((marker, index) => {
      const allMarkers = [...heatCenters, ...demandSites];
      const markerData = allMarkers[index];
      const matches = markerData?.name.toLowerCase().includes(query) || false;
      
      marker.setVisible(matches);
    });
  }, [searchQuery, heatCenters, demandSites]);

  /**
   * Handle 3D toggle (satellite vs roadmap view)
   */
  const handle3DToggle = (newIs3D: boolean) => {
    setIs3D(newIs3D);
    if (map.current) {
      map.current.setMapTypeId(
        newIs3D ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP
      );
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Map Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      {mapLoaded && <MapControls onToggle3D={handle3DToggle} />}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map and data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;