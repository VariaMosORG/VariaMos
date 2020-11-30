export class ModelActions {
    private currentModel: any; //references the current model
    private actions: any = Array(); //list of actions
    private divModelActions:any; //div model actions (HTMLElement)
    private buttonDropdownBase?:any; //main button dropdown (HTMLElement)
    private divDropdownActions:any; //div dropdown actions (HTMLElement)
    
    public constructor(currentModel:any) {
        this.currentModel = currentModel;
        this.divModelActions = this.currentModel.getModelUtil().getVGraph().getDivModelActions();
    }

    public getCurrentModel(){
        return this.currentModel;
    }

    public getActions(){
        return this.actions;
    }

    public getDivModelActions(){
        return this.divModelActions;
    }

    public getDivDropdownActions(){
        return this.divDropdownActions;
    }

    public getButtonDropdownBase(){
        return this.buttonDropdownBase;
    }

    public setActions(actions:any){
        this.actions = actions;
    }

    public initializeActions(){
        //to be implemented in the subclasses
    }

    public applyFunctions(){
        //to be implemented in the subclasses
    }

    public createButtonDropdownBase(buttonTitle:any = "Model Actions"){
        let btn = document.createElement("button");
        btn.className = "btn btn-secondary dropdown-toggle";
        btn.setAttribute("type", "button");
        btn.setAttribute("data-toggle", "dropdown");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-haspopup", "true");
        btn.id = "btnGroupActions1";
        btn.innerText = buttonTitle;
        this.buttonDropdownBase = btn;
        this.divModelActions.appendChild(this.buttonDropdownBase);

        let divDropdown = document.createElement("div");
        divDropdown.id = "divDropdownActions";
        divDropdown.className = "dropdown-menu";
        divDropdown.setAttribute("aria-labelledby", "btnGroupActions1");
        this.divDropdownActions = divDropdown;
        this.divModelActions.appendChild(this.divDropdownActions);
    }

    public createLinksDropdownBase(){
        for (let i = 0; i < this.actions.length; i++) {
            let aElement = document.createElement("a");
            aElement.innerText = this.actions[i].label;
            aElement.className = "dropdown-item dropdown-pointer";
            aElement.id = "actions-" + this.actions[i].id;
            this.divDropdownActions.appendChild(aElement);
        }
    }
}