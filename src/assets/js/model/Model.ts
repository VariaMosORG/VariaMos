import { MElement } from "./MElement";

export class Model {
    public type: string;
    public elements: MElement[];
    
    public constructor(type:string, elements: MElement[]) {
        this.type = type;
        this.elements = elements;
    }
}