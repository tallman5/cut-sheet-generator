import { writeFileSync } from "fs";
import { generateCutSheets, generateCutSheetSVG } from "../src/generator";
import { IGeneratorConfig, IGeneratorResult } from "../src/models";

test("generates basic cut sheet", () => {
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
        kerf: 5
    };

    const result: IGeneratorResult = generateCutSheets(genConfig);

    expect(result.layout.length).toBe(genConfig.pieces.length);
    expect(result.waste).toBeGreaterThanOrEqual(0);

    const svg = generateCutSheetSVG(genConfig.stockMaterials, result.layout);
    writeFileSync("cut-sheet.svg", svg);
});
