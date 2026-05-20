/**
 * Script para parsear KML de CNRT e importar Línea 152 real
 * 
 * Uso: node backend/scripts/parse-kml-line-152.js
 * Resultado: Línea 152 con 3 recorridos (A, B, C) como BusRoute documents
 */

import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import BusLine from '../models/BusLine.js'
import BusRoute from '../models/BusRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Conectar a MongoDB
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://GuiaTProject:XW5lpghfqO9xQiDL@guiat.jraeteg.mongodb.net/guiat'

// Regex para extraer contenido de LineString
const extractCoordinates = (xml) => {
  const regex = /<LineString>[\s\S]*?<coordinates>([^<]+)<\/coordinates>[\s\S]*?<\/LineString>/
  const match = xml.match(regex)
  if (!match) return []
  
  return match[1]
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(coord => {
      const [lng, lat] = coord.split(',').map(v => parseFloat(v))
      return [lng, lat] // Guardar como [lng, lat] para mantener la convención actual
    })
}

// Extraer metadatos de un Placemark
const extractMetadata = (placemark) => {
  const lineMatch = placemark.match(/<SimpleData name="Linea">(\d+)<\/SimpleData>/)
  const recorridoMatch = placemark.match(/<SimpleData name="Recorrido">([ABC])<\/SimpleData>/)
  const sentidoMatch = placemark.match(/<SimpleData name="Sentido">([^<]+)<\/SimpleData>/)
  const empresaMatch = placemark.match(/<SimpleData name="Razon_soci">([^<]+)<\/SimpleData>/)
  
  return {
    linea: lineMatch ? lineMatch[1] : null,
    recorrido: recorridoMatch ? recorridoMatch[1] : null,
    sentido: sentidoMatch ? sentidoMatch[1] : null,
    empresa: empresaMatch ? empresaMatch[1] : null
  }
}

// Generar paradas cada N puntos
const generateStops = (coordinates, maxStops = 20) => {
  const stops = []
  const interval = Math.max(1, Math.ceil(coordinates.length / maxStops))
  
  coordinates.forEach((coord, idx) => {
    if (idx % interval === 0 || idx === coordinates.length - 1) {
      stops.push({
        order: stops.length + 1,
        name: `Parada ${stops.length + 1}`,
        lat: coord[1],
        lng: coord[0]
      })
    }
  })
  
  return stops
}

// Calcular cuadrantes desde coordenadas
const calculateQuadrant = (lat, lng) => {
  const AMBA_BOUNDS = {
    north: -34.35,
    south: -34.9,
    west: -58.7,
    east: -58.2
  }

  if (lat > AMBA_BOUNDS.north || lat < AMBA_BOUNDS.south || 
      lng < AMBA_BOUNDS.west || lng > AMBA_BOUNDS.east) {
    return null
  }

  const latRange = AMBA_BOUNDS.north - AMBA_BOUNDS.south
  const lngRange = AMBA_BOUNDS.east - AMBA_BOUNDS.west

  const latFraction = (AMBA_BOUNDS.north - lat) / latRange
  const lngFraction = (lng - AMBA_BOUNDS.west) / lngRange

  const row = Math.floor(latFraction * 26)
  const col = Math.floor(lngFraction * 30) + 1

  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return rows[Math.min(row, 25)] + col
}

// Extraer cuadrantes únicos de una ruta
const extractQuadrants = (coordinates) => {
  const quadrants = new Set()
  for (let i = 0; i < coordinates.length; i += 10) {
    const q = calculateQuadrant(coordinates[i][1], coordinates[i][0])
    if (q) quadrants.add(q)
  }
  return Array.from(quadrants)
}

// Main
async function main() {
  try {
    // Conectar
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Conectado a MongoDB')

    // Leer KML
    const kmlPath = path.join(__dirname, '../../resources/lineas_jn_rmba_cnrt.kml')
    const kmlContent = fs.readFileSync(kmlPath, 'utf-8')
    console.log('✅ KML leído')

    // Extraer Placemarks de línea 152
    const placemarkRegex = /<Placemark>[\s\S]*?<\/Placemark>/g
    const placemarks = kmlContent.match(placemarkRegex) || []
    console.log(`📍 Total Placemarks: ${placemarks.length}`)

    // Filtrar solo línea 152
    const line152Placemarks = placemarks.filter(pm => pm.includes('<SimpleData name="Linea">152</SimpleData>'))
    console.log(`📍 Placemarks Línea 152: ${line152Placemarks.length}`)

    // Crear/actualizar documento de línea 152
    let busLine = await BusLine.findOne({ number: '152' })
    if (!busLine) {
      busLine = new BusLine({
        number: '152',
        company: 'Empresa Tandilense',
        color: '#DC143C', // Rojo Carmesí
        type: 'colectivo',
        quadrants: []
      })
    }

    const allQuadrants = new Set()
    
    // Procesar cada Placemark y crear BusRoute
    const routes = []
    for (let idx = 0; idx < line152Placemarks.length; idx++) {
      const placemark = line152Placemarks[idx]
      const meta = extractMetadata(placemark)
      const coordinates = extractCoordinates(placemark)
      
      console.log(`\n🔄 Procesando ${idx + 1}/${line152Placemarks.length}`)
      console.log(`   Recorrido: ${meta.recorrido}, Sentido: ${meta.sentido}`)
      console.log(`   Puntos: ${coordinates.length}`)
      
      if (coordinates.length > 0) {
        const stops = generateStops(coordinates, 20)
        const quadrants = extractQuadrants(coordinates)
        
        // Agregar cuadrantes a la colección
        quadrants.forEach(q => allQuadrants.add(q))
        
        routes.push({
          lineNumber: '152',
          recorrido: meta.recorrido,
          sentido: meta.sentido,
          coordinates,
          stops,
          startPoint: `Inicio ${meta.recorrido}`,
          endPoint: `Fin ${meta.recorrido}`
        })
        console.log(`   ✅ Paradas: ${stops.length}, Cuadrantes: ${quadrants.length}`)
      }
    }

    // Actualizar cuadrantes en BusLine
    busLine.quadrants = Array.from(allQuadrants)
    await busLine.save()
    console.log(`\n✅ Línea 152 actualizada`)
    console.log(`   Cuadrantes: ${busLine.quadrants.join(', ')}`)

    // Borrar BusRoutes antiguos de línea 152
    await BusRoute.deleteMany({ lineNumber: '152' })
    console.log(`🗑️  BusRoutes antiguos eliminados`)

    // Insertar nuevas rutas
    for (const route of routes) {
      route.lineId = busLine._id
      const busRoute = new BusRoute(route)
      await busRoute.save()
    }
    
    console.log(`\n✅ Importación completada`)
    console.log(`   Línea: 152`)
    console.log(`   Recorridos: ${routes.length}`)
    console.log(`   Paradas totales: ${routes.reduce((sum, r) => sum + r.stops.length, 0)}`)
    console.log(`   Coordenadas totales: ${routes.reduce((sum, r) => sum + r.coordinates.length, 0)}`)

    // Desconectar
    await mongoose.disconnect()
    console.log('\n✅ Desconectado de MongoDB')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
