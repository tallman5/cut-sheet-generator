# @tallman5/cut-sheet-generator

## Overview
The **Cut Sheet Generator** is a JavaScript/TypeScript module that efficiently arranges pieces onto stock materials while minimizing waste and reducing the number of cuts. The algorithm utilizes a **best-fit guillotine packing strategy**, considers **grain direction**, and generates **visual representations** (SVG) for layout visualization.

## Features
1. **Optimized Stock Cutting**: Uses a best-fit algorithm to minimize waste.
1. **Kerf Consideration**: Accounts for blade thickness in cutting calculations.
1. **Grain Direction Support**: Ensures pieces are placed according to material grain direction.
1. **Legend Generation**: Provides a legend mapping piece dimensions to colors.
1. **SVG Visualization**: Generates graphical representations of cut layouts.

## Installation
```sh
npm install @tallman5/cut-sheet-generator
```

## Usage
### Importing the Module
```typescript
import { generateCutSheetsAsync, generateCutSheetSvgAsync, generateCutSheetPngAsync, generateLegendAsync } from "@tallman5/cut-sheet-generator";
```

### Input Data Structure
#### Example Configuration:
```typescript
const config = {
  stockMaterials: [
    { length: 96, width: 48, quantity: 1 }
  ],
  pieces: [
    { length: 24, width: 12, quantity: 4 },
    { length: 36, width: 24, quantity: 2 }
  ],
  kerf: 0.125,
  considerGrain: true
};
```

### Generating Cut Sheets
```typescript
(async () => {
  const result = await generateCutSheetsAsync(config);
  console.log("Layout:", result.layout);
  console.log("Waste:", result.waste);
})();
```

### Generating SVG Visualization
```typescript
(async () => {
  const svg = await generateCutSheetSvgAsync(config.stockMaterials, result.layout);
  console.log(svg);
})();
```

### Generating a Legend
```typescript
(async () => {
  const legend = await generateLegendAsync(result.layout);
  console.log(legend);
})();
```

## License
Cut Sheet Generator © 2025 by tallman5 is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1)

<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="">&nbsp;<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="">&nbsp;<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt="">&nbsp;<img style="height:22px!important;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt="">

## Contributions
Contributions are welcome! Feel free to open issues and submit pull requests.
