import { generateCutSheets } from "../src/generator";

test("optimizes basic cuts", () => {
    const stock = { width: 500, length: 300, kerf: 5 };
    const pieces = [
        { width: 100, length: 100 },
        { width: 150, length: 100 },
        { width: 200, length: 50 },
        { width: 100, length: 100 },
        { width: 150, length: 100 },
        { width: 200, length: 50 }
    ];

    const { layout, waste } = generateCutSheets(stock, pieces);

    expect(layout.length).toBe(pieces.length);
    expect(waste).toBeGreaterThanOrEqual(0);
});
