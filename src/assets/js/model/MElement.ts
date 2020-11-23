export class MElement { 
    private icon: string;
    private type: string; 
    private width: number; 
    private height: number;
    private style: string;
    private label: string;
    private properties: any = Array();

    public constructor(icon:string, type:string, width:number, height:number, 
        style:string, label:string) {
        this.icon = icon;
        this.type = type; 
        this.width = width; 
        this.height = height;
        this.style = style; 
        this.label = label;
        this.properties = [
            { "id":"label", "label": "Label", "defValue":this.type, "inputType":"text", "disabled":"false", "display":"true"},
            { "id":"type", "label": "Type", "defValue":this.type, "inputType":"text", "disabled":"true", "display":"true"},
        ]
    }

    public getIcon(){
        return this.icon;
    }

    public getType(){
        return this.type;
    }

    public getWidth(){
        return this.width;
    }

    public getHeight(){
        return this.height;
    }

    public getStyle(){
        return this.style;
    }

    public getLabel(){
        return this.label;
    }

    public getProperties(){
        return this.properties;
    }

    public setProperties(properties:any){
        this.properties = properties;
    }
}