"use client";

import { useRef, useCallback, useState } from "react";
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Building2, Factory, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDataCenters, useHeatSinks } from "@/hooks";
import type { DataCenter, HeatSink } from "@/types";

const MAPLIBRE_STYLE = process.env.NEXT_PUBLIC_MAPLIBRE_STYLE || "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface MapContainerProps {
  height?: number;
  onSelectDataCenter?: (dc: DataCenter) => void;
  onSelectHeatSink?: (hs: HeatSink) => void;
}

type PopupInfo = {
  type: "datacenter" | "heatsink";
  data: DataCenter | HeatSink;
  longitude: number;
  latitude: number;
};

export function MapContainer({ height = 500, onSelectDataCenter, onSelectHeatSink }: MapContainerProps) {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const { data: dataCenters } = useDataCenters();
  const { data: heatSinks } = useHeatSinks();

  const handleDcClick = useCallback((dc: DataCenter) => {
    setPopupInfo({
      type: "datacenter",
      data: dc,
      longitude: dc.location.longitude,
      latitude: dc.location.latitude,
    });
    onSelectDataCenter?.(dc);
  }, [onSelectDataCenter]);

  const handleHsClick = useCallback((hs: HeatSink) => {
    setPopupInfo({
      type: "heatsink",
      data: hs,
      longitude: hs.location.longitude,
      latitude: hs.location.latitude,
    });
    onSelectHeatSink?.(hs);
  }, [onSelectHeatSink]);

  return (
    <div style={{ height }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -122.4194,
          latitude: 37.7749,
          zoom: 11,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAPLIBRE_STYLE}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Data Center Markers */}
        {dataCenters?.items?.map((dc) => (
          <Marker
            key={`dc-${dc.id}`}
            longitude={dc.location.longitude}
            latitude={dc.location.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleDcClick(dc);
            }}
          >
            <div className="cursor-pointer p-2 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          </Marker>
        ))}

        {/* Heat Sink Markers */}
        {heatSinks?.items?.map((hs) => (
          <Marker
            key={`hs-${hs.id}`}
            longitude={hs.location.longitude}
            latitude={hs.location.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleHsClick(hs);
            }}
          >
            <div className="cursor-pointer p-2 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors">
              <Home className="h-5 w-5 text-white" />
            </div>
          </Marker>
        ))}

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            {popupInfo.type === "datacenter" ? (
              <DataCenterPopup dataCenter={popupInfo.data as DataCenter} />
            ) : (
              <HeatSinkPopup heatSink={popupInfo.data as HeatSink} />
            )}
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-md text-sm">
        <div className="font-medium mb-2">Legend</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
          <span>Data Centers ({dataCenters?.items?.length || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full" />
          <span>Heat Sinks ({heatSinks?.items?.length || 0})</span>
        </div>
      </div>
    </div>
  );
}

function DataCenterPopup({ dataCenter }: { dataCenter: DataCenter }) {
  return (
    <Card className="border-0 shadow-none min-w-[200px]">
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-sm flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-500" />
          {dataCenter.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">IT Load:</span>
          <span className="font-medium">{dataCenter.total_it_load_kw} kW</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">PUE:</span>
          <span className="font-medium">{dataCenter.pue || "N/A"}</span>
        </div>
        {dataCenter.dc_type && (
          <Badge variant="secondary" className="text-xs mt-1">
            {dataCenter.dc_type}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function HeatSinkPopup({ heatSink }: { heatSink: HeatSink }) {
  return (
    <Card className="border-0 shadow-none min-w-[200px]">
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-sm flex items-center gap-2">
          <Factory className="h-4 w-4 text-green-500" />
          {heatSink.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Capacity:</span>
          <span className="font-medium">{heatSink.capacity_mw} MW</span>
        </div>
        {heatSink.current_demand_mw && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Demand:</span>
            <span className="font-medium">{heatSink.current_demand_mw} MW</span>
          </div>
        )}
        {heatSink.sink_type && (
          <Badge variant="secondary" className="text-xs mt-1">
            {heatSink.sink_type}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
