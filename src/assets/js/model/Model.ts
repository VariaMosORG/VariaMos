export class Model {
    public type:string;
    public elementClassNames:string[];
    public elements:any = Array(); // MElement[]
    public constraints?:any = Array();
    public relationProperties:any = Array();
    
    public constructor(type:string, elementClassNames:string[]) {
        this.type = type;
        this.elementClassNames = elementClassNames;
        this.relationProperties = [
            { "id":"type", "label": "Type", "defValue":"relation", "inputType":"text", "disabled":"true"},
        ];
    }

    public addElement(element:any){
        this.elements.push(element);
    }

    public setElements(elements:any){
        this.elements = elements;
    }
}