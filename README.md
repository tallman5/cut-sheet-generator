# @tallman5/cut-sheet-generator

A Node.js package for optimizing material cut lists with optional **kerf (blade thickness)** and **grain direction** considerations. Generates optimized cut layouts and exports them as **SVG**.

## Features
✅ Optimizes material usage with **bin packing** algorithms (TBD)  
✅ Supports **kerf (blade thickness)** adjustments  
✅ Considers **grain direction** (length or width)  
✅ Outputs **SVG** visual representations  
✅ CLI support coming soon  
✅ Fully written in TypeScript  

## Installation
```sh
npm install @tallman5/cut-sheet-generator
```

## Usage
### Import in JavaScript/TypeScript
```ts
import { generateCutSheets, generateCutSheetSvg, IGeneratorConfig, IGeneratorResult } from "@tallman5/cut-sheet-generator";

const stockMaterials = [
    { length: 500, width: 300 },
    { length: 600, width: 400 }
];
const pieces = [
    { length: 100, width: 100 },
    { length: 150, width: 100 },
    { length: 200, width: 50 }
];

const genConfig: IGeneratorConfig = {
    stockMaterials,
    pieces,
    considerGrain: false,
    kerf: 2
};

const result: IGeneratorResult = generateCutSheets(genConfig);
const svg = generateCutSheetSVG(genConfig.stockMaterials, result.layout);
console.log(svg);
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
Cut Sheet Generator © 2025 by Joseph McGurkin is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1)

<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="">&nbsp;<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="">&nbsp;<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt="">&nbsp;<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt="">

---
Contributions and feature requests are welcome! 🚀
