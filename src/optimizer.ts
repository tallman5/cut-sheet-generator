import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

export type StockMaterial = { length: number; width: number; kerf?: number };
export type Piece = { length: number; width: number; grainDirection?: "length" | "width" };
export type Layout = { x: number; y: number; length: number; width: number };

export function optimizeCuts(stock: StockMaterial, pieces: Piece[]): { layout: Layout[], waste: number } {
  let layout: Layout[] = [];
  let waste = 0;
  let kerf = stock.kerf || 0;

  let x = 0, y = 0, rowWidth = 0;
  for (let piece of pieces) {
    let pieceLength = piece.length;
    let pieceWidth = piece.width;

    if (piece.grainDirection === "width" && piece.width > piece.length) {
      [pieceLength, pieceWidth] = [pieceWidth, pieceLength];
    }

    if (x + pieceLength > stock.length) {
      x = 0;
      y += rowWidth + kerf;
      rowWidth = 0;
    }
    if (y + pieceWidth > stock.width) {
      waste += pieceLength * pieceWidth;
      continue;
    }

    layout.push({ x, y, length: pieceLength, width: pieceWidth });
    x += pieceLength + kerf;
    rowWidth = Math.max(rowWidth, pieceWidth);
  }

  return { layout, waste };
}

export function generateCutSheetSVG(stock: StockMaterial, layout: Layout[]): string {
  let svg = `<svg width='${stock.length}' height='${stock.width}' viewBox='0 0 ${stock.length} ${stock.width}' xmlns='http://www.w3.org/2000/svg'>`;
  svg += `<rect width='${stock.length}' height='${stock.width}' fill='lightgray' stroke='black' stroke-width='2'/>`;
  
  layout.forEach((piece) => {
    svg += `<rect x='${piece.x}' y='${piece.y}' width='${piece.length}' height='${piece.width}' fill='blue' stroke='black' stroke-width='1'/>`;
  });
  
  svg += `</svg>`;
  return svg;
}

export function generateCutSheetPNG(stock: StockMaterial, layout: Layout[], outputPath: string) {
  const canvas = createCanvas(stock.length, stock.width);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'lightgray';
  ctx.fillRect(0, 0, stock.length, stock.width);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, stock.length, stock.width);

  ctx.fillStyle = 'blue';
  layout.forEach((piece) => {
    ctx.fillRect(piece.x, piece.y, piece.length, piece.width);
    ctx.strokeRect(piece.x, piece.y, piece.length, piece.width);
  });

  writeFileSync(outputPath, canvas.toBuffer('image/png'));
}

const stock = { length: 500, width: 300 };
const pieces = [
  { length: 100, width: 100 },
  { length: 150, width: 100 },
  { length: 200, width: 50 }
];
const optimized = optimizeCuts(stock, pieces);
const svgOutput = generateCutSheetSVG(stock, optimized.layout);
writeFileSync('./tests/results/cut-sheet.svg', svgOutput);
generateCutSheetPNG(stock, optimized.layout, './tests/results/cut-sheet.png');
