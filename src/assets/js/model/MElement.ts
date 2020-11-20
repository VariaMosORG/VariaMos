export class MElement { 
    public icon: string;
    public type: string; 
    public width: number; 
    public height: number;
    public style: string;
    public label: string;

    public constructor(icon:string, type:string, width:number, height:number, 
        style:string, label:string) {
        this.icon = icon;
        this.type = type; 
        this.width = width; 
        this.height = height;
        this.style = style; 
        this.label = label;
    }
}