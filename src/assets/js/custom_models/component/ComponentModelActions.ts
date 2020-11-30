import { ModelActions } from "../../model/ModelActions";

export class ComponentModelActions extends ModelActions {
    
    public constructor(currentModel:any){
        super(currentModel);
        let actions = [
            {
                "id":"hideFragmentRelations",
                "label":"Hide all fragment alter relations"
            },
            {
                "id":"showFragmentRelations",
                "label":"Show all fragment alter relations"
            },
            {
                "id":"showFragmentRelationsSelected",
                "label":"Show alter relations for current fragment"
            }
        ];
        this.setActions(actions);
    }

    public initializeActions(){
        this.createButtonDropdownBase();
        this.createLinksDropdownBase();
        this.applyFunctions();
    }

    public applyFunctions(){
        let actions = this.getActions();
        for(let i = 0; i < actions.length; i++){
            const functionToExecute= actions[i].id;
            if((this as any)[functionToExecute]){ // Verify if the function exists
                const currentLink = document.getElementById("actions-"+actions[i].id);
                (this as any)[functionToExecute](currentLink); // Execute the function that exists
            }
        }
    }

    public hideFragmentRelations(currentLink:HTMLElement){
        const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        currentLink.addEventListener('click', function(){
            let componentRoot = graph.getModel().getCell("component");
            let childs = graph.getModel().getChildEdges(componentRoot);

            for(let i = 0; i < childs.length; i++){
                if(childs[i].getValue().nodeName == "rel_fragment_file"){
                    childs[i].setVisible(false);
                }
            }
            graph.refresh();
        });
    }

    public showFragmentRelations(currentLink:HTMLElement){
        const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        currentLink.addEventListener('click', function(){
            let componentRoot = graph.getModel().getCell("component");
            let childs = graph.getModel().getChildEdges(componentRoot);
    
            for(let i = 0; i < childs.length; i++){
                if(childs[i].getValue().nodeName == "rel_fragment_file"){
                    childs[i].setVisible(true);
                }
            }
            graph.refresh();
        });
    }

    public showFragmentRelationsSelected(currentLink:HTMLElement){
        const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        const modal = this.getCurrentModel().getModelUtil().getVGraph().getModal();
        currentLink.addEventListener('click', function(){
            let cell = graph.getSelectionCell();
            if(cell == null) {
                modal.setData("error", "Error", "Please select a valid Fragment");
                modal.click();
            }else{
                if (!(cell.getAttribute("type") == "fragment")){
                    modal.setData("error", "Error", "Please select a valid Fragment");
                    modal.click();
                }else{
                    let componentRoot = graph.getModel().getCell("component");
                    let childs = graph.getModel().getChildEdges(componentRoot);
    
                    for(let i = 0; i < childs.length; i++) {
                        if (childs[i].getValue().nodeName == "rel_fragment_file"){
                            childs[i].setVisible(false);
                        }
                    }
    
                    let childsCurrent = graph.getModel().getOutgoingEdges(cell);
                    for(let i = 0; i < childsCurrent.length; i++) {
                        if(childsCurrent[i].getValue().nodeName == "rel_fragment_file"){
                            childsCurrent[i].setVisible(true);
                        }
                    }
                    graph.refresh();
                }
            }
        });
    }
}