import { Element } from "../../../model/Element";

export class AbstractElement extends Element {
    public constructor(){
        super("rectangle2.png",
            "abstract",
            100,
            35,
            "strokeWidth=2",
            "Abstract Feature");
    }
}