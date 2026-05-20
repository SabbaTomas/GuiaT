import React, { useState, useEffect } from 'react'
import { getFavorites, removeFavoriteAddress, removeFavoriteLine } from '../utils/localStorage'

export default function Favorites({ onSelectHistory, onSelectFavoriteLine }) {
  const [favorites, setFavorites] = useState(getFavorites())
  const [activeTab, setActiveTab] = useState('addresses') // 'addresses' or 'lines'

  // Listen for storage changes (from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      setFavorites(getFavorites())
    }

    // Custom event listener for local changes
    window.addEventListener('favoritesChanged', handleStorageChange)
    return () => window.removeEventListener('favoritesChanged', handleStorageChange)
  }, [])

  const handleRemoveAddress = (address) => {
    removeFavoriteAddress(address)
    setFavorites(getFavorites())
  }

  const handleRemoveLine = (lineId) => {
    removeFavoriteLine(lineId)
    setFavorites(getFavorites())
  }

  const handleSelectAddress = (address) => {
    onSelectHistory(address)
  }

  const handleSelectLine = (line) => {
    onSelectFavoriteLine(line)
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="font-bold text-lg mb-3">⭐ Favoritos</h3>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            activeTab === 'addresses'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📍 Direcciones ({favorites.addresses.length})
        </button>
        <button
          onClick={() => setActiveTab('lines')}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            activeTab === 'lines'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🚌 Líneas ({favorites.lines.length})
        </button>
      </div>

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {favorites.addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">Sin direcciones guardadas</p>
          ) : (
            favorites.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-2 rounded text-sm hover:bg-gray-200 transition group"
              >
                <div
                  onClick={() => handleSelectAddress(addr)}
                  className="cursor-pointer flex-1"
                >
                  <p className="font-medium text-gray-800 truncate">{addr.address}</p>
                  <p className="text-xs text-gray-500">📍 {addr.quadrant}</p>
                </div>
                <button
                  onClick={() => handleRemoveAddress(addr.address)}
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lines Tab */}
      {activeTab === 'lines' && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {favorites.lines.length === 0 ? (
            <p className="text-gray-500 text-sm">Sin líneas guardadas</p>
          ) : (
            favorites.lines.map((line, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-2 rounded text-sm hover:bg-gray-200 transition"
              >
                <div
                  onClick={() => handleSelectLine(line)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: line.color || '#666' }}
                  >
                    {line.number}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Línea {line.number}</p>
                    <p className="text-xs text-gray-500">{line.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveLine(line.id)}
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
