export enum GrainDirection {
    Length = "length",
    Width = "width"
}

export interface IStockMaterial {
    length: number;
    width: number;
    grainDirection?: GrainDirection;
};

export interface IPiece {
    length: number;
    width: number;
    grainDirection?: GrainDirection;
};

export interface ILayout {
    x: number;
    y: number;
    length: number;
    width: number
};

export interface IGeneratorConfig {
    stockMaterials: IStockMaterial[];
    pieces: IPiece[];
    kerf?: number;
    considerGrain: boolean;
}
