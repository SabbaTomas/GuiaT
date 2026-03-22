import mongoose from 'mongoose'

const busStopSchema = new mongoose.Schema({
  lineId: mongoose.Schema.Types.ObjectId,
  lineNumber: String,
  name: String,
  lat: Number,
  lng: Number,
  order: Number,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('BusStop', busStopSchema)
