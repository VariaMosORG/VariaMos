export class Model {
    public id: number;
    public type: string;
    public elements: Element[];
    
    public constructor(id:number, type:string, elements: Element[]) {
        this.id = id;
        this.type = type;
        this.elements = elements;
    }
}