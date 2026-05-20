// localStorage utilities for GuíaT favorites

const FAVORITES_KEY = 'guiat_favorites'
const SEARCH_HISTORY_KEY = 'guiat_search_history'

// Helper to trigger UI updates
const notifyFavoritesChanged = () => {
  window.dispatchEvent(new Event('favoritesChanged'))
}

// Favorites structure: { addresses: [], lines: [] }

export const getFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : { addresses: [], lines: [] }
  } catch (error) {
    console.error('Error reading favorites:', error)
    return { addresses: [], lines: [] }
  }
}

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    notifyFavoritesChanged()
  } catch (error) {
    console.error('Error saving favorites:', error)
  }
}

// Add address to favorites
export const addFavoriteAddress = (address) => {
  const favorites = getFavorites()
  const exists = favorites.addresses.some(a => a.address === address.address)
  
  if (!exists) {
    favorites.addresses.unshift({
      ...address,
      savedAt: new Date().toISOString()
    })
    // Keep only last 20
    if (favorites.addresses.length > 20) {
      favorites.addresses = favorites.addresses.slice(0, 20)
    }
    saveFavorites(favorites)
  }
  
  return favorites
}

// Remove favorite address
export const removeFavoriteAddress = (address) => {
  const favorites = getFavorites()
  favorites.addresses = favorites.addresses.filter(a => a.address !== address)
  saveFavorites(favorites)
  return favorites
}

// Check if address is favorite
export const isFavoriteAddress = (address) => {
  const favorites = getFavorites()
  return favorites.addresses.some(a => a.address === address)
}

// Add line to favorites
export const addFavoriteLine = (line) => {
  const favorites = getFavorites()
  const exists = favorites.lines.some(l => l.id === line.id)
  
  if (!exists) {
    favorites.lines.push({
      ...line,
      savedAt: new Date().toISOString()
    })
    saveFavorites(favorites)
  }
  
  return favorites
}

// Remove favorite line
export const removeFavoriteLine = (lineId) => {
  const favorites = getFavorites()
  favorites.lines = favorites.lines.filter(l => l.id !== lineId)
  saveFavorites(favorites)
  return favorites
}

// Check if line is favorite
export const isFavoriteLine = (lineId) => {
  const favorites = getFavorites()
  return favorites.lines.some(l => l.id === lineId)
}

// Get search history (addresses searched)
export const getSearchHistory = () => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading search history:', error)
    return []
  }
}

// Add to search history
export const addToSearchHistory = (address) => {
  const history = getSearchHistory()
  const exists = history.some(h => h.address === address.address)
  
  if (!exists) {
    history.unshift({
      ...address,
      searchedAt: new Date().toISOString()
    })
    // Keep only last 30
    if (history.length > 30) {
      history.pop()
    }
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
    notifyFavoritesChanged()
  }
  
  return history
}

// Clear all data
export const clearAllFavorites = () => {
  localStorage.removeItem(FAVORITES_KEY)
  localStorage.removeItem(SEARCH_HISTORY_KEY)
  notifyFavoritesChanged()
}
