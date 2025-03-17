import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { StockMaterial, Layout } from "./optimizer";

export function generateCutSheetSVG(stock: StockMaterial, layout: Layout[]): string {
  let svg = `<svg width="${stock.width}" height="${stock.height}" viewBox="0 0 ${stock.width} ${stock.height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${stock.width}" height="${stock.height}" fill="lightgray" stroke="black" stroke-width="2"/>`;

  layout.forEach((piece) => {
    svg += `<rect x="${piece.x}" y="${piece.y}" width="${piece.width}" height="${piece.height}" fill="blue" stroke="black" stroke-width="1"/>`;
  });

  svg += `</svg>`;
  return svg;
}

export function generateCutSheetPNG(stock: StockMaterial, layout: Layout[], outputPath: string) {
  const canvas = createCanvas(stock.width, stock.height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, 0, stock.width, stock.height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, stock.width, stock.height);

  ctx.fillStyle = "blue";
  layout.forEach((piece) => {
    ctx.fillRect(piece.x, piece.y, piece.width, piece.height);
    ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
  });

  writeFileSync(outputPath, canvas.toBuffer("image/png"));
}
