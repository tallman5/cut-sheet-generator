export enum GrainDirection {
    Length = "length",
    Width = "width",
    UnSet = "unset"
}

export interface IPanel {
    length: number;
    width: number;
    grainDirection?: GrainDirection;
}

export interface ILayout {
    x: number;
    y: number;
    length: number;
    width: number;
    stockIndex: number;
};

export interface IGeneratorConfig {
    stockMaterials: IPanel[];
    pieces: IPanel[];
    kerf?: number;
    considerGrain: boolean;
}

export interface IGeneratorResult {
    layout: ILayout[];
    waste: number;
}
