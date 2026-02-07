// app/test/react-leaflet/react-leaflet-map.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix for default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function ReactLeafletMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p>Loading React-Leaflet...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[19.076, 72.8777]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[19.076, 72.8777]}>
          <Popup>
            <div className="font-bold text-lg">React-Leaflet Works! 🎉</div>
            <p className="text-sm mt-1">Mumbai, India</p>
          </Popup>
        </Marker>
        <Marker position={[19.0176, 72.8561]}>
          <Popup>
            <div className="font-bold">Colaba</div>
            <p className="text-sm">Test marker 2</p>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="bg-green-50 p-4 border-t">
        <p className="text-green-700 font-medium">
          ✅ React-Leaflet component loaded successfully!
        </p>
        <p className="text-green-600 text-sm mt-1">
          Both direct Leaflet and React-Leaflet are working.
        </p>
      </div>
    </div>
  );
}
