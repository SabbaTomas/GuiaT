# 🗺️ Fase 2 - ANEXO: Integración de Rutas Reales

## Objetivo
Reemplazar datos dummy de la línea 152 con rutas reales obtenidas del **archivo KML oficial del CNRT (Comisión Nacional de Regulación del Transporte)**.

---

## Datos Encontrados

### Archivo KML
- **Ubicación**: `/resources/lineas_jn_rmba_cnrt.kml`
- **Fuente**: Datos oficiales del transporte público de RMBA
- **Contenido**: 6 registros para Línea 152

### Línea 152 - Especificaciones

| Propiedad | Valor |
|-----------|-------|
| **Línea** | 152 |
| **Empresa** | Empresa Tandilense SACIFI y de F |
| **Jurisdicción** | NACIONAL |
| **Recorridos** | 3 (A, B, C) |
| **Sentidos/Recorrido** | 2 (IDA, VUELTA) |
| **Total Rutas** | 6 |

### Recorridos Disponibles

#### 1️⃣ Recorrido A
- **IDA**: 400+ puntos de coordenadas
- **VUELTA**: 400+ puntos de coordenadas
- Ruta: Desde el oeste hasta el este/sur

#### 2️⃣ Recorrido B  
- **IDA**: 400+ puntos de coordenadas
- **VUELTA**: 400+ puntos de coordenadas
- Ruta: Variante alternativa

#### 3️⃣ Recorrido C
- **IDA**: 400+ puntos de coordenadas
- **VUELTA**: 400+ puntos de coordenadas
- Ruta: Variante alternativa

---

## Implementación

### Paso 1: Parsear KML
Crear `backend/scripts/parse-kml-line-152.js` que:
- Lee el archivo KML
- Extrae los Placemarks de la línea 152
- Convierte coordenadas de (lon, lat) a (lat, lon)
- Genera paradas cada 15-20 coordenadas (equilibrio)

### Paso 2: Actualizar Base de Datos
- Limpiar línea 152 antigua
- Insertar 3 nuevas líneas (con recorrido A, B, C)
- Cada línea tendrá:
  - 20-30 paradas principales
  - Ruta completa con 400+ puntos
  - Coordenadas reales del CNRT

### Paso 3: Testear
- Buscar dirección en el recorrido de la línea 152
- Verificar que se muestra la ruta correcta en el mapa
- Ver paradas distribuidas uniformemente

---

## Modelo de Datos Actualizado

### BusLine (actualizado)
```javascript
{
  number: 152,
  color: '#DC143C', // Rojo Carmesí
  company: 'Empresa Tandilense',
  routes: [
    {
      id: new ObjectId(),
      recorrido: 'A',
      sentido: 'IDA',
      coordinates: [ [lon, lat], ... ], // 400+ puntos
      stops: [
        {
          order: 1,
          name: 'Pte. Roque S. Peña / Primera Junta',
          lat: -34.6420,
          lng: -58.3769
        },
        ...
      ]
    },
    ...
  ]
}
```

---

## Próximos Pasos

1. ✅ Confirmar que tenemos el archivo KML listo
2. ⏳ Crear script de parseo
3. ⏳ Ejecutar script y validar datos
4. ⏳ Testear en la app (búsquedas + mapa)
5. ⏳ Si todo funciona → Agregar más líneas reales (39, 45, 17, 95)

---

## Notas

- **No se necesita token de OpenStreetMap** - usamos datos del CNRT
- **Paradas generadas automáticamente** - cada N-ésimo punto
- **Nombres de paradas** - se pueden enriquecer con GeoCoding inverso si lo necesitamos
- **Color de línea 152** - Rojo Carmesí (según datos oficiales)

---

✨ **Estado**: Listo para parsear el KML  
📅 **Última actualización**: Mayo 19, 2026
