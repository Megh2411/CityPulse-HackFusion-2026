// components/map/incident-map.tsx
"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/lib/types";

interface IncidentMapProps {
  incidents: Ticket[];
  height?: string;
  onMarkerClick?: (ticket: Ticket) => void;
}

export default function IncidentMap({
  incidents,
  height = "500px",
  onMarkerClick,
}: IncidentMapProps) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamically import leaflet only on client side
    const loadMap = async () => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup } =
        await import("react-leaflet");

      // Fix for default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      // Create the actual map component
      const Map = ({ incidents, height, onMarkerClick }: any) => {
        const createSeverityIcon = (severity: string) => {
          const colors: Record<string, string> = {
            critical: "#DC2626",
            high: "#EA580C",
            medium: "#CA8A04",
            low: "#059669",
          };

          const color = colors[severity] || "#6B7280";

          const iconHtml = `
            <div style="
              background-color: ${color};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background-color: white;
                border-radius: 50%;
              "></div>
            </div>
          `;

          return L.divIcon({
            html: iconHtml,
            className: "",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
          });
        };

        const validIncidents = incidents.filter(
          (incident: Ticket) =>
            incident.latitude &&
            incident.longitude &&
            incident.latitude !== 0 &&
            incident.longitude !== 0,
        );

        if (validIncidents.length === 0) {
          return (
            <div
              style={{ height }}
              className="flex items-center justify-center bg-gray-50 rounded-lg border"
            >
              <div className="text-center p-4">
                <div className="text-gray-400 mb-2">📍</div>
                <p className="text-gray-500">No incidents with location data</p>
              </div>
            </div>
          );
        }

        const calculateCenter = (): [number, number] => {
          if (validIncidents.length === 0) return [19.076, 72.8777];
          const avgLat =
            validIncidents.reduce(
              (sum: number, incident: Ticket) => sum + incident.latitude,
              0,
            ) / validIncidents.length;
          const avgLng =
            validIncidents.reduce(
              (sum: number, incident: Ticket) => sum + incident.longitude,
              0,
            ) / validIncidents.length;
          return [avgLat, avgLng];
        };

        return (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
              center={calculateCenter()}
              zoom={12}
              style={{ height, width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {validIncidents.map((incident: Ticket) => {
                const icon = createSeverityIcon(incident.severity);

                return (
                  <Marker
                    key={incident.id}
                    position={[incident.latitude, incident.longitude]}
                    icon={icon}
                    eventHandlers={{
                      click: () => {
                        if (onMarkerClick) {
                          onMarkerClick(incident);
                        }
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[250px]">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-800 text-sm">
                            {incident.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-bold ${
                              incident.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : incident.severity === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : incident.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                          >
                            {incident.severity}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">📍</span>
                            <span>{incident.location}</span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">📋</span>
                            <span className="capitalize">
                              {incident.status.replace("_", " ")}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">🏷️</span>
                            <span className="capitalize">
                              {incident.category.replace("_", " ")}
                            </span>
                          </div>

                          <p className="text-gray-700 mt-2 text-xs">
                            {incident.description.length > 100
                              ? `${incident.description.substring(0, 100)}...`
                              : incident.description}
                          </p>

                          {onMarkerClick && (
                            <button
                              onClick={() => onMarkerClick(incident)}
                              className="mt-3 w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors font-medium"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                Severity
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Critical", severity: "critical", color: "#DC2626" },
                  { label: "High", severity: "high", color: "#EA580C" },
                  { label: "Medium", severity: "medium", color: "#CA8A04" },
                  { label: "Low", severity: "low", color: "#059669" },
                ].map((item) => {
                  const count = validIncidents.filter(
                    (i: Ticket) => i.severity === item.severity,
                  ).length;
                  return (
                    <div
                      key={item.severity}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-white"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-gray-600">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats box */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm z-[1000] max-w-xs">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Incident Map
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total incidents:</span>
                  <span className="font-medium">{incidents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">With locations:</span>
                  <span className="font-medium">{validIncidents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical:</span>
                  <span className="font-medium text-red-600">
                    {
                      validIncidents.filter(
                        (i: Ticket) => i.severity === "critical",
                      ).length
                    }
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click markers for details • Drag to navigate
              </p>
            </div>
          </div>
        );
      };

      setMapComponent(() => Map);
    };

    loadMap();
  }, []);

  if (!MapComponent) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  const Map = MapComponent;
  return (
    <Map incidents={incidents} height={height} onMarkerClick={onMarkerClick} />
  );
}
