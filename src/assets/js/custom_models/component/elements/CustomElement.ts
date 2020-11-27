import { MElement } from "../../../model/MElement";

export class CustomElement extends MElement {
    public constructor(currentModel:any){
        super(
            "custom.png",
            "custom",
            100,
            40,
            "shape=custom",
            "Custom. File",
            currentModel
        );
    }
}