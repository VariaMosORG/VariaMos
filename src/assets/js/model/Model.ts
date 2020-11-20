export class Model {
    public type: string;
    public elementClassNames: string[];
    public elements: any = Array(); // MElement[]
    
    public constructor(type:string, elementClassNames:string[]) {
        this.type = type;
        this.elementClassNames = elementClassNames;
    }

    public addElement(element:any){
        this.elements.push(element);
    }

    public setElements(elements:any){
        this.elements = elements;
    }
}