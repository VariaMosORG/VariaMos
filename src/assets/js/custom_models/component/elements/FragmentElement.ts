import { ModelElement } from "../../../model/ModelElement";

export class FragmentElement extends ModelElement {
    public constructor(currentModel:any){
        super(
            "fragment.png",
            "fragment",
            100,
            40,
            "shape=fragment",
            "Fragment",
            currentModel
        );

        let properties = this.getProperties();
        properties.push(
            { 
                "id":"filename", "label":"Filename", "defValue":"", 
                "inputType":"text", "disabled":"false", "display":"true"
            }
        );
        this.setProperties(properties);
    }
}