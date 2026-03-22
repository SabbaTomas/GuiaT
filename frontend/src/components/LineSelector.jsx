import React from 'react'

export default function LineSelector({ lines, selectedLine, onSelectLine }) {
  const colors = [
    '#FF0000', '#00AA00', '#0000FF', '#FF8800', '#FF0099',
    '#00BBBB', '#FFBB00', '#884400', '#00FF00', '#000088'
  ]

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">Líneas 🚌</h3>
      
      {lines.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Busca una dirección para ver las líneas que pasan por ese cuadrante.
        </p>
      ) : (
        <ul className="space-y-2">
          {lines.map((line, idx) => (
            <li
              key={line.id || idx}
              onClick={() => onSelectLine(line)}
              className={`p-3 rounded cursor-pointer transition ${
                selectedLine?.id === line.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                >
                  {line.number}
                </div>
                <div>
                  <p className="font-bold">{line.number}</p>
                  <p className="text-xs opacity-75">{line.company}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
