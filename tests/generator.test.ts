import { writeFileSync } from "fs";
import { generateCutSheetsAsync, generateCutSheetSvgAsync, generateLegendAsync } from "../src/cut-sheet-generator/generator";
import { IGeneratorConfig, IGeneratorResult } from "../src/cut-sheet-generator/models";

describe('Generator Functions', () => {
    let generatorConfig: IGeneratorConfig;
    let generatorResult: IGeneratorResult;

    beforeAll(() => {
        generatorConfig = {
            stockMaterials: [{ length: 96, width: 48, quantity: 8 }],
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
    });

    test("generates basic cut sheet", async () => {
        generatorResult = await generateCutSheetsAsync(generatorConfig);

        const totalQuantity = generatorConfig.pieces.reduce((sum, piece) => sum + piece.quantity, 0);
        expect(generatorResult.layout.length).toBe(totalQuantity);
        expect(generatorResult.waste).toBeGreaterThanOrEqual(0);

        const svg = await generateCutSheetSvgAsync(generatorConfig.stockMaterials, generatorResult.layout);
        writeFileSync("./tests/output/cut-sheet.svg", svg);

        const legend = await generateLegendAsync(generatorResult.layout);
        expect(legend.length).toBe(generatorConfig.pieces.length);
    });

    test("generates an SVG", async () => {
        const svg = await generateCutSheetSvgAsync(generatorConfig.stockMaterials, generatorResult.layout);
        writeFileSync("./tests/output/cut-sheet.svg", svg);
        expect(svg.length).toBeGreaterThan(10);
    });

    test("generates a legend", async () => {
        const legend = await generateLegendAsync(generatorResult.layout);
        expect(legend.length).toBe(generatorConfig.pieces.length);
    });
});
