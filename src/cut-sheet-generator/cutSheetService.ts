import { generateCutSheetsAsync, generateCutSheetSvgAsync } from "./generator";
import { IPanel } from "./models";

export class CutSheetService {
    stockMaterials: IPanel[] = [];
    pieces: IPanel[] = [];
    kerf = 0.125;
    considerGrain = true;
    svgOutput = '';
    waste: number = 0;
    listeners: any = [];

    constructor() {
        this.updateCutSheetAsync();
    }

    async updateCutSheetAsync() {
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
        this.updateCutSheetAsync();
    }

    addStockMaterial(stockMaterial: IPanel) {
        this.stockMaterials.push(stockMaterial);
        this.updateCutSheetAsync();
    }

    deleteStockMaterial(index: number) {
        if (index >= 0 && index < this.stockMaterials.length) {
            this.stockMaterials.splice(index, 1);
            this.updateCutSheetAsync();
        }
    }

    clearStockMaterials() {
        this.stockMaterials = [];
        this.updateCutSheetAsync();
    }

    setPieces(pieces: IPanel[]) {
        this.pieces = pieces;
        this.updateCutSheetAsync();
    }

    addPiece(piece: IPanel) {
        this.pieces.push(piece);
        this.updateCutSheetAsync();
    }

    deletePiece(index: number) {
        if (index >= 0 && index < this.pieces.length) {
            this.pieces.splice(index, 1);
            this.updateCutSheetAsync();
        }
    }

    clearPieces() {
        this.pieces = [];
        this.updateCutSheetAsync();
    }

    setKerf(kerf: number) {
        this.kerf = kerf;
        this.updateCutSheetAsync();
    }

    setConsiderGrain(considerGrain: boolean) {
        this.considerGrain = considerGrain;
        this.updateCutSheetAsync();
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
