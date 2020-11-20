import { Model } from "../../model/Model";
import { MElement } from '../../model/MElement';

export class FeatureModel extends Model {

    public constructor(elements: MElement[]) {
        super("FeatureModel",elements);
    }
    
}