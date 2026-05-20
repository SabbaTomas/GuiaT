import mongoose from 'mongoose'

const busRouteSchema = new mongoose.Schema({
  lineId: mongoose.Schema.Types.ObjectId,
  lineNumber: String,
  coordinates: [[Number]], // Array of [lng, lat] pairs
  stops: [{
    name: String,
    lat: Number,
    lng: Number,
    order: Number
  }],
  startPoint: String,
  endPoint: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('BusRoute', busRouteSchema)
