export enum GrainDirection { Any, Length, Width }

export interface IProject {
    considerGrain: boolean;
    id: string;
    name: string;
    kerf: number;
}

export interface IRectangle {
    length: number;
    width: number;
}

export interface IPanel extends IRectangle {
    grainDirection: GrainDirection;
    quantity: number;
}

export interface ILayout extends IRectangle {
    color: string;
    stockIndex: number;
    x: number;
    y: number;
}

export interface IGeneratorConfig {
    considerGrain: boolean;
    kerf?: number;
    pieces: IPanel[];
    projectName?: string;
    stockMaterials: IPanel[];
}

export interface IGeneratorResult {
    layout: ILayout[];
    waste: number;
}

export interface INode extends IRectangle {
    down?: INode;
    right?: INode;
    used: boolean;
    x: number;
    y: number;
}
