import { ModelActions } from "../../model/ModelActions";
import { mxgraphFactory } from "ts-mxgraph";
const {mxImage, mxCellOverlay } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class FeatureModelActions extends ModelActions {
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
        let vGraph = this.getCurrentModel().getModelUtil().getVGraph();
        if(!vGraph.getCustomData().errorCells){
            let errorDict = {"errorCells":[],"errorOverlays":[]};
            vGraph.setCustomData(errorDict); //custom data for this model actions
        }
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
    public clearOverlays(vGraph:any){
        let errorCells = vGraph.getCustomData().errorCells;
        let errorOverlays = vGraph.getCustomData().errorOverlays;
        for (let i = 0; i < errorCells.length; i++) {
            vGraph.getGraph().removeCellOverlay(errorCells[i], errorOverlays[i]);
        }
        let errorDict = {"errorCells":[], "errorOverlays":[]};
        vGraph.setCustomData(errorDict);
    }

    public clearErrors(currentLink:HTMLElement){
        const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        const vGraph = this.getCurrentModel().getModelUtil().getVGraph();
        const clearOverlaysFunction = this.clearOverlays;
        currentLink.addEventListener('click', function () {
            clearOverlaysFunction(vGraph);
        });
    }

    public checkUniqueLabels(currentLink:HTMLElement){
        const vGraph = this.getCurrentModel().getModelUtil().getVGraph();
        const modal = this.getCurrentModel().getModelUtil().getVGraph().getModal();
        const graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        const clearOverlaysFunction = this.clearOverlays;
        currentLink.addEventListener('click', function () {
            clearOverlaysFunction(vGraph); //remove previous overlays
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

                    //insert overlay and error info in the custom data
                    let customData = vGraph.getCustomData();
                    customData.errorOverlays.push(overlay);
                    customData.errorCells.push(childs[i]);
                    vGraph.setCustomData(customData);
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