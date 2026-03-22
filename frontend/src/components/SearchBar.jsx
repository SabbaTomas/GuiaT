import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function SearchBar({ onSearch, onLoading, onLinesFound }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      onLoading(true)
      const response = await axios.post(`${API_URL}/api/search`, {
        address: input
      })
      
      onSearch(response.data)
      
      // Fetch lines for this quadrant
      if (response.data.quadrant) {
        const linesResponse = await axios.get(
          `${API_URL}/api/lines/${response.data.quadrant}`
        )
        onLinesFound(linesResponse.data.lines || [])
      }
      
      setSuggestions([])
    } catch (error) {
      console.error('Error searching:', error)
      alert('Error en la búsqueda. Intenta de nuevo.')
    } finally {
      onLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    
    if (value.length > 2) {
      // TODO: Implement autocomplete
      setSuggestions([])
    } else {
      setSuggestions([])
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ej: Av. Rivadavia 1234"
          className="flex-1 px-4 py-2 rounded text-black focus:outline-none"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded font-bold"
        >
          Buscar
        </button>
      </form>
      
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border rounded mt-1 shadow-lg z-10">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
