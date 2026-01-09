import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("@/components/map/map-container").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-muted">
        Loading map...
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-56px)]">
      <MapContainer height={-1} />
      <style jsx>{`
        div :global(.maplibregl-map) {
          height: calc(100vh - 56px) !important;
        }
      `}</style>
    </div>
  );
}
