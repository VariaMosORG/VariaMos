import { Element } from "../../../model/Element";

export class BundleElement extends Element {
    public constructor(){
        super("bundle.png",
            "bundle",
            35,
            35,
            "shape=ellipse",
            "Bundle");
    }
}