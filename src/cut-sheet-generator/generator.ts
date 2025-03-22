import { IGeneratorConfig, IGeneratorResult, ILayout, INode, IPanel } from "./models";

function explodeConfig(config: IGeneratorConfig): IGeneratorConfig {
  const explodePanels = (panels: IPanel[]) =>
    panels.flatMap(panel => Array(panel.quantity).fill({ ...panel, quantity: 1 }));

  return {
    ...config,
    pieces: explodePanels(config.pieces),
    stockMaterials: explodePanels(config.stockMaterials),
  };
}

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
  const kerf = config.kerf || 0;
  const explodedConfig = explodeConfig(config);

  explodedConfig.pieces.sort((a, b) => Math.max(b.length, b.width) - Math.max(a.length, a.width));
  let remainingPieces = [...explodedConfig.pieces]; // Copy to avoid modifying the original

  const colorMap = new Map<string, string>();
  const colors = ["red", "green", "blue", "orange", "purple", "yellow", "pink", "cyan", "brown", "gray"];
  let colorIndex = 0;


  for (let stockIndex = 0; stockIndex < explodedConfig.stockMaterials.length; stockIndex++) {
    let stock = explodedConfig.stockMaterials[stockIndex];
    const root: INode = { x: 0, y: 0, width: stock.width, length: stock.length, used: false };

    let usedSpace: ILayout[] = [];
    let newRemainingPieces: IPanel[] = []; // Track pieces that still need placement

    for (let piece of remainingPieces) {
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
      } else {
        newRemainingPieces.push(piece); // If piece couldn't be placed, keep it
      }
    }

    remainingPieces = newRemainingPieces; // Update remaining pieces

    let usedArea = usedSpace.reduce((sum, rect) => sum + (rect.length * rect.width), 0);
    waste += (stock.length * stock.width) - usedArea;

    if (remainingPieces.length === 0) break;
  }

  return { layout, waste };
}

export async function generateCutSheetSvgAsync(stockMaterials: IPanel[], layout: ILayout[]): Promise<string> {
  const padding = 5;
  const strokeWidth = .1;

  const stocks: IPanel[] = [];
  stockMaterials.forEach(panel => {
    for (let i = 0; i < panel.quantity; i++) {
      stocks.push({ ...panel });
    }
  });

  let totalWidth = stocks.reduce((sum, stock) => sum + stock.width + padding, 0) - padding;
  let maxHeight = Math.max(...stocks.map(stock => stock.length));

  let svg = `<svg width='100%' height='100%' viewBox='0 0 ${totalWidth} ${maxHeight}' xmlns='http://www.w3.org/2000/svg'>`;
  let offsetX = 0;

  stocks.forEach((stock, index) => {
    if (stock.length > 0 && stock.width > 0) {
      svg += `<rect x='${offsetX + strokeWidth / 2}' y='${strokeWidth / 2}' width='${stock.width - strokeWidth}' height='${stock.length - strokeWidth}' fill='lightgray' stroke='black' stroke-width='${strokeWidth}' vector-effect='non-scaling-stroke' />`;

      layout.filter(p => p.stockIndex === index).forEach((piece) => {
        if (piece.length > 0 && piece.width > 0) {
          svg += `<rect x='${offsetX + piece.x + strokeWidth / 2}' y='${piece.y + strokeWidth / 2}' width='${piece.width - strokeWidth}' height='${piece.length - strokeWidth}' fill='${piece.color}' stroke='black' stroke-width='${strokeWidth}' vector-effect='non-scaling-stroke' />`;
        }
      });

      offsetX += stock.width + padding;
    }
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
