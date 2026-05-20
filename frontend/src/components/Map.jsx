import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function Map({ searchResult, selectedLine }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const markerRef = useRef(null)
  const polylineRef = useRef(null)
  const stopsMarkersRef = useRef([])

  useEffect(() => {
    // Initialize map on component mount
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView(
        [-34.6037, -58.3816], // CABA center
        13
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current)
    }
  }, [])

  // Update marker when search result changes
  useEffect(() => {
    if (searchResult && mapInstance.current) {
      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current)
      }

      markerRef.current = L.marker([searchResult.lat, searchResult.lng])
        .addTo(mapInstance.current)
        .bindPopup(`<strong>${searchResult.address}</strong><br/>Cuadrante: ${searchResult.quadrant}`)
        .openPopup()

      mapInstance.current.setView([searchResult.lat, searchResult.lng], 15)
    }
  }, [searchResult])

  // Update polyline and stops when selected line changes
  useEffect(() => {
    if (selectedLine && mapInstance.current) {
      // Remove existing polyline
      if (polylineRef.current) {
        mapInstance.current.removeLayer(polylineRef.current)
      }

      // Remove existing stop markers
      stopsMarkersRef.current.forEach(marker => {
        mapInstance.current.removeLayer(marker)
      })
      stopsMarkersRef.current = []

      if (selectedLine.route && selectedLine.route.coordinates) {
        // Draw polyline
        const latlngs = selectedLine.route.coordinates.map(coord => [coord[1], coord[0]])
        polylineRef.current = L.polyline(latlngs, {
          color: selectedLine.color || 'blue',
          weight: 3,
          opacity: 0.7
        }).addTo(mapInstance.current)

        // Add stop markers
        if (selectedLine.route.stops && selectedLine.route.stops.length > 0) {
          selectedLine.route.stops.forEach(stop => {
            // Create custom icon with stop order
            const icon = L.divIcon({
              html: `
                <div style="
                  background-color: ${selectedLine.color || '#0066ff'};
                  color: white;
                  border-radius: 50%;
                  width: 32px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                  ${stop.order}
                </div>
              `,
              className: 'bus-stop-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16]
            })

            const stopMarker = L.marker([stop.lat, stop.lng], { icon })
              .addTo(mapInstance.current)
              .bindPopup(`<strong>Parada ${stop.order}: ${stop.name}</strong>`)

            stopsMarkersRef.current.push(stopMarker)
          })
        }

        // Fit bounds to show everything
        const bounds = L.latLngBounds(latlngs)
        if (selectedLine.route.stops && selectedLine.route.stops.length > 0) {
          selectedLine.route.stops.forEach(stop => {
            bounds.extend([stop.lat, stop.lng])
          })
        }
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [selectedLine])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: '600px' }}
    />
  )
}
