export class Model {
    private type:string; //for example feature
    private elementClassNames:string[];
    private elements:any = Array(); // MElement[]
    private elementClones:any = {}; // element clones
    private constraints?:any = Array(); //list of constraints between elements
    private modelUtil?:any; // ModelUtil
    private customElementTexts?:any; // custom element texts to be displayed
    private relationProperties:any = Array(); //list of relation properties between elements
    
    public constructor(type:string, elementClassNames:string[]) {
        this.type = type;
        this.elementClassNames = elementClassNames;
        this.relationProperties = [
            { "id":"type", "label": "Type", "defValue":"relation", "inputType":"text", "disabled":"true", "display":"true"},
        ];
    }

    public getType(){
        return this.type;
    }

    public getElementClassNames(){
        return this.elementClassNames;
    }

    public getElements(){
        return this.elements;
    }

    public getElementClones(){
        return this.elementClones;
    }

    public getConstraints(){
        return this.constraints;
    }

    public getModelUtil(){
        return this.modelUtil;
    }

    public getCustomElementTexts(){
        return this.customElementTexts;
    }

    public getRelationProperties(){
        return this.relationProperties;
    }

    public setCustomElementTexts(customElementTexts:any){
        this.customElementTexts = customElementTexts;
    }

    public setConstraints(constraints:any){
        this.constraints = constraints;
    }

    public setRelationProperties(relationProperties:any){
        this.relationProperties = relationProperties;
    }

    public setElementClones(elementClones:any){
        this.elementClones = elementClones;
    }

    public setModelUtil(modelUtil:any){
        this.modelUtil = modelUtil;
    }

    public addElement(element:any){
        this.elements.push(element);
    }

    public setElements(elements:any){
        this.elements = elements;
    }

    public overlayStart(){
        //implemented in subclasses
    }

    public customConstraintsRelations(graph:any, source:any, target:any){
        //implemented in subclasses
        return {};
    }

    public customConstraintsElementCreation(graph:any, vertexToClone:any){
        //implemented in subclasses
        return {};
    }
}