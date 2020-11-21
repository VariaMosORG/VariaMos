export class MElement { 
    public icon: string;
    public type: string; 
    public width: number; 
    public height: number;
    public style: string;
    public label: string;
    public properties: any = Array();

    public constructor(icon:string, type:string, width:number, height:number, 
        style:string, label:string) {
        this.icon = icon;
        this.type = type; 
        this.width = width; 
        this.height = height;
        this.style = style; 
        this.label = label;
        this.properties = [
            { "id":"label", "label": "Label", "defValue":this.type, "inputType":"text", "disabled":"false"},
            { "id":"type", "label": "Type", "defValue":this.type, "inputType":"text", "disabled":"true"},
        ]
    }
}