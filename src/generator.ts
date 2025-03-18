import { ILayout, IPiece, IStockMaterial } from "./models";

export function generateCutSheets(stock: IStockMaterial, pieces: IPiece[]): { layout: ILayout[], waste: number } {
  let layout: ILayout[] = [];
  let waste = 0;
  // let kerf = stock.kerf || 0;
  let kerf = 0;

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
