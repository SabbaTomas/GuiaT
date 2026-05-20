# GuíaT - Agentes y Comandos Útiles

## 📋 Comandos del Proyecto

```bash
# Backend
cd backend && npm run dev      # Iniciar servidor (puerto 5000)
cd backend && npm run populate # Poblar base de datos

# Frontend
cd frontend && npm run dev     # Iniciar app (puerto 5173)
```

---

## 🤖 Cómo Usar Agentes en Esta Sesión

### Explorador (buscar archivos/código)
Escribí lo que necesitás buscar y puedo explorar el codebase.

### Explicador (para aprender)
Pedime que explique cualquier archivo. Voy segmentando en partes pequeñas.

---

## 🔧 Configuración de Herramientas Externas

### VS Code - Copilot
- Archivo de instrucciones: `.github/copilot-instructions.md`
- Para activar: Settings → GitHub Copilot → Enable

### Warp (terminal con AI)
- Warp tiene AI Commands integrado
- Escribí `?` en la terminal para ver opciones de AI

---

## 📁 Estructura del Proyecto

```
GuiaT/
├── frontend/src/
│   ├── components/      # SearchBar, Map, LineSelector, Favorites
│   ├── pages/          # Home.jsx
│   ├── utils/          # localStorage.js
│   └── App.jsx, main.jsx
├── backend/
│   ├── routes/         # /api/search, /api/lines
│   ├── models/        # BusLine, BusRoute, BusStop, Address
│   ├── utils/         # quadrant.js, geocoding.js
│   └── server.js
├── AGENTS.md           # Este archivo
└── .github/copilot-instructions.md  # Config Copilot
```

---

## 🎯 Tips

1. **Para aprender**: pedime que explique archivos específicos parte por parte
2. **Para buscar**: decime qué necesitás y busco en el código
3. **Para modificar**: describí lo que querés hacer y lo implemento