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

  // Update polyline when selected line changes
  useEffect(() => {
    if (selectedLine && mapInstance.current) {
      if (polylineRef.current) {
        mapInstance.current.removeLayer(polylineRef.current)
      }

      if (selectedLine.route && selectedLine.route.coordinates) {
        const latlngs = selectedLine.route.coordinates.map(coord => [coord[1], coord[0]])
        polylineRef.current = L.polyline(latlngs, {
          color: selectedLine.color || 'blue',
          weight: 3,
          opacity: 0.7
        }).addTo(mapInstance.current)

        const bounds = L.latLngBounds(latlngs)
        mapInstance.current.fitBounds(bounds)
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
