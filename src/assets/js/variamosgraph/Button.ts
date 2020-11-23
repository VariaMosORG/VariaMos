export class Button {
    private id:string;
    private label:string;
    private icon:string;

    public constructor(id:string, label:string, icon:string) {
        this.id = id;
        this.label = label;
        this.icon = icon;
    }

    public getId(){
        return this.id;
    }

    public getLabel(){
        return this.label;
    }

    public getIcon(){
        return this.icon;
    }
}