# GuíaT - Custom Instructions

## Proyecto
GuíaT es una app web full-stack (React + Node/Express + MongoDB) que permite buscar direcciones en Buenos Aires y ver qué líneas de colectivos pasan por ahí.

## Stack
- Frontend: React 18.2 + Vite + Tailwind CSS + Leaflet
- Backend: Node.js + Express + Mongoose
- APIs: OpenStreetMap Nominatim (geocoding)

## Estructura
```
frontend/src/
  ├── components/   (SearchBar, Map, LineSelector, Favorites)
  ├── pages/         (Home.jsx)
  └── utils/         (localStorage.js)

backend/
  ├── routes/        (search.js, lines.js)
  ├── models/        (BusLine, BusRoute, Address)
  └── utils/        (quadrant.js, geocoding.js)
```

## Conceptos clave
- Sistema de cuadrantes: Grid 30×30 (A-Z × 1-30)
- Flujo: SearchBar → /api/search → geocoding → cuadrante → /api/lines → LineSelector → Map

## Estilo de respuesta
- Para principiantes: explicar código paso a paso
- Ser conciso, responder directo
- Usar español

## Comandos útiles
- Backend: `cd backend && npm run dev` (puerto 5000)
- Frontend: `cd frontend && npm run dev` (puerto 5173)
- Poblar DB: `cd backend && npm run populate`