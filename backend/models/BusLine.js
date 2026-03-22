import mongoose from 'mongoose'

const busLineSchema = new mongoose.Schema({
  number: String,
  company: String,
  type: { type: String, default: 'colectivo' },
  color: String,
  quadrants: [String],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('BusLine', busLineSchema)
