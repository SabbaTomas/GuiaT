import express from 'express'
import BusLine from '../models/BusLine.js'
import BusRoute from '../models/BusRoute.js'

const router = express.Router()

router.get('/lines/:quadrant', async (req, res) => {
  try {
    const { quadrant } = req.params

    // Find all bus lines that pass through this quadrant
    const lines = await BusLine.find({
      quadrants: quadrant
    })

    if (!lines.length) {
      return res.json({ lines: [] })
    }

    // Enrich with route data
    const enrichedLines = await Promise.all(
      lines.map(async (line) => {
        const route = await BusRoute.findOne({ lineNumber: line.number })
        return {
          id: line._id,
          number: line.number,
          company: line.company,
          color: line.color,
          type: line.type,
          route: route ? {
            coordinates: route.coordinates,
            stops: route.stops
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

    const route = await BusRoute.findOne({ lineNumber: line.number })

    res.json({
      line: {
        id: line._id,
        number: line.number,
        company: line.company,
        color: line.color,
        type: line.type
      },
      route: route ? {
        coordinates: route.coordinates,
        stops: route.stops,
        startPoint: route.startPoint,
        endPoint: route.endPoint
      } : null
    })
  } catch (error) {
    console.error('Line detail error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
