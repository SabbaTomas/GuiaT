# 🗺️ GuíaT - Plan Completo del Proyecto

## Visión General
**GuíaT** es una reimaginación digital de la clásica Guía T de Buenos Aires. La diferencia clave: en lugar de calcular rutas (como Google Maps), **mostramos qué líneas de colectivos pasan por un cuadrante específico** cuando buscas una dirección.

---

## 📋 FASE 1: Setup + Infraestructura [✅ COMPLETADA]

### Objetivos
- Estructura base del proyecto
- Servidores frontend + backend corriendo
- MongoDB conectado
- Todos los endpoints funcionando

### Tasks Completadas
- ✅ Setup de carpetas (`/frontend`, `/backend`)
- ✅ Git repository inicializado
- ✅ Frontend: React 18.2 + Vite 5.0 (puerto 5173)
- ✅ Frontend: Tailwind CSS + Leaflet.js
- ✅ Backend: Express + Node.js (puerto 5000)
- ✅ Backend: MongoDB Atlas conectado
- ✅ 4 Modelos Mongoose creados: BusLine, BusRoute, BusStop, Address
- ✅ 3 Endpoints backend funcionales:
  - `POST /api/search` → geocoding + cuadrante
  - `GET /api/lines/:quadrant` → líneas para cuadrante
  - `GET /api/line/:lineId` → ruta completa con paradas
- ✅ Sistema de cuadrantes: grid 30×30 (A-Z × 1-30)
- ✅ 5 líneas seededadas con cobertura CABA completa
- ✅ CORS testing: 3 búsquedas + renderizado de polylines ✅

### Tecnologías
- **Frontend**: React 18.2, Vite 5.0, Tailwind CSS 3.3, Leaflet 1.9.4, Axios 1.6
- **Backend**: Node.js, Express, MongoDB Mongoose 8.0
- **Database**: MongoDB Atlas (Cloud)
- **APIs**: OpenStreetMap Nominatim (geocoding)

---

## 🎯 FASE 2: Mejoras Funcionales [⏳ EN PROGRESO]

### Objetivo
Agregar funcionalidades clave y mejorar UX

### 2.1 Sistema de Favoritos (localStorage) [⏳ SIGUIENTE]
**Descripción**: Guardar direcciones buscadas y líneas favoritas en la máquina del usuario

**Tasks**:
- [ ] Crear componente `Favorites` en sidebar
- [ ] Guardar dirección cuando se busca
- [ ] Guardar línea cuando se clickea
- [ ] Mostrar historial de búsquedas
- [ ] Botón "❤️ Favorito" en cada línea
- [ ] Poder eliminar favoritos

**Componentes a crear/modificar**:
- `src/components/Favorites.jsx` (nuevo)
- `src/pages/Home.jsx` (agregar lógica localStorage)
- `src/utils/localStorage.js` (utilities)

---

### 2.2 Mostrar Paradas en Mapa [⏳ DESPUÉS]
**Descripción**: Cuando selecciones una línea, mostrar todos los stops (paradas) en el mapa

**Tasks**:
- [ ] Modificar `Map.jsx` para renderizar markers de paradas
- [ ] Mostrar nombre de parada en popup
- [ ] Mostrar orden de parada (1, 2, 3, etc)
- [ ] Diferenciar paradas visuales: color según orden
- [ ] Zoom automático a los stops

**Componentes a modificar**:
- `src/components/Map.jsx`

---

### 2.3 Autocomplete en Búsqueda [⏳ DESPUÉS]
**Descripción**: Sugerencias mientras escribes la dirección

**Tasks**:
- [ ] Integrar Nominatim autocomplete
- [ ] Dropdown con sugerencias debajo del input
- [ ] Seleccionar sugerencia → búsqueda automática
- [ ] Debounce para no saturar API

**Componentes a modificar**:
- `src/components/SearchBar.jsx`

---

## 🎨 FASE 3: UI/UX Refinamiento [⏳ FUTURO]

### Objetivos
- Mejorar design y usabilidad
- Hacer responsive
- Agregar animaciones

### Tasks
- [ ] Indicadores de carga (spinners, skeletons)
- [ ] Mensajes de error claros y accesibles
- [ ] Validación de inputs
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Animaciones smooth (transiciones, fade-ins)
- [ ] Dark mode (opcional)
- [ ] Mejorar colores y tipografía
- [ ] Accessibility (ARIA labels, keyboard navigation)

---

## 🚀 FASE 4: Deploy + Optimización [⏳ FUTURO]

### Objetivos
- Aplicación en producción
- Optimizado y escalable

### Tasks
- [ ] Build production frontend
- [ ] Deploy frontend (Vercel, Netlify, o similar)
- [ ] Deploy backend (Railway, Render, o similar)
- [ ] Optimizar imágenes y assets
- [ ] Minify + compresión
- [ ] Testing (unit tests, integration tests)
- [ ] CI/CD pipeline
- [ ] Monitoreo y logs

---

## 📊 Estado Actual

| Fase | Status | Progreso |
|------|--------|----------|
| Fase 1: Setup | ✅ Completada | 100% |
| Fase 2: Mejoras | ⏳ En progreso | 0% |
| Fase 3: UI/UX | ⏳ Futuro | 0% |
| Fase 4: Deploy | ⏳ Futuro | 0% |

---

## 🗂️ Estructura de Carpetas

```
GuiaT/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Map.jsx
│   │   │   ├── LineSelector.jsx
│   │   │   └── Favorites.jsx (futura)
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── utils/
│   │   │   └── localStorage.js (futura)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   │   ├── BusLine.js
│   │   ├── BusRoute.js
│   │   ├── BusStop.js
│   │   └── Address.js
│   ├── routes/
│   │   ├── search.js
│   │   └── lines.js
│   ├── utils/
│   │   ├── quadrant.js
│   │   └── geocoding.js
│   ├── scripts/
│   │   └── populate_bus_lines.js
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── .env (credentials)
├── .git
└── PLAN.md (este archivo)
```

---

## 🎯 Próximos Pasos

1️⃣ **Fase 2.1 - Sistema de Favoritos** (próximas sesiones)
2️⃣ **Fase 2.2 - Paradas en Mapa**
3️⃣ **Fase 2.3 - Autocomplete**
4️⃣ **Fase 3 - Refinamiento UI/UX**
5️⃣ **Fase 4 - Deploy**

---

## 📞 Notas Técnicas

### Cuadrantes
- Grid 30×30 cubre CABA + AMBA reducida
- Referencias: A-Z (filas) × 1-30 (columnas)
- Ejemplo: "O17" = Almagro

### Bounds AMBA
```
North: -34.35
South: -34.90
East: -58.20
West: -58.70
```

### 5 Líneas Seededadas
1. **152** (Roja) - Transportes Metropolitanos
2. **39** (Verde) - Transportes Metropolitanos
3. **45** (Azul) - Autobuses Chacarita
4. **17** (Naranja) - Tranvías del Sud
5. **95** (Magenta) - Empresa de Transporte Ciudad

---

✨ **Versión**: 0.1.0  
📅 **Última actualización**: Abril 19, 2026
