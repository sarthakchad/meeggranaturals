
import fs from 'fs';
const filePath = 'd:/meegra naturals/naturals-app/src/data/defaultProducts.js';
const content = fs.readFileSync(filePath, 'utf-8');
const match = content.match(/export const defaultProducts = (\[.*\]);/s);
if (match) {
    const products = JSON.parse(match[1]);
    const formatted = `export const defaultProducts = ${JSON.stringify(products, null, 2)};\n`;
    fs.writeFileSync(filePath, formatted);
    console.log("Formatted defaultProducts.js");
}
