import { IGeneratorConfig, IGeneratorResult, ILayout, IPanel } from "./models";

export function generateCutSheets(config: IGeneratorConfig): IGeneratorResult {
  let layout: ILayout[] = [];
  let waste = 0;
  let remainingPieces = [...config.pieces];
  let kerf = config.kerf || 0;

  for (let stockIndex = 0; stockIndex < config.stockMaterials.length; stockIndex++) {
    let stock = config.stockMaterials[stockIndex];
    let x = 0, y = 0, rowWidth = 0;
    let usedPieces: IPanel[] = [];

    for (let piece of remainingPieces) {
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

      layout.push({ x, y, length: pieceLength, width: pieceWidth, stockIndex });
      usedPieces.push(piece);
      x += pieceLength + kerf;
      rowWidth = Math.max(rowWidth, pieceWidth);
    }

    remainingPieces = remainingPieces.filter(p => !usedPieces.includes(p));
    if (remainingPieces.length === 0) break;
  }

  return { layout, waste };
}

export function generateCutSheetSVG(stocks: IPanel[], layout: ILayout[]): string {
  const padding = 20;
  let totalWidth = stocks.reduce((sum, stock) => sum + stock.width + padding, 0) - padding;
  let maxHeight = Math.max(...stocks.map(stock => stock.length));

  let svg = `<svg width='${totalWidth}' height='${maxHeight}' viewBox='0 0 ${totalWidth} ${maxHeight}' xmlns='http://www.w3.org/2000/svg'>`;
  let offsetX = 0;

  stocks.forEach((stock, index) => {
    svg += `<rect x='${offsetX}' y='0' width='${stock.width}' height='${stock.length}' fill='lightgray' stroke='black' stroke-width='2'/>`;

    layout.filter(p => p.stockIndex === index).forEach((piece) => {
      svg += `<rect x='${offsetX + piece.x}' y='${piece.y}' width='${piece.width}' height='${piece.length}' fill='blue' stroke='black' stroke-width='1'/>`;
    });

    offsetX += stock.width + padding;
  });

  svg += `</svg>`;
  return svg;
}
