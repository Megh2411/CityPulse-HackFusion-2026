// app/test/react-leaflet/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ReactLeafletMap = dynamic(() => import("./react-leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading React-Leaflet...</p>
      </div>
    </div>
  ),
});

export default function ReactLeafletTestPage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a
            href="/test"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Test Page
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            ⚛️ React-Leaflet Test
          </h1>
          <p className="text-gray-600">
            Testing React-Leaflet wrapper components
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            React-Leaflet Component
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              {showMap ? "Hide Map" : "Show React-Leaflet Map"}
            </button>

            {showMap && (
              <div className="mt-6">
                <ReactLeafletMap />
              </div>
            )}

            {!showMap && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">
                  Click the button above to load the React-Leaflet component.
                  This tests dynamic imports and client-side rendering.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
