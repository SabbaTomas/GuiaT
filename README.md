# 🗺️ GuíaT - App Web

Una reimaginación digital de la clásica Guía T de Buenos Aires. Busca una dirección, descubre el cuadrante y ve qué líneas de transporte pasan por ahí.

## 🎯 Características (MVP)

- ✅ Búsqueda de direcciones en CABA + AMBA
- ✅ Sistema dinámico de cuadrantes (estilo Guía T)
- ✅ Lista de líneas de colectivos por cuadrante
- ✅ Visualización de recorridos completos en mapa
- ✅ Guardar favoritos (localStorage)

## 🚀 Quick Start

### 1. Instalación

```bash
# Clone el repositorio
cd GuiaT

# Instalar dependencias del frontend
cd frontend
npm install

# En otra terminal, instalar dependencias del backend
cd backend
npm install
```

### 2. Configurar MongoDB

**Opción A: MongoDB Local**
```bash
# Asegúrate de que MongoDB esté corriendo localmente
# Luego el .env usa: MONGODB_URI=mongodb://localhost:27017/guiat
```

**Opción B: MongoDB Atlas (cloud)**
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. En el `.env`, reemplaza:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/guiat
   ```

### 3. Correr la aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend corre en http://localhost:5000
```

**Terminal 2 - Cargar datos iniciales:**
```bash
cd backend
npm run populate
# Esto popula la BD con 5 líneas de colectivos de ejemplo
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend corre en http://localhost:3000
```

### 4. Usar la app

1. Ve a http://localhost:3000
2. Busca una dirección (ej: "Av. Rivadavia 1234")
3. Se mostrará el cuadrante y las líneas que pasan por ahí
4. Selecciona una línea para ver el recorrido completo en el mapa

## 📁 Estructura del Proyecto

```
GuiaT/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/           # Páginas (Home.jsx)
│   │   ├── components/      # Componentes (SearchBar, Map, LineSelector)
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilidades
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node + Express
│   ├── routes/              # Endpoints (/api/search, /api/lines)
│   ├── models/              # Mongoose schemas
│   ├── utils/               # Funciones auxiliares
│   ├── scripts/             # Scripts (populate_bus_lines.js)
│   ├── server.js            # Express app
│   ├── db.js                # MongoDB connection
│   └── package.json
│
├── .env                     # Configuración (MongoDB URI, puertos, etc)
├── .gitignore
└── README.md
```

## 🔧 Endpoints Backend

### Search
- `POST /api/search` - Buscar dirección
  - Body: `{ "address": "Av. Rivadavia 1234" }`
  - Response: `{ address, lat, lng, quadrant }`

### Lines
- `GET /api/lines/:quadrant` - Obtener líneas de un cuadrante
  - Response: `{ lines: [{ id, number, company, color, route }] }`

- `GET /api/line/:lineId` - Obtener detalles de una línea
  - Response: `{ line: {...}, route: { coordinates, stops, startPoint, endPoint } }`

## 📊 Sistema de Cuadrantes

- **Grid**: 30×30 cuadrantes
- **Cobertura**: CABA + AMBA reducida
- **Referencias**: A-Z (filas) × 1-30 (columnas)
- **Ejemplo**: "C4", "D5", "Z1"

Función clave: `getQuadrant(lat, lng)` → retorna string como "C4"

## 🚌 Líneas de Colectivos (Datos)

En el MVP incluimos **5 líneas de ejemplo semisimuladas**:
- 152 (Transportes Metropolitanos)
- 39 (Transportes Metropolitanos)
- 45 (Autobuses Chacarita)
- 17 (Tranvías del Sud)
- 95 (Empresa de Transporte Ciudad)

Cada línea tiene:
- Número, empresa, tipo, color
- Cuadrantes que recorre
- Coordenadas del recorrido
- Lista de paradas

**Para v1.1:** integrar datos reales (GTFS, Google Transit, etc)

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + Tailwind CSS + Leaflet |
| Backend | Node.js + Express |
| Database | MongoDB |
| Geocoding | OpenStreetMap Nominatim (gratuito) |

## 🐛 Troubleshooting

### "Cannot find module" en backend
```bash
cd backend
npm install
```

### MongoDB no conecta
- Verifica que MongoDB esté corriendo (local o Atlas)
- Revisa el MONGODB_URI en `.env`

### Frontend no conecta a backend
- Verifica que backend esté corriendo en puerto 5000
- Revisa CORS en `server.js`

### Mapa no aparece
- Asegúrate de tener conexión a internet (Leaflet + OSM)
- Abre consola (F12) para ver errores

## 📝 Próximos Pasos (Fase 2+)

- [ ] Búsqueda por intersección (calle + calle)
- [ ] Integrar datos reales de líneas (GTFS)
- [ ] Subte/Tren (rojo, azul, verde, etc)
- [ ] Modo "Guía T Nostalgia" (estética vintage)
- [ ] App mobile nativa
- [ ] Sistema de favoritos con servidor (login)
- [ ] Modo offline avanzado

## 📧 Contacto / Contribuciones

Este es un proyecto de aprendizaje. Siéntete libre de extender, forkar y mejorar.

---

**Hecho con ❤️ para los porteños que aman la Guía T** 📍
