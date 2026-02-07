// components/test-map.tsx
"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function TestMap() {
  const [isClient, setIsClient] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Create map
    const leafletMap = L.map("map-container").setView([19.076, 72.8777], 13);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(leafletMap);

    // Add marker
    const marker = L.marker([19.076, 72.8777]).addTo(leafletMap);
    marker.bindPopup("<b>Mumbai</b><br>Leaflet is working! 🎉").openPopup();

    setMap(leafletMap);

    // Cleanup
    return () => {
      if (leafletMap) {
        leafletMap.remove();
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300 shadow-lg">
      <div id="map-container" className="h-96 w-full" />
      <div className="bg-white p-4 border-t">
        <h3 className="font-bold text-lg text-green-600">
          ✅ Leaflet Test Successful!
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          If you see a map above with a marker in Mumbai, Leaflet is working
          correctly.
        </p>
      </div>
    </div>
  );
}
