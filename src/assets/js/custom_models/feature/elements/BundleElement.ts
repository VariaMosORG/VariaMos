import { MElement } from "../../../model/MElement";

export class BundleElement extends MElement {
    public constructor(){
        super(
            "bundle.png",
            "bundle",
            35,
            35,
            "shape=ellipse",
            "Bundle"
        );
    }
}