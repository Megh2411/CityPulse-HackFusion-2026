// app/test/page.tsx
import TestMap from "@/components/test-map";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🗺️ Leaflet Map Test
          </h1>
          <p className="text-gray-600">
            Testing Leaflet.js integration with Next.js 14
          </p>
        </div>

        <div className="space-y-6">
          {/* Test 1: Direct Leaflet */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Test 1: Direct Leaflet.js
            </h2>
            <div>
              <TestMap />
            </div>
          </div>

          {/* Test 2: React-Leaflet (if installed) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Test 2: React-Leaflet Component
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Check if react-leaflet components work:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-700">
                    Package Status
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span>
                        leaflet:{" "}
                        {typeof window !== "undefined"
                          ? "Loaded ✓"
                          : "Checking..."}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span>react-leaflet@4.2.1: Installed ✓</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700">Browser APIs</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span>
                        window:{" "}
                        {typeof window !== "undefined"
                          ? "Available ✓"
                          : "Not available"}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span>
                        document:{" "}
                        {typeof document !== "undefined"
                          ? "Available ✓"
                          : "Not available"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Button to test React-Leaflet */}
              <div className="pt-4">
                <a
                  href="/test/react-leaflet"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Test React-Leaflet Component →
                </a>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-3">
              Troubleshooting
            </h2>
            <ul className="space-y-2 text-yellow-700">
              <li className="flex items-start">
                <span className="mr-2">🔍</span>
                <span>
                  If map doesn't load, check browser console for errors
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📁</span>
                <span>
                  Verify marker icons exist in{" "}
                  <code className="bg-yellow-100 px-1 rounded">
                    public/leaflet/
                  </code>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔄</span>
                <span>Hard refresh (Ctrl+F5) if you see broken images</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
