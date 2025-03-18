import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { ILayout, IStockMaterial } from "./models";

export function generateCutSheetSVG(stock: IStockMaterial, layout: ILayout[]): string {
  let svg = `<svg width="${stock.width}" height="${stock.length}" viewBox="0 0 ${stock.width} ${stock.length}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${stock.width}" height="${stock.length}" fill="lightgray" stroke="black" stroke-width="2"/>`;

  layout.forEach((piece) => {
    svg += `<rect x="${piece.x}" y="${piece.y}" width="${piece.width}" height="${piece.length}" fill="blue" stroke="black" stroke-width="1"/>`;
  });

  svg += `</svg>`;
  return svg;
}

export function generateCutSheetPNG(stock: IStockMaterial, layout: ILayout[], outputPath: string) {
  const canvas = createCanvas(stock.width, stock.length);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, 0, stock.width, stock.length);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, stock.width, stock.length);

  ctx.fillStyle = "blue";
  layout.forEach((piece) => {
    ctx.fillRect(piece.x, piece.y, piece.width, piece.length);
    ctx.strokeRect(piece.x, piece.y, piece.width, piece.length);
  });

  writeFileSync(outputPath, canvas.toBuffer("image/png"));
}
