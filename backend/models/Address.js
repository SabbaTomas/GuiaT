import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  street: String,
  number: Number,
  fullAddress: String,
  lat: Number,
  lng: Number,
  quadrant: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Address', addressSchema)
