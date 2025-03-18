import { createCanvas } from "canvas";

export enum GrainDirection { Length = "length", Width = "width", UnSet = "unset" }
export interface IPanel { grainDirection?: GrainDirection; length: number; quantity: number; width: number; }
export interface ILayout { color: string; length: number; stockIndex: number; width: number; x: number; y: number; };
export interface IGeneratorConfig { stockMaterials: IPanel[]; pieces: IPanel[]; kerf?: number; considerGrain: boolean; }
export interface IGeneratorResult { layout: ILayout[]; waste: number; }
export interface INode { down?: INode; length: number; right?: INode; used: boolean; width: number; x: number; y: number; }

export function generateCutSheets(config: IGeneratorConfig): { layout: ILayout[], waste: number } {
  let layout: ILayout[] = [];
  let waste = 0;
  let remainingPieces: IPanel[] = [];
  const kerf = config.kerf || 0;
  const stocks = config.stockMaterials;
  const pieces = config.pieces;

  // Expand pieces based on quantity
  pieces.forEach(piece => {
    for (let i = 0; i < piece.quantity; i++) {
      remainingPieces.push({ ...piece });
    }
  });

  // Sort pieces by largest area first (greedy strategy)
  remainingPieces.sort((a, b) => (b.length * b.width) - (a.length * a.width));

  const colorMap = new Map<string, string>();
  const colors = ["red", "green", "blue", "orange", "purple", "yellow", "pink", "cyan", "brown", "gray"];
  let colorIndex = 0;

  for (let stockIndex = 0; stockIndex < stocks.length; stockIndex++) {
    let stock = stocks[stockIndex];
    let usedSpace: ILayout[] = [];
    const root: INode = { x: 0, y: 0, width: stock.width, length: stock.length, used: false };

    for (let piece of [...remainingPieces]) {
      let node = findNode(root, piece.width, piece.length);
      if (node) {
        let placedNode = splitNode(node, piece.width, piece.length, kerf);
        let pieceKey = `${piece.width}x${piece.length}`;

        if (!colorMap.has(pieceKey)) {
          colorMap.set(pieceKey, colors[colorIndex % colors.length]);
          colorIndex++;
        }

        let color = colorMap.get(pieceKey) || "black";
        layout.push({ x: placedNode.x, y: placedNode.y, length: piece.length, width: piece.width, stockIndex, color });
        usedSpace.push({ x: placedNode.x, y: placedNode.y, length: piece.length, width: piece.width, stockIndex, color });
        remainingPieces = remainingPieces.filter(p => p !== piece);
      }
    }

    let usedArea = usedSpace.reduce((sum, rect) => sum + (rect.length * rect.width), 0);
    waste += (stock.length * stock.width) - usedArea;

    if (remainingPieces.length === 0) break;
  }

  return { layout, waste };
}

function splitNode(node: INode, width: number, length: number, kerf: number): INode {
  node.used = true;
  node.down = { x: node.x, y: node.y + length + kerf, width: node.width, length: node.length - length - kerf, used: false };
  node.right = { x: node.x + width + kerf, y: node.y, width: node.width - width - kerf, length, used: false };
  return node;
}

function findNode(root: INode, width: number, length: number): INode | null {
  if (root.used) {
    return findNode(root.right!, width, length) || findNode(root.down!, width, length);
  } else if (width <= root.width && length <= root.length) {
    return root;
  }
  return null;
}

export function generateCutSheetSvg(stocks: IPanel[], layout: ILayout[]): string {
  const padding = 5;
  const strokeWidth = .1; // Define stroke width
  let totalWidth = stocks.reduce((sum, stock) => sum + stock.width + padding, 0) - padding;
  let maxHeight = Math.max(...stocks.map(stock => stock.length));

  let svg = `<svg width='${totalWidth}' height='${maxHeight}' viewBox='0 0 ${totalWidth} ${maxHeight}' xmlns='http://www.w3.org/2000/svg'>`;
  let offsetX = 0;

  stocks.forEach((stock, index) => {
    svg += `<rect x='${offsetX + strokeWidth / 2}' y='${strokeWidth / 2}' width='${stock.width - strokeWidth}' height='${stock.length - strokeWidth}' fill='lightgray' stroke='black' stroke-width='${strokeWidth}' vector-effect='non-scaling-stroke' />`;

    layout.filter(p => p.stockIndex === index).forEach((piece) => {
      svg += `<rect x='${offsetX + piece.x + strokeWidth / 2}' y='${piece.y + strokeWidth / 2}' width='${piece.width - strokeWidth}' height='${piece.length - strokeWidth}' fill='${piece.color}' stroke='black' stroke-width='${strokeWidth}' vector-effect='non-scaling-stroke' />`;
    });

    offsetX += stock.width + padding;
  });

  svg += `</svg>`;
  return svg;
}

export function generateCutSheetPng(stocks: IPanel[], layout: ILayout[]): Buffer {
  const scale = 20;
  const padding = 10 * scale;
  const strokeWidth = 2;
  let totalWidth = stocks.reduce((sum, stock) => sum + stock.width * scale + padding, 0) - padding;
  let maxHeight = Math.max(...stocks.map(stock => stock.length * scale));

  const canvas = createCanvas(totalWidth, maxHeight);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false; // Disable anti-aliasing for crisp lines

  let offsetX = 0;
  stocks.forEach((stock, index) => {
    ctx.fillStyle = "lightgray";
    ctx.fillRect(Math.round(offsetX) + strokeWidth / 2, strokeWidth / 2, Math.round(stock.width * scale) - strokeWidth, Math.round(stock.length * scale) - strokeWidth);
    ctx.strokeStyle = "black";
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(Math.round(offsetX) + strokeWidth / 2, strokeWidth / 2, Math.round(stock.width * scale) - strokeWidth, Math.round(stock.length * scale) - strokeWidth);

    layout.filter(p => p.stockIndex === index).forEach((piece) => {
      ctx.fillStyle = piece.color;
      ctx.fillRect(Math.round(offsetX + piece.x * scale) + strokeWidth / 2, Math.round(piece.y * scale) + strokeWidth / 2, Math.round(piece.width * scale) - strokeWidth, Math.round(piece.length * scale) - strokeWidth);
      ctx.strokeRect(Math.round(offsetX + piece.x * scale) + strokeWidth / 2, Math.round(piece.y * scale) + strokeWidth / 2, Math.round(piece.width * scale) - strokeWidth, Math.round(piece.length * scale) - strokeWidth);
    });

    offsetX += stock.width * scale + padding;
  });

  return canvas.toBuffer("image/png");
}
