import React, { useState, useEffect } from 'react'
import { addFavoriteLine, removeFavoriteLine, isFavoriteLine } from '../utils/localStorage'

export default function LineSelector({ lines, selectedLine, onSelectLine }) {
  const [favorites, setFavorites] = useState({})

  // Load favorites on mount and when lines change
  useEffect(() => {
    const newFavorites = {}
    lines.forEach(line => {
      newFavorites[line.id] = isFavoriteLine(line.id)
    })
    setFavorites(newFavorites)
  }, [lines])

  const colors = [
    '#FF0000', '#00AA00', '#0000FF', '#FF8800', '#FF0099',
    '#00BBBB', '#FFBB00', '#884400', '#00FF00', '#000088'
  ]

  const toggleFavorite = (e, line) => {
    e.stopPropagation()
    if (favorites[line.id]) {
      removeFavoriteLine(line.id)
      setFavorites(prev => ({
        ...prev,
        [line.id]: false
      }))
    } else {
      addFavoriteLine(line)
      setFavorites(prev => ({
        ...prev,
        [line.id]: true
      }))
    }
  }

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">Líneas 🚌</h3>
      
      {lines.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Busca una dirección para ver las líneas que pasan por ese cuadrante.
        </p>
      ) : (
        <ul className="space-y-2">
          {lines.map((line, idx) => (
            <li
              key={line.id || idx}
              onClick={() => onSelectLine(line)}
              className={`p-3 rounded cursor-pointer transition flex items-center justify-between ${
                selectedLine?.id === line.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-black'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                >
                  {line.number}
                </div>
                <div>
                  <p className="font-bold">{line.number}</p>
                  <p className="text-xs opacity-75">{line.company}</p>
                </div>
              </div>
              
              <button
                onClick={(e) => toggleFavorite(e, line)}
                className={`ml-2 text-xl transition ${
                  favorites[line.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-300'
                }`}
              >
                {favorites[line.id] ? '❤️' : '🤍'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
