import { Model } from "../../model/Model";

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
    }
    
}