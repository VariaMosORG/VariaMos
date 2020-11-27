import { MElement } from "../../../model/MElement";

export class BundleElement extends MElement {
    public constructor(currentModel:any){
        super(
            "bundle.png",
            "bundle",
            35,
            35,
            "shape=ellipse",
            "Bundle",
            currentModel
        );

        let properties = this.getProperties();
        properties.push(
            { 
                "id":"bundleType", "label": "Bundle Type", "defValue":"AND", 
                "inputType":"select", "input_values":["AND","OR","XOR","RANGE"],
                "display":"true", 
            }
        );
        this.setProperties(properties);
    }
}