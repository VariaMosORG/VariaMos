import { MElement } from "../../../model/MElement";

export class ConcreteElement extends MElement {
    public constructor(){
        super("rectangle.png",
            "concrete",
            100,
            35,
            "",
            "Concrete Feature");
        this.properties.push(
            { "id":"selected", "label": "Selected", "defValue":"false", "inputType":"text", "disabled":"false"}
        );
    }
}