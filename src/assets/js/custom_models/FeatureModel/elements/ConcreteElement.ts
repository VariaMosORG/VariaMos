import { Element } from "../../../model/Element";

export class ConcreteElement extends Element {
    public constructor(){
        super("rectangle.png",
            "concrete",
            100,
            35,
            "",
            "Concrete Feature");
    }
}