import { writeFileSync } from "fs";
import {  generateCutSheetPngAsync, generateCutSheetsAsync, generateCutSheetSvgAsync, IGeneratorConfig, IGeneratorResult } from "../src/generator";

test("generates basic cut sheet", async () => {
    const generatorConfig: IGeneratorConfig = {
        stockMaterials: Array.from({ length: 8 }, () => ({ length: 96, width: 48, quantity: 8 })),
        pieces: [
            // { length: 31.25, width: 22, quantity: 8 },   // cab side
            // { length: 19.5, width: 3.5, quantity: 24 },  // stretcher
            // { length: 31.25, width: 3.5, quantity: 4 },     // cab brace

            { length: 22.25, width: 20, quantity: 24 },     // drawer bottom

            { length: 19.375, width: 1.1875, quantity: 8 }, // 1U dado
            { length: 20.75, width: 1.1875, quantity: 8 },  // 1U rabbet
            { length: 18.375, width: 1.1875, quantity: 4 }, // 1U false front
            
            { length: 19.375, width: 2.875, quantity: 8 }, // 2U dado
            { length: 20.75, width: 2.875, quantity: 8 },  // 2U rabbet
            { length: 18.375, width: 2.875, quantity: 4 }, // 2U false front
            
            { length: 19.375, width: 4.625, quantity: 8 }, // 3U dado
            { length: 20.75, width: 4.625, quantity: 8 },  // 3U rabbet
            { length: 18.375, width: 4.625, quantity: 4 }, // 3U false front
            
            { length: 19.375, width: 6.375, quantity: 8 }, // 4U dado
            { length: 20.75, width: 6.375, quantity: 8 },  // 4U rabbet
            { length: 18.375, width: 6.375, quantity: 4 }, // 4U false front
            
            { length: 19.375, width: 8.125, quantity: 8 }, // 5U dado
            { length: 20.75, width: 8.125, quantity: 8 },  // 5U rabbet
            { length: 18.375, width: 8.125, quantity: 4 }, // 5U false front
        ],
        considerGrain: false,
        kerf: 0.125,
    };

    let csv = "Length,Width,Qty,Enabled,Grain direction\r\n";
    for (const piece of generatorConfig.pieces) {
        csv += `${piece.length},${piece.width},1,TRUE,v\r\n`;
    }
    writeFileSync("./tests/output/cut-sheet.csv", csv);

    const result: IGeneratorResult = await generateCutSheetsAsync(generatorConfig);

    const totalQuantity = generatorConfig.pieces.reduce((sum, piece) => sum + piece.quantity, 0);
    expect(result.layout.length).toBe(totalQuantity);
    expect(result.waste).toBeGreaterThanOrEqual(0);

    const svg = await generateCutSheetSvgAsync(generatorConfig.stockMaterials, result.layout);
    writeFileSync("./tests/output/cut-sheet.svg", svg);

    const png = await generateCutSheetPngAsync(generatorConfig.stockMaterials, result.layout);
    writeFileSync("./tests/output/cut-sheet.png", png);
});
