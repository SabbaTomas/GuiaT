import axios from 'axios'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

export async function geocodeAddress(address) {
  try {
    const response = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: address + ', Buenos Aires, Argentina',
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'GuiaT-App (https://github.com/user/guiat)'
      }
    })

    if (response.data && response.data.length > 0) {
      const result = response.data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name
      }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error.message)
    return null
  }
}

export async function reverseGeocode(lat, lng) {
  try {
    const response = await axios.get(`${NOMINATIM_URL}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json'
      },
      headers: {
        'User-Agent': 'GuiaT-App (https://github.com/user/guiat)'
      }
    })

    if (response.data) {
      return response.data.address
    }
    return null
  } catch (error) {
    console.error('Reverse geocoding error:', error.message)
    return null
  }
}
