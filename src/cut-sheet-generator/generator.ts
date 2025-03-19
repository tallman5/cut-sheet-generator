import { createCanvas } from "canvas";

export enum GrainDirection { Length = "length", Width = "width", Any = "any" }
export interface IGeneratorConfig { projectName?: string; stockMaterials: IPanel[]; pieces: IPanel[]; kerf?: number; considerGrain: boolean; }
export interface IGeneratorResult { layout: ILayout[]; waste: number; }
export interface ILayout { color: string; length: number; stockIndex: number; width: number; x: number; y: number; };
export interface INode { down?: INode; length: number; right?: INode; used: boolean; width: number; x: number; y: number; }
export interface IPanel { grainDirection?: GrainDirection; length: number; quantity: number; width: number; }

async function findBestFitNodeAsync(root: INode, width: number, length: number): Promise<INode | null> {
  let bestFit: INode | null = null;
  let smallestWaste = Infinity;

  function traverse(node: INode) {
    if (node.used) {
      if (node.right) traverse(node.right);
      if (node.down) traverse(node.down);
    } else if (width <= node.width && length <= node.length) {
      let remainingArea = (node.width * node.length) - (width * length);
      if (remainingArea < smallestWaste) {
        bestFit = node;
        smallestWaste = remainingArea;
      }
    }
  }

  traverse(root);
  return bestFit;
}

export async function generateCutSheetsAsync(config: IGeneratorConfig): Promise<IGeneratorResult> {
  let layout: ILayout[] = [];
  let waste = 0;
  let remainingPieces: IPanel[] = [];
  let stocks: IPanel[] = [];
  const kerf = config.kerf || 0;

  config.stockMaterials.forEach(panel => {
    for (let i = 0; i < panel.quantity; i++) {
      stocks.push({ ...panel });
    }
  });

  config.pieces.forEach(panel => {
    for (let i = 0; i < panel.quantity; i++) {
      remainingPieces.push({ ...panel });
    }
  });

  remainingPieces.sort((a, b) => Math.max(b.length, b.width) - Math.max(a.length, a.width));

  const colorMap = new Map<string, string>();
  const colors = ["red", "green", "blue", "orange", "purple", "yellow", "pink", "cyan", "brown", "gray"];
  let colorIndex = 0;

  for (let stockIndex = 0; stockIndex < stocks.length; stockIndex++) {
    let stock = stocks[stockIndex];
    let usedSpace: ILayout[] = [];
    const root: INode = { x: 0, y: 0, width: stock.width, length: stock.length, used: false };

    for (let piece of [...remainingPieces]) {
      let node = await findBestFitNodeAsync(root, piece.width, piece.length);
      if (node) {
        let placedNode = await splitNodeAsync(node, piece.width, piece.length, kerf);
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

export async function generateCutSheetPngAsync(stocks: IPanel[], layout: ILayout[]): Promise<Buffer<ArrayBufferLike>> {
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

export async function generateCutSheetSvgAsync(stocks: IPanel[], layout: ILayout[]): Promise<string> {
  const padding = 5;
  const strokeWidth = .1;
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

export async function generateLegendAsync(layout: ILayout[]): Promise<ILayout[]> {
  const legend: ILayout[] = [];
  const seen = new Set<string>();

  layout.forEach(piece => {
    let key = `${piece.width}x${piece.length}`;
    if (!seen.has(key)) {
      legend.push(piece);
      seen.add(key);
    }
  });

  return legend;
}

async function splitNodeAsync(node: INode, width: number, length: number, kerf: number): Promise<INode> {
  node.used = true;
  node.down = { x: node.x, y: node.y + length + kerf, width: node.width, length: node.length - length - kerf, used: false };
  node.right = { x: node.x + width + kerf, y: node.y, width: node.width - width - kerf, length, used: false };
  return node;
}
