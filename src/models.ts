export enum GrainDirection { Any, Length, Width }

export interface IPanel {
    grainDirection: GrainDirection;
    id: string;
    length: number;
    quantity: number;
    width: number;
    color: string;
    stockIndex: number;
    x: number;
    y: number;
}

export interface IProject {
    considerGrain: boolean;
    id: string;
    name: string;
    kerf: number;
    pieces: IPanel[];
    stockMaterials: IPanel[];
}

export interface IGeneratorResult {
    layout: IPanel[];
    waste: number;
}

export interface INode extends IPanel {
    down?: INode;
    right?: INode;
    used: boolean;
    x: number;
    y: number;
}
