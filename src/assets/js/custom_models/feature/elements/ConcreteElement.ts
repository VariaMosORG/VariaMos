import { MElement } from "../../../model/MElement";

export class ConcreteElement extends MElement {
    public constructor(){
        super(
            "rectangle.png",
            "concrete",
            100,
            35,
            "",
            "Concrete Feature"
        );
        let properties = this.getProperties();
        properties.push(
            { 
                "id":"selected", "label": "Selected", "defValue":"false", 
                "inputType":"checkbox", "disabled":"false", "display":"true"
            }
        );
        this.setProperties(properties);
    }
}