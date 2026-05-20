import fs from 'fs';

const content = fs.readFileSync('./resources/lineas_jn_rmba_cnrt.kml', 'utf-8');
const lineRegex = /<SimpleData name="Linea">(\d+)<\/SimpleData>/g;
const lines = new Set();
let match;
while ((match = lineRegex.exec(content)) !== null) {
  lines.add(match[1]);
}

console.log('Total líneas únicas:', lines.size);
console.log('Líneas:', Array.from(lines).sort().join(', '));