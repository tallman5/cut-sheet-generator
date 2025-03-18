# @tallman5/cut-sheet-generator

A Node.js package for optimizing material cut lists with optional **kerf (blade thickness)** and **grain direction** considerations. Generates optimized cut layouts and exports them as **SVG** or **PNG**.

## Features
✅ Optimizes material usage with **bin packing** algorithms (TBD)  
✅ Supports **kerf (blade thickness)** adjustments  
✅ Considers **grain direction** (length or width)  
✅ Outputs **SVG/PNG** visual representations  
✅ CLI support coming soon  
✅ Fully written in TypeScript  

## Installation
```sh
npm install @tallman5/cut-sheet-generator
```

## Usage
### Import in JavaScript/TypeScript
```ts
import { optimizeCuts, generateCutSheetSVG, generateCutSheetPNG } from "@tallman5/cut-sheet-generator";

const stock = { length: 500, width: 300, kerf: 5 };
const pieces = [
  { length: 100, width: 100 },
  { length: 150, width: 100 },
  { length: 200, width: 50, grainDirection: "length" }
];

const optimized = optimizeCuts(stock, pieces);
const svgOutput = generateCutSheetSVG(stock, optimized.layout);
console.log(svgOutput);
generateCutSheetPNG(stock, optimized.layout, "cut-sheet.png");
```

## API
### `optimizeCuts(stock: StockMaterial, pieces: Piece[]): { layout: Layout[], waste: number }`
- **`stock`**: `{ length: number, width: number, kerf?: number }` – Stock material dimensions.
- **`pieces`**: `{ length: number, width: number, grainDirection?: "length" | "width" }[]` – Pieces to cut.
- **Returns**: Optimized layout and waste area.

### `generateCutSheetSVG(stock: StockMaterial, layout: Layout[]): string`
- Generates an **SVG** representation of the optimized cut layout.

### `generateCutSheetPNG(stock: StockMaterial, layout: Layout[], outputPath: string)`
- Generates a **PNG** representation and saves it to the given path.

## Example Output
### **SVG Preview**
The library generates an **SVG** that can be previewed in a browser or embedded in reports.

## Roadmap
- [ ] Implement **advanced optimization** (bin-packing / ILP solver)
- [ ] Add **CLI support**
- [ ] Provide **configurable visualization options**
- [ ] Support **multi-stock selection**

## License
MIT

---
Contributions and feature requests are welcome! 🚀
