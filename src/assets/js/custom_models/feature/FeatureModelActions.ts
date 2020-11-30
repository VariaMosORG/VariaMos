import { ModelActions } from "../../model/ModelActions";
import { mxgraphFactory } from "ts-mxgraph";
const {mxImage, mxCellOverlay } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class FeatureModelActions extends ModelActions {
    private errorOverlays:any = Array(); //error overlays
    private errorCells:any = Array(); //error cells

    public constructor(currentModel:any){
        super(currentModel);
        let actions = [
            {
                "id":"clearErrors",
                "label":"Clear Errors"
            },
            {
                "id":"checkUniqueLabels",
                "label":"Check Unique Feature labels"
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
        for (let i = 0; i < actions.length; i++) {
            const functionToExecute= actions[i].id;
            if((this as any)[functionToExecute]){ // Verify if the function exists
                const currentLink = document.getElementById("actions-"+actions[i].id);
                (this as any)[functionToExecute](currentLink); // Execute the function that exists
            }
        }
    }

    //clear all the error overlays
    public clearOverlays(graph:any, errorOverlays:any, errorCells:any){
        for (let i = 0; i < errorCells.length; i++) {
            graph.removeCellOverlay(errorCells[i], errorOverlays[i]);
        }
    }

    public clearErrors(currentLink:HTMLElement){
        const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        const errorOverlays = this.errorOverlays;
        const errorCells = this.errorCells;
        const clearOverlaysFunction = this.clearOverlays;
        currentLink.addEventListener('click', function () {
            clearOverlaysFunction(graph, errorOverlays, errorCells);
        });
    }

    public checkUniqueLabels(currentLink:HTMLElement){
        const modal = this.getCurrentModel().getModelUtil().getVGraph().getModal();
        const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        const errorOverlays = this.errorOverlays;
        const errorCells = this.errorCells;
        const clearOverlaysFunction = this.clearOverlays;
        currentLink.addEventListener('click', function () {
            clearOverlaysFunction(graph, errorOverlays, errorCells); //remove previous overlays
            let featureRoot = graph.getModel().getCell("feature");
            let childs = graph.getModel().getChildVertices(featureRoot);
            let labels = [];
            let result = "";
            for (let i = 0; i < childs.length; i++) {
                let label = childs[i].getAttribute("label");
                if (labels.indexOf(label) > -1) {
                    result += "- Duplicated Feature label: " + label + "<br />";
                    let overlay = new mxCellOverlay(new mxImage('img/error.gif', 16, 16), 'Overlay tooltip', 'right', 'top');
                    graph.addCellOverlay(childs[i], overlay);
                    errorOverlays.push(overlay);
                    errorCells.push(childs[i]);
                }else{
                    labels.push(label);
                }
            }
            if(result != ""){
                modal.setData("error", "Error", result);
                modal.click();
            }else{
                modal.setData("success", "Success", "No errors found");
                modal.click();
            }
        });
    }
}