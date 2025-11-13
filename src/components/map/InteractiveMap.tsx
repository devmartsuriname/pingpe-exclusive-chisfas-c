import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export const InteractiveMap = ({
  center = [4.5, -55.5], // Upper Suriname River coordinates
  zoom = 10,
  className = "h-[400px] rounded-lg",
}: InteractiveMapProps) => {
  useEffect(() => {
    // Ensure Leaflet CSS is loaded
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full rounded-lg border border-border shadow-lg"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            <div className="text-center p-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">PingPe Village</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Heart of Saramaccan Culture
              </p>
              <Button size="sm" asChild>
                <a href="/village">View Details</a>
              </Button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
