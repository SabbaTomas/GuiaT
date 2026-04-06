import React, { useState } from 'react'
import axios from 'axios'
import SearchBar from '../components/SearchBar'
import Map from '../components/Map'
import LineSelector from '../components/LineSelector'

export default function Home() {
  const [searchResult, setSearchResult] = useState(null)
  const [selectedLine, setSelectedLine] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lines, setLines] = useState([])
  const [routeLoading, setRouteLoading] = useState(false)

  // Handle line selection - fetch full route data
  const handleSelectLine = async (line) => {
    setRouteLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/line/${line.id}`)
      const { line: lineData, route } = response.data
      
      setSelectedLine({
        ...lineData,
        route: route
      })
    } catch (error) {
      console.error('Error fetching line route:', error)
      setSelectedLine(line) // Fallback to basic line data
    } finally {
      setRouteLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header with SearchBar */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🗺️ GuíaT</h1>
          <SearchBar 
            onSearch={setSearchResult} 
            onLoading={setLoading}
            onLinesFound={setLines}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Left sidebar - Results and Lines */}
        <div className="w-80 bg-white rounded-lg shadow-lg overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              Buscando...
            </div>
          )}
          
          {searchResult && !loading && (
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg mb-2">Resultado</h3>
              <div className="text-sm text-gray-700">
                <p className="mb-1"><strong>Dirección:</strong> {searchResult.address}</p>
                <p className="mb-1"><strong>Cuadrante:</strong> {searchResult.quadrant}</p>
                <p className="text-xs text-gray-500">
                  Lat: {searchResult.lat.toFixed(4)}, Lng: {searchResult.lng.toFixed(4)}
                </p>
              </div>
            </div>
          )}

          {/* Line Selector */}
          <LineSelector 
            lines={lines} 
            selectedLine={selectedLine}
            onSelectLine={handleSelectLine}
          />
        </div>

        {/* Right side - Map */}
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <Map 
            searchResult={searchResult} 
            selectedLine={selectedLine}
          />
        </div>
      </div>
    </div>
  )
}
