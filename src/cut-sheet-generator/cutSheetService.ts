import { generateCutSheetsAsync, generateCutSheetSvgAsync, IPanel } from "./generator";

export class CutSheetService {
    stockMaterials: IPanel[] = [];
    pieces: IPanel[] = [];
    kerf = 0.125;
    considerGrain = true;
    svgOutput = '';
    waste: number = 0;
    listeners: any = [];

    constructor() {
        this.updateCutSheet();
    }

    async updateCutSheet() {
        if (!this.stockMaterials.length || !this.pieces.length) return;

        const config = {
            stockMaterials: this.stockMaterials,
            pieces: this.pieces,
            kerf: this.kerf,
            considerGrain: this.considerGrain,
        };

        const result = await generateCutSheetsAsync(config);
        this.waste = result.waste;
        this.svgOutput = await generateCutSheetSvgAsync(config.stockMaterials, result.layout);
        this.notifyListeners();
    }

    setStockMaterials(stockMaterials: IPanel[]) {
        this.stockMaterials = stockMaterials;
        this.updateCutSheet();
    }

    addStockMaterial(stockMaterial: IPanel) {
        this.stockMaterials.push(stockMaterial);
        this.updateCutSheet();
    }

    deleteStockMaterial(index: number) {
        if (index >= 0 && index < this.stockMaterials.length) {
            this.stockMaterials.splice(index, 1);
            this.updateCutSheet();
        }
    }

    clearStockMaterials() {
        this.stockMaterials = [];
        this.updateCutSheet();
    }

    setPieces(pieces: IPanel[]) {
        this.pieces = pieces;
        this.updateCutSheet();
    }

    addPiece(piece: IPanel) {
        this.pieces.push(piece);
        this.updateCutSheet();
    }

    deletePiece(index: number) {
        if (index >= 0 && index < this.pieces.length) {
            this.pieces.splice(index, 1);
            this.updateCutSheet();
        }
    }

    clearPieces() {
        this.pieces = [];
        this.updateCutSheet();
    }

    setKerf(kerf: number) {
        this.kerf = kerf;
        this.updateCutSheet();
    }

    setConsiderGrain(considerGrain: boolean) {
        this.considerGrain = considerGrain;
        this.updateCutSheet();
    }

    subscribe(listener: any) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(
            (listener: (arg0: { svgOutput: string; waste: number; }) => any) => listener({
                svgOutput: this.svgOutput,
                waste: this.waste,
            }));
    }
}
