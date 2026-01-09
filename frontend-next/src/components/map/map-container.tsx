"use client";

import { useRef, useCallback, useState } from "react";
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Building2, Factory, Home, Zap, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDataCenters, useHeatSinks } from "@/hooks";
import { formatCurrency, formatPercent } from "@/lib/constants";
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
  const [selectedDC, setSelectedDC] = useState<DataCenter | null>(null);
  const [selectedHS, setSelectedHS] = useState<HeatSink | null>(null);

  const { data: dataCenters } = useDataCenters();
  const { data: heatSinks } = useHeatSinks();

  const handleDcClick = useCallback((dc: DataCenter) => {
    setSelectedDC(dc);
    setPopupInfo({
      type: "datacenter",
      data: dc,
      longitude: dc.location.longitude,
      latitude: dc.location.latitude,
    });
    onSelectDataCenter?.(dc);
  }, [onSelectDataCenter]);

  const handleHsClick = useCallback((hs: HeatSink) => {
    setSelectedHS(hs);
    setPopupInfo({
      type: "heatsink",
      data: hs,
      longitude: hs.location.longitude,
      latitude: hs.location.latitude,
    });
    onSelectHeatSink?.(hs);
  }, [onSelectHeatSink]);



  // Calculate distance string if both selected
  let lineDistance = "";
  if (selectedDC && selectedHS) {
    const R = 6371; // km
    const dLat = (selectedHS.location.latitude - selectedDC.location.latitude) * Math.PI / 180;
    const dLon = (selectedHS.location.longitude - selectedDC.location.longitude) * Math.PI / 180;
    const lat1 = selectedDC.location.latitude * Math.PI / 180;
    const lat2 = selectedHS.location.latitude * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    lineDistance = `${d.toFixed(1)} km`;
  }

  return (
    <div style={{ height }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 4.9041,
          latitude: 52.3676,
          zoom: 10,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAPLIBRE_STYLE}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Connection Line */}
        {selectedDC && selectedHS && (
          <Source
            id="connection-line"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [selectedDC.location.longitude, selectedDC.location.latitude],
                  [selectedHS.location.longitude, selectedHS.location.latitude],
                ],
              },
              properties: {
                distance: lineDistance,
              },
            }}
          >
            <Layer
              id="line-layer"
              type="line"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "#8b5cf6", // Purple
                "line-width": 4,
                "line-dasharray": [2, 1],
              }}
            />
            <Layer
              id="line-label"
              type="symbol"
              layout={{
                "text-field": ["get", "distance"],
                "symbol-placement": "line-center",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 14,
                "text-offset": [0, -1],
              }}
              paint={{
                "text-color": "#6b21a8",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
              }}
            />
          </Source>
        )}

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
            <div className={`cursor-pointer p-2 rounded-full shadow-lg transition-all ${selectedDC?.id === dc.id ? "bg-purple-600 scale-110 ring-4 ring-purple-200" : "bg-blue-500 hover:bg-blue-600"
              }`}>
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
            <div className={`cursor-pointer p-2 rounded-full shadow-lg transition-all ${selectedHS?.id === hs.id ? "bg-purple-600 scale-110 ring-4 ring-purple-200" : "bg-green-500 hover:bg-green-600"
              }`}>
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

      {/* Quick Feasibility Card */}
      {selectedDC && selectedHS && (
        <QuickFeasibilityCard
          dataCenter={selectedDC}
          heatSink={selectedHS}
          distance={lineDistance}
        />
      )}
    </div>
  );
}

function QuickFeasibilityCard({ dataCenter, heatSink, distance }: { dataCenter: DataCenter, heatSink: HeatSink, distance: string }) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<{ npv: number; savings: number; irr: number; payback: number; co2: number } | null>(null);

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/predictions/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataCenterId: dataCenter.id,
          heatSinkIds: [heatSink.id],
          scenarioName: `Quick Check: ${dataCenter.name} -> ${heatSink.name}`,
          analysisYears: 10,
          discountRate: 0.08,
        }),
      });

      if (!resp.ok) throw new Error("Calculation failed");
      const data = await resp.json();

      if (data && data.financialMetrics) {
        setMetrics({
          npv: data.financialMetrics.netPresentValue,
          savings: data.savingsMetrics?.netAnnualSavings || (data.heatRecoveryMetrics?.annualGasCostSavings || 0),
          irr: (data.financialMetrics.internalRateOfReturn || 0) / 100,
          payback: data.financialMetrics.simplePaybackYears || 0,
          co2: data.heatRecoveryMetrics?.co2AvoidedKgPerYear || (data.carbonMetrics?.annualCo2ReductionKg || 0),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to calculate feasibility");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-24 left-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl w-80 animate-in slide-in-from-left-10 fade-in duration-300 border border-purple-100">
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
        <div className="p-2 rounded-lg bg-purple-100">
          <Zap className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Quick Feasibility</h4>
          <p className="text-xs text-gray-500">Pipeline: {distance}</p>
        </div>
      </div>

      {metrics === null ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Estimate ROI for connecting <strong>{dataCenter.name}</strong> to <strong>{heatSink.name}</strong>.
          </div>
          <Button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Run Quick Analysis"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center py-3 bg-purple-50 rounded-lg border border-purple-100 mb-2">
            <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Estimated NPV</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.npv)}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500">Annual Savings</p>
              <p className="font-semibold text-gray-900">{formatCurrency(metrics.savings)}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500">Payback</p>
              <p className="font-semibold text-gray-900">{metrics.payback.toFixed(1)} yrs</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500">IRR</p>
              <p className="font-semibold text-gray-900">{formatPercent(metrics.irr)}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500">CO₂ Avoided</p>
              <p className="font-semibold text-gray-900">{(metrics.co2 / 1000).toFixed(0)}t</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 mt-2" onClick={() => setMetrics(null)}>
            Run Again
          </Button>
        </div>
      )}
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
          <span className="font-medium">{dataCenter.totalItLoadKw} kW</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">PUE:</span>
          <span className="font-medium">{dataCenter.pue || "N/A"}</span>
        </div>
        {dataCenter.dcType && (
          <Badge variant="secondary" className="text-xs mt-1">
            {dataCenter.dcType}
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
          <span className="font-medium">{heatSink.capacityMw} MW</span>
        </div>
        {heatSink.currentDemandMw && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Demand:</span>
            <span className="font-medium">{heatSink.currentDemandMw} MW</span>
          </div>
        )}
        {heatSink.sinkType && (
          <Badge variant="secondary" className="text-xs mt-1">
            {heatSink.sinkType}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
