
import fs from 'fs';
import path from 'path';

const filePath = 'd:/meegra naturals/naturals-app/src/data/defaultProducts.js';
const content = fs.readFileSync(filePath, 'utf-8');

// Extract the array part
const match = content.match(/export const defaultProducts = (\[.*\]);/s);
if (!match) {
    console.error("Could not find defaultProducts array");
    process.exit(1);
}

let products = JSON.parse(match[1]);

const mappings = {
    "ELIXER HAIR TONIC ": "/products/WhatsApp_Image_2026-04-11_at_14.00.10_4.jpeg",
    "NATURAL (BLACK) HAIR COLOUR ": "/products/WhatsApp_Image_2026-04-11_at_15.53.09.jpeg",
    "ROSEMARY HAIR TONIC  ": "/products/WhatsApp_Image_2026-04-11_at_15.53.10.jpeg",
    "51 HERBS HAIR OIL": "/products/WhatsApp_Image_2026-04-11_at_15.53.08_1.jpeg",
    "rumi rice water  FACE TONER ": "/products/WhatsApp_Image_2026-03-19_at_13.51.46_1.jpeg",
    "lumi rice FACEWASH": "/products/WhatsApp_Image_2026-03-19_at_13.51.45.jpeg",
    "BRIGHTNIN FACE SERUM WITH rice water ": "/products/WhatsApp_Image_2026-03-19_at_13.51.43_1.jpeg",
    "CUCUMBER MINT FACEWASH": "/products/WhatsApp_Image_2026-03-19_at_13.51.44.jpeg",
    "CUCUMBER MINT FACE TONER ": "/products/WhatsApp_Image_2026-03-19_at_13.51.46.jpeg",
    "CUCUMBER FACE SERUM": "/products/WhatsApp_Image_2026-03-19_at_13.51.43_2.jpeg",
    "NIGHT CREAME ": "/products/WhatsApp_Image_2026-04-11_at_14.00.11_3.jpeg",
    "HYDRATING FACE GEL": "/products/WhatsApp_Image_2026-04-11_at_15.53.07_2.jpeg",
    "KUMKUMADI FACE GEL": "/products/WhatsApp_Image_2026-04-11_at_15.53.06_3.jpeg",
    "ALOE VERA GEL": "/products/WhatsApp_Image_2026-04-11_at_15.53.10_1.jpeg",
    "Rice Ceramide Face Wash": "/products/WhatsApp_Image_2026-04-11_at_15.53.04_2.jpeg",
    " Anti-Acne Face Serum": "/products/WhatsApp_Image_2026-04-11_at_15.53.05.jpeg",
    "Glow Face Serum": "/products/WhatsApp_Image_2026-04-11_at_15.53.05_1.jpeg",
    "sandal wood DE-TAN FACE MASK": "/products/WhatsApp_Image_2026-04-11_at_14.00.12_3.jpeg",
    "BERRY BLISS BODY SCRUB ": "/products/WhatsApp_Image_2026-04-11_at_14.00.12.jpeg",
    "WALNUT FACE & BODY SCRUB ": "/products/WhatsApp_Image_2026-04-11_at_15.53.07.jpeg",
    " Grapefruit Body Wash": "/products/WhatsApp_Image_2026-04-11_at_15.53.06_2.jpeg",
    " Milk & Saffron Body Lotion": "/products/WhatsApp_Image_2026-04-11_at_15.53.06.jpeg",
    " Pop Fresh Antioxidant & Nourishing Body Wash": "/products/WhatsApp_Image_2026-04-11_at_14.00.10_1.jpeg",
    "Blush Peach Body Lotion": "/products/WhatsApp_Image_2026-04-11_at_14.00.10.jpeg",
    "Royale Orchid Lavender & Vitamin C Body Wash": "/products/WhatsApp_Image_2026-04-11_at_14.00.11.jpeg",
    "MILK AND SAFFRON HANDMADE SOAP": "/products/WhatsApp_Image_2026-04-11_at_15.53.03.jpeg",
    "Haldi Chandan Handmade Soap": "/products/WhatsApp_Image_2026-04-11_at_15.53.04.jpeg",
    "Heel Therapy Foot Cream": "/products/WhatsApp_Image_2026-04-11_at_14.00.12_2.jpeg",
    "Ayurvedic Foot Care Cream": "/products/WhatsApp_Image_2026-04-11_at_15.53.08.jpeg",
    "LUMI RICE SKIN CARE KIT ": "/products/Gemini_Generated_Image_feni99feni99feni.jpg",
    "Walnut Scrub + Ayurvedic Foot Care Cream Combo:": "/products/Gemini_Generated_Image_w0mzjow0mzjow0mz.jpg",
    "Bath Care Combo:": "/products/Gemini_Generated_Image_y09bgy09bgy09bgy.jpg",
    "GLOW FACE WASH   ": "/products/WhatsApp_Image_2026-04-11_at_15.53.11.jpeg",
    "limi rice water FACE CREAME": "/products/WhatsApp_Image_2026-04-11_at_14.00.11_1.jpeg", // Best guess
    " cucumber mint FACE CREAME ": "/products/WhatsApp_Image_2026-04-11_at_14.00.10_2.jpeg" // Best guess
};

products = products.map(p => {
    if (mappings[p.name]) {
        p.image_url = mappings[p.name];
    }
    return p;
});

const newContent = `export const defaultProducts = ${JSON.stringify(products)};\n`;
fs.writeFileSync(filePath, newContent);
console.log("Updated defaultProducts.js successfully");
