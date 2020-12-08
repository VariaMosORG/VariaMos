import { ModelElement } from "../../../model/ModelElement";
import { mxgraphFactory } from "ts-mxgraph";
const {mxImage, mxCellOverlay } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConcreteElement extends ModelElement {
    public constructor(currentModel:any){
        super(
            "rectangle.png",
            "concrete",
            100,
            35,
            "",
            "Concrete Feature",
            currentModel
        );
        
        let properties = this.getProperties();
        properties.push(
            { 
                "id":"selected", "label": "Selected", "defValue":"false", 
                "inputType":"checkbox", "disabled":"false", "display":"true", 
                "onChange":this.getOnChangeSelectedFunction()
            }
        );
        this.setProperties(properties);
    }

    //if concrete element is selected, then put a green mark as an overlay, otherwise remove it
    public getOnChangeSelectedFunction(){
        let graph = this.getCurrentModel().getModelUtil().getVGraph().getGraph();
        let onChangeSelectedFunction = function(this:any){
            let overlay = new mxCellOverlay(new mxImage("/img/check.png", 16, 16), 'Overlay tooltip');
            let dataCellId = this.getAttribute("data-cell-id");
            if(this.checked){
				graph.addCellOverlay(graph.getModel().getCell(dataCellId), overlay);
            }else{
				graph.removeCellOverlay(graph.getModel().getCell(dataCellId));
			}
        }
        return onChangeSelectedFunction;
    }
}