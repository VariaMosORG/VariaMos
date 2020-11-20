import { MElement } from "../../../model/MElement";

export class ConcreteElement extends MElement {
    public constructor(){
        super("rectangle.png",
            "concrete",
            100,
            35,
            "",
            "Concrete Feature");
    }
}