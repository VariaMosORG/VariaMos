import { Model } from "../../model/Model";
import { mxgraphFactory } from "ts-mxgraph";
const {mxImage, mxCellOverlay } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class FeatureModel extends Model {

    public constructor() {
        super("feature",
            ["RootElement", "AbstractElement", "ConcreteElement", "BundleElement"]
        );
        this.constraints = [
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
        this.relationProperties.push(
            { 
                "id":"relType", "label":"RelType", "defValue":"mandatory", "inputType":"select",
                "input_values":["mandatory","optional","requires","excludes"], "display":"true"
            }
        );
    }

    public overlayStart(){
        let cells = this.modelUtil.searchCellsByType(this.type, "concrete");
        for (let i = 0; i < cells.length; i++) {
            let sel = cells[i].getAttribute("selected");
			if(sel == "true"){
                let overlay = new mxCellOverlay(new mxImage("/img/check.png", 16, 16), 'Overlay tooltip');
                this.modelUtil.getGraph().addCellOverlay(cells[i], overlay);
            }
        }
    }
    
}