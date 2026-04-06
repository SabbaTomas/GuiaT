// Grid configuration for CABA + AMBA reducida
const GRID_SIZE = 30 // 30x30 grid
const CABA_BOUNDS = {
  north: -34.5425, // CABA northernmost
  south: -34.7769, // CABA southernmost
  east: -58.3615,  // CABA easternmost
  west: -58.5340   // CABA westernmost
}

// Extended bounds for AMBA reducida
const AMBA_BOUNDS = {
  north: -34.3500,
  south: -34.9000,
  east: -58.2000,
  west: -58.7000
}

function getQuadrant(lat, lng) {
  // Check if within extended AMBA bounds
  // For negative latitudes (south hemisphere): north is GREATER (less negative)
  if (
    lat > AMBA_BOUNDS.north || lat < AMBA_BOUNDS.south ||
    lng < AMBA_BOUNDS.west || lng > AMBA_BOUNDS.east
  ) {
    console.log(`❌ Out of bounds: lat=${lat} (bounds: ${AMBA_BOUNDS.south} to ${AMBA_BOUNDS.north}), lng=${lng} (bounds: ${AMBA_BOUNDS.west} to ${AMBA_BOUNDS.east})`)
    return null // Outside coverage area
  }

  // Calculate position in AMBA grid
  const latRange = AMBA_BOUNDS.north - AMBA_BOUNDS.south
  const lngRange = AMBA_BOUNDS.east - AMBA_BOUNDS.west

  const latPos = (AMBA_BOUNDS.north - lat) / latRange
  const lngPos = (lng - AMBA_BOUNDS.west) / lngRange

  const row = Math.floor(latPos * GRID_SIZE)
  const col = Math.floor(lngPos * GRID_SIZE)

  // Clamp to grid
  const clampedRow = Math.max(0, Math.min(GRID_SIZE - 1, row))
  const clampedCol = Math.max(0, Math.min(GRID_SIZE - 1, col))

  // Convert to Guía T reference (A-Z for rows, 1-30 for cols)
  const rowLetter = String.fromCharCode(65 + (clampedRow % 26))
  const colNumber = (clampedCol % GRID_SIZE) + 1

  return `${rowLetter}${colNumber}`
}

function getQuadrantBounds(quadrantRef) {
  // Parse reference like "C4"
  const match = quadrantRef.match(/([A-Z])(\d+)/)
  if (!match) return null

  const rowLetter = match[1]
  const colNumber = parseInt(match[2])

  const row = rowLetter.charCodeAt(0) - 65
  const col = colNumber - 1

  const latRange = AMBA_BOUNDS.north - AMBA_BOUNDS.south
  const lngRange = AMBA_BOUNDS.east - AMBA_BOUNDS.west

  const north = AMBA_BOUNDS.north - (row / GRID_SIZE) * latRange
  const south = AMBA_BOUNDS.north - ((row + 1) / GRID_SIZE) * latRange
  const west = AMBA_BOUNDS.west + (col / GRID_SIZE) * lngRange
  const east = AMBA_BOUNDS.west + ((col + 1) / GRID_SIZE) * lngRange

  return { north, south, east, west }
}

export { getQuadrant, getQuadrantBounds }
