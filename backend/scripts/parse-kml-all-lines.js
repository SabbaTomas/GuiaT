/**
 * Script para parsear KML de CNRT e importar TODAS las líneas reales
 * 
 * Uso: node backend/scripts/parse-kml-all-lines.js
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

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://GuiaTProject:XW5lpghfqO9xQiDL@guiat.jraeteg.mongodb.net/guiat'

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
      return [lng, lat]
    })
}

const extractMetadata = (placemark) => {
  const lineMatch = placemark.match(/<SimpleData name="Linea">(\d+)<\/SimpleData>/)
  const recorridoMatch = placemark.match(/<SimpleData name="Recorrido">([^<]+)<\/SimpleData>/)
  const sentidoMatch = placemark.match(/<SimpleData name="Sentido">([^<]+)<\/SimpleData>/)
  const empresaMatch = placemark.match(/<SimpleData name="Razon_soci">([^<]+)<\/SimpleData>/)
  
  return {
    linea: lineMatch ? lineMatch[1] : null,
    recorrido: recorridoMatch ? recorridoMatch[1] : null,
    sentido: sentidoMatch ? sentidoMatch[1] : null,
    empresa: empresaMatch ? empresaMatch[1] : null
  }
}

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

const calculateQuadrant = (lat, lng) => {
  const AMBA_BOUNDS = { north: -34.35, south: -34.9, west: -58.7, east: -58.2 }
  if (lat > AMBA_BOUNDS.north || lat < AMBA_BOUNDS.south || lng < AMBA_BOUNDS.west || lng > AMBA_BOUNDS.east) {
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

const extractQuadrants = (coordinates) => {
  const quadrants = new Set()
  for (let i = 0; i < coordinates.length; i += 10) {
    const q = calculateQuadrant(coordinates[i][1], coordinates[i][0])
    if (q) quadrants.add(q)
  }
  return Array.from(quadrants)
}

// Colores predefinidos para las líneas
const LINE_COLORS = {
  '001': '#1E90FF', '002': '#32CD32', '004': '#FF4500', '005': '#8A2BE2',
  '006': '#FF8C00', '007': '#00CED1', '008': '#FF1493', '009': '#2E8B57',
  '010': '#CD853F', '012': '#4682B4', '015': '#D2691E', '017': '#FF6347',
  '019': '#7B68EE', '020': '#3CB371', '021': '#FF69B4', '022': '#20B2AA',
  '023': '#DAA520', '024': '#8B4513', '025': '#4B0082', '026': '#00FF7F',
  '028': '#DC143C', '029': '#FFFAF0', '031': '#4169E1', '032': '#F0E68C',
  '033': '#E6E6FA', '034': '#FFFACD', '036': '#F5DEB3', '037': '#FF4500',
  '039': '#228B22', '041': '#8B008B', '042': '#B22222', '044': '#FF8C00',
  '045': '#4169E1', '046': '#2F4F4F', '047': '#9932CC', '049': '#00BFFF',
  '050': '#FF6347', '051': '#FFD700', '053': '#32CD32', '055': '#8B0000',
  '056': '#800080', '057': '#006400', '059': '#4682B4', '060': '#A0522D',
  '061': '#D2B48C', '062': '#C71585', '063': '#FFA500', '064': '#6B8E23',
  '065': '#FF7F50', '067': '#6495ED', '068': '#DC143C', '070': '#00FA9A',
  '071': '#8FBC8F', '074': '#B8860B', '075': '#5F9EA0', '076': '#FF1493',
  '078': '#CD5C5C', '079': '#006666', '080': '#FF6666', '084': '#4B0082',
  '085': '#FF0000', '086': '#0000FF', '087': '#00FF00', '088': '#FFFF00',
  '090': '#FF00FF', '091': '#00FFFF', '092': '#FF8000', '093': '#8000FF',
  '095': '#FF0080', '096': '#80FF00', '097': '#0080FF', '098': '#FF0080',
  '099': '#800000', '100': '#008000', '101': '#000080', '102': '#808000',
  '103': '#800080', '105': '#004080', '106': '#008040', '107': '#804000',
  '108': '#804080', '109': '#408040', '110': '#404080', '111': '#804040',
  '112': '#408080', '113': '#804080', '114': '#404040', '115': '#808040',
  '117': '#408040', '118': '#804040', '119': '#404080', '123': '#408080',
  '124': '#804040', '126': '#804040', '127': '#404080', '128': '#408040',
  '129': '#808080', '130': '#408040', '132': '#804040', '133': '#404080',
  '134': '#804040', '135': '#404080', '136': '#408040', '140': '#804040',
  '141': '#404080', '143': '#408040', '146': '#804040', '148': '#404080',
  '150': '#408040', '151': '#804040', '152': '#DC143C', '153': '#404080',
  '154': '#408040', '158': '#804040', '159': '#404080', '160': '#408040',
  '161': '#804040', '163': '#404080', '164': '#408040', '165': '#804040',
  '166': '#404080', '168': '#408040', '169': '#804040', '172': '#404080',
  '174': '#408040', '176': '#804040', '177': '#404080', '178': '#408040',
  '179': '#804040', '180': '#404080', '181': '#408040', '182': '#804040',
  '184': '#404080', '185': '#408040', '188': '#804040', '193': '#404080',
  '194': '#408040', '195': '#804040'
}

const getRandomColor = () => {
  const colors = ['#FF6347', '#4682B4', '#32CD32', '#FF8C00', '#9370DB', '#20B2AA', '#FF69B4', '#8B4513']
  return colors[Math.floor(Math.random() * colors.length)]
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Conectado a MongoDB\n')

    const kmlPath = path.join(__dirname, '../../resources/lineas_jn_rmba_cnrt.kml')
    const kmlContent = fs.readFileSync(kmlPath, 'utf-8')
    console.log('✅ KML leído')

    const placemarkRegex = /<Placemark>[\s\S]*?<\/Placemark>/g
    const placemarks = kmlContent.match(placemarkRegex) || []
    console.log(`📍 Total Placemarks: ${placemarks.length}\n`)

    // Agrupar por línea
    const linesData = {}
    for (const pm of placemarks) {
      const meta = extractMetadata(pm)
      if (!meta.linea) continue
      
      if (!linesData[meta.linea]) {
        linesData[meta.linea] = {
          empresa: meta.empresa,
          placemarks: []
        }
      }
      linesData[meta.linea].placemarks.push(pm)
    }

    const lineNumbers = Object.keys(linesData).sort()
    console.log(`📍 Líneas únicas encontradas: ${lineNumbers.length}\n`)

    let totalRoutes = 0
    let totalCoordinates = 0
    let totalStops = 0

    for (const lineNumber of lineNumbers) {
      const lineData = linesData[lineNumber]
      
      console.log(`🔄 Procesando línea ${lineNumber}...`)

      // Crear o actualizar BusLine
      let busLine = await BusLine.findOne({ number: lineNumber })
      if (!busLine) {
        busLine = new BusLine({
          number: lineNumber,
          company: lineData.empresa || 'Empresa Desconocida',
          color: LINE_COLORS[lineNumber] || getRandomColor(),
          type: 'colectivo',
          quadrants: []
        })
      }

      const allQuadrants = new Set()

      // Limpiar rutas anteriores
      await BusRoute.deleteMany({ lineNumber })

      // Procesar cada recorrido
      for (const placemark of lineData.placemarks) {
        const meta = extractMetadata(placemark)
        const coordinates = extractCoordinates(placemark)
        
        if (coordinates.length > 0) {
          const stops = generateStops(coordinates, 20)
          const quadrants = extractQuadrants(coordinates)
          quadrants.forEach(q => allQuadrants.add(q))

          const busRoute = new BusRoute({
            lineId: busLine._id,
            lineNumber,
            recorrido: meta.recorrido || 'A',
            sentido: meta.sentido || 'IDA',
            coordinates,
            stops,
            startPoint: `Inicio ${meta.recorrido || 'A'}`,
            endPoint: `Fin ${meta.recorrido || 'A'}`
          })
          await busRoute.save()

          totalCoordinates += coordinates.length
          totalStops += stops.length
          totalRoutes++
        }
      }

      busLine.quadrants = Array.from(allQuadrants)
      await busLine.save()

      console.log(`   ✅ ${lineNumber}: ${lineData.placemarks.length} recorridos, ${allQuadrants.size} cuadrantes`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ IMPORTACIÓN COMPLETADA')
    console.log('='.repeat(50))
    console.log(`   Líneas importadas: ${lineNumbers.length}`)
    console.log(`   Rutas totales: ${totalRoutes}`)
    console.log(`   Coordenadas totales: ${totalCoordinates}`)
    console.log(`   Paradas totales: ${totalStops}`)

    await mongoose.disconnect()
    console.log('\n✅ Desconectado de MongoDB')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()