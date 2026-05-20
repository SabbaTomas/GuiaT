import mongoose from 'mongoose'
import dotenv from 'dotenv'
import BusLine from '../models/BusLine.js'
import BusRoute from '../models/BusRoute.js'
import { connectDB } from '../db.js'

dotenv.config()

// Sample bus lines data (real CABA/AMBA lines with semi-realistic routes)
const busLinesData = [
  {
    number: '152',
    company: 'Transportes Metropolitanos',
    type: 'colectivo',
    color: '#FF0000',
    quadrants: ['N12', 'N13', 'N14', 'N15', 'N16', 'N17', 'O12', 'O13', 'O14', 'O15', 'O16', 'O17', 'O18', 'O19', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21'],
    route: {
      startPoint: 'Primera Junta',
      endPoint: 'Quilmes',
      // Sample coordinates (lon, lat)
      coordinates: [
        [-58.38, -34.62], [-58.38, -34.622], [-58.377, -34.625],
        [-58.375, -34.628], [-58.372, -34.631], [-58.369, -34.635],
        [-58.365, -34.638], [-58.362, -34.642], [-58.359, -34.645],
        [-58.356, -34.648], [-58.352, -34.652], [-58.349, -34.656]
      ],
      stops: [
        { name: 'Primera Junta', lat: -34.62, lng: -58.38, order: 1 },
        { name: 'Av. Rivadavia', lat: -34.625, lng: -58.377, order: 2 },
        { name: 'Congreso', lat: -34.631, lng: -58.372, order: 3 },
        { name: 'Plaza Once', lat: -34.638, lng: -58.365, order: 4 },
        { name: 'Estación Constitución', lat: -34.645, lng: -58.359, order: 5 },
        { name: 'Quilmes', lat: -34.656, lng: -58.349, order: 6 }
      ]
    }
  },
  {
    number: '39',
    company: 'Transportes Metropolitanos',
    type: 'colectivo',
    color: '#00AA00',
    quadrants: ['L14', 'L15', 'L16', 'L17', 'M14', 'M15', 'M16', 'M17', 'N14', 'N15', 'N16', 'N17', 'O14', 'O15', 'O16', 'O17', 'P15', 'P16', 'P17'],
    route: {
      startPoint: 'Puerto Madero',
      endPoint: 'Villa Crespo',
      coordinates: [
        [-58.365, -34.605], [-58.368, -34.608], [-58.371, -34.612],
        [-58.374, -34.616], [-58.377, -34.620], [-58.380, -34.625],
        [-58.383, -34.630]
      ],
      stops: [
        { name: 'Puerto Madero', lat: -34.605, lng: -58.365, order: 1 },
        { name: 'San Telmo', lat: -34.612, lng: -58.371, order: 2 },
        { name: 'Retiro', lat: -34.620, lng: -58.377, order: 3 },
        { name: 'Casa Rosada', lat: -34.625, lng: -58.380, order: 4 },
        { name: 'Villa Crespo', lat: -34.630, lng: -58.383, order: 5 }
      ]
    }
  },
  {
    number: '45',
    company: 'Autobuses Chacarita',
    type: 'colectivo',
    color: '#0000FF',
    quadrants: ['O18', 'O19', 'O20', 'O21', 'P18', 'P19', 'P20', 'P21', 'Q19', 'Q20', 'Q21', 'Q22', 'Q23'],
    route: {
      startPoint: 'Estación Chacarita',
      endPoint: 'Acoyte',
      coordinates: [
        [-58.450, -34.58], [-58.447, -34.585], [-58.444, -34.590],
        [-58.441, -34.595], [-58.438, -34.600], [-58.435, -34.605]
      ],
      stops: [
        { name: 'Chacarita', lat: -34.58, lng: -58.450, order: 1 },
        { name: 'Palermo', lat: -34.590, lng: -58.444, order: 2 },
        { name: 'Parque Centenario', lat: -34.600, lng: -58.438, order: 3 },
        { name: 'Acoyte', lat: -34.605, lng: -58.435, order: 4 }
      ]
    }
  },
  {
    number: '17',
    company: 'Tranvías del Sud',
    type: 'colectivo',
    color: '#FF8800',
    quadrants: ['P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18'],
    route: {
      startPoint: 'Flores',
      endPoint: 'Ramos Mejía',
      coordinates: [
        [-58.520, -34.615], [-58.517, -34.620], [-58.514, -34.625],
        [-58.511, -34.630], [-58.508, -34.635]
      ],
      stops: [
        { name: 'Flores', lat: -34.615, lng: -58.520, order: 1 },
        { name: 'Primera Junta', lat: -34.625, lng: -58.514, order: 2 },
        { name: 'Vélez Sarsfield', lat: -34.635, lng: -58.508, order: 3 }
      ]
    }
  },
  {
    number: '95',
    company: 'Empresa de Transporte Ciudad',
    type: 'colectivo',
    color: '#FF0099',
    quadrants: ['K10', 'K11', 'K12', 'K13', 'L10', 'L11', 'L12', 'L13', 'L14', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'N12', 'N13', 'N14', 'N15'],
    route: {
      startPoint: 'Zona Norte',
      endPoint: 'Centro',
      coordinates: [
        [-58.380, -34.50], [-58.383, -34.515], [-58.386, -34.530],
        [-58.389, -34.545], [-58.392, -34.560]
      ],
      stops: [
        { name: 'San Isidro', lat: -34.50, lng: -58.380, order: 1 },
        { name: 'Vicente López', lat: -34.530, lng: -58.386, order: 2 },
        { name: 'Centro CABA', lat: -34.560, lng: -58.392, order: 3 }
      ]
    }
  }
]

async function populateBusLines() {
  try {
    await connectDB()
    
    console.log('🚀 Populating bus lines...')
    
    // Clear existing data
    await BusLine.deleteMany({})
    await BusRoute.deleteMany({})
    
    // Insert bus lines
    for (const lineData of busLinesData) {
      const busLine = new BusLine({
        number: lineData.number,
        company: lineData.company,
        type: lineData.type,
        color: lineData.color,
        quadrants: lineData.quadrants
      })
      
      const savedLine = await busLine.save()
      
      // Create route for this line
      const busRoute = new BusRoute({
        lineId: savedLine._id,
        lineNumber: lineData.number,
        coordinates: lineData.route.coordinates,
        stops: lineData.route.stops,
        startPoint: lineData.route.startPoint,
        endPoint: lineData.route.endPoint
      })
      
      await busRoute.save()
      
      console.log(`✅ Line ${lineData.number} created`)
    }
    
    console.log('✨ All bus lines populated successfully!')
    mongoose.connection.close()
  } catch (error) {
    console.error('❌ Error populating bus lines:', error)
    process.exit(1)
  }
}

populateBusLines()
