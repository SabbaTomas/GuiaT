import express from 'express'
import BusLine from '../models/BusLine.js'
import BusRoute from '../models/BusRoute.js'

const router = express.Router()

router.get('/lines/:quadrant', async (req, res) => {
  try {
    const { quadrant } = req.params
    console.log(`[LINES] Searching for quadrant: ${quadrant}`)

    // Find all bus lines that pass through this quadrant
    const lines = await BusLine.find({
      quadrants: quadrant
    })
    console.log(`[LINES] Found ${lines.length} lines for quadrant ${quadrant}:`, lines.map(l => l.number))

    if (!lines.length) {
      return res.json({ lines: [] })
    }

    // Enrich with route data (primer recorrido disponible por línea)
    const enrichedLines = await Promise.all(
      lines.map(async (line) => {
        const route = await BusRoute.findOne({ lineNumber: line.number })
          .sort({ recorrido: 1, sentido: 1 })

        return {
          id: line._id,
          number: line.number,
          company: line.company,
          color: line.color,
          type: line.type,
          route: route ? {
            coordinates: route.coordinates,
            stops: route.stops,
            recorrido: route.recorrido,
            sentido: route.sentido
          } : null
        }
      })
    )

    res.json({ lines: enrichedLines })
  } catch (error) {
    console.error('Lines error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/line/:lineId', async (req, res) => {
  try {
    const { lineId } = req.params

    const line = await BusLine.findById(lineId)
    if (!line) {
      return res.status(404).json({ error: 'Line not found' })
    }

    const routes = await BusRoute.find({ lineNumber: line.number })
      .sort({ recorrido: 1, sentido: 1 })

    const primaryRoute = routes.length ? routes[0] : null

    res.json({
      line: {
        id: line._id,
        number: line.number,
        company: line.company,
        color: line.color,
        type: line.type
      },
      route: primaryRoute ? {
        coordinates: primaryRoute.coordinates,
        stops: primaryRoute.stops,
        recorrido: primaryRoute.recorrido,
        sentido: primaryRoute.sentido,
        startPoint: primaryRoute.startPoint,
        endPoint: primaryRoute.endPoint
      } : null,
      routes: routes.map(route => ({
        id: route._id,
        recorrido: route.recorrido,
        sentido: route.sentido,
        startPoint: route.startPoint,
        endPoint: route.endPoint
      }))
    })
  } catch (error) {
    console.error('Line detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
