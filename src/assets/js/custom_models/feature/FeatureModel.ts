import { Model } from "../../model/Model";

export class FeatureModel extends Model {

    public constructor() {
        super("feature",
            ["RootElement", "AbstractElement", "ConcreteElement", "BundleElement"]
        );
    }
    
}