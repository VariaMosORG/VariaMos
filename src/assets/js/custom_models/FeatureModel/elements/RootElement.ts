import { Element } from "../../../model/Element";

export class RootElement extends Element {
    public constructor(){
        super("rectangle3.png",
            "root",
            100,
            35,
            "strokeWidth=3",
            "Root Feature");
    }
}