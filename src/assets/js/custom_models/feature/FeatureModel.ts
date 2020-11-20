import { Model } from "../../model/Model";
import { MElement } from '../../model/MElement';

export class FeatureModel extends Model {

    public constructor() {
        super("feature",
            ["RootElement", "AbstractElement", "ConcreteElement", "BundleElement"]
        );
    }
    
}