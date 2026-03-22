import express from 'express'
import Address from '../models/Address.js'
import { geocodeAddress } from '../utils/geocoding.js'
import { getQuadrant } from '../utils/quadrant.js'

const router = express.Router()

router.post('/search', async (req, res) => {
  try {
    const { address } = req.body

    if (!address) {
      return res.status(400).json({ error: 'Address is required' })
    }

    // Try to geocode the address
    const geocoded = await geocodeAddress(address)
    
    if (!geocoded) {
      return res.status(404).json({ error: 'Address not found' })
    }

    // Get quadrant
    const quadrant = getQuadrant(geocoded.lat, geocoded.lng)
    
    if (!quadrant) {
      return res.status(400).json({ error: 'Address is outside coverage area' })
    }

    // Save to DB for faster future lookups
    const addressDoc = new Address({
      fullAddress: geocoded.address,
      lat: geocoded.lat,
      lng: geocoded.lng,
      quadrant: quadrant
    })

    await addressDoc.save()

    res.json({
      address: geocoded.address,
      lat: geocoded.lat,
      lng: geocoded.lng,
      quadrant: quadrant
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/quadrant/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params
    const quadrant = getQuadrant(parseFloat(lat), parseFloat(lng))

    if (!quadrant) {
      return res.status(400).json({ error: 'Coordinates outside coverage area' })
    }

    res.json({ quadrant })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
