/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class Button {
    private id:string;
    private label:string;
    private icon:string;
    private buttonTitle:string;

    public constructor(id:string, label:string, icon:string, buttonTitle:string) {
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.buttonTitle = buttonTitle;
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

    public getButtonTitle(){
        return this.buttonTitle;
    }
}