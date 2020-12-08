import { Model } from "../../model/Model";
import { mxgraphFactory } from "ts-mxgraph";
const {mxImage, mxCellOverlay } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class FeatureModel extends Model {

    public constructor() {
        super(
            "feature",
            ["RootElement", "AbstractElement", "ConcreteElement", "BundleElement"]
        );
        
        let constraints = this.getConstraints();
        constraints = [
            {
                "source":"true", "type":"root", "attr":null,
                "value":null, "min":0, "max":0, "validNeighbors":null,
                "countError":"Invalid connection", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"bundle", "attr":null,
                "value":null, "min":0, "max":1, "validNeighbors":["root","abstract"],
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            }
        ];
        this.setConstraints(constraints);

        let relationProperties = this.getRelationProperties();
        relationProperties.push(
            { 
                "id":"relType", "label":"RelType", "defValue":"mandatory", "inputType":"select",
                "inputValues":["mandatory","optional","requires","excludes"], "display":"true",
                "conditions":{
                    "type":"and", 
                    "source":["abstract","concrete","bundle"], 
                    "target":["abstract","concrete","root"]
                }
            }
        );
        this.setRelationProperties(relationProperties);
        
        let customElementTexts = {"bundle":"bundleType"}; //default element to be shown in drawing area is bundleType (for bundle elements)
        this.setCustomElementTexts(customElementTexts);

        let elementClones = { //clone concrete cells in binding_feature_component model if available
            "concrete":"binding_feature_component"
        }
        this.setElementClones(elementClones);
    }

    // display overlay (green check) of selected concrete features
    public overlayStart(){
        let cells = this.getModelUtil().searchCellsByType(this.getType(), "concrete");
        for (let i = 0; i < cells.length; i++) {
            let sel = cells[i].getAttribute("selected");
			if(sel == "true"){
                let overlay = new mxCellOverlay(new mxImage("/img/check.png", 16, 16), 'Overlay tooltip');
                this.getModelUtil().getVGraph().getGraph().addCellOverlay(cells[i], overlay);
            }
        }
    }

    // constraints in element creation, only allow to create one root element in the model
    public customConstraintsElementCreation(graph:any, vertexToClone:any){
        let returnConstraintElementCreation = {};

        if(vertexToClone.getAttribute("type") == "root"){
            let featureRoot = graph.getModel().getCell("feature");    
            let featureVertices = graph.getModel().getChildVertices(featureRoot);

            for (let i = 0; i < featureVertices.length; i++) {
                if(featureVertices[i].getAttribute("type") == "root"){
                    returnConstraintElementCreation = {"message":"Only one Root element allowed in this model"};
                    break;
                }
            }
        }

        return returnConstraintElementCreation;
    }
    
    //example of custom graph config
    /*public customGraphConfig(){
        let graph = this.getModelUtil().getVGraph().getGraph();
        graph.setSplitEnabled(false);
    }*/
}