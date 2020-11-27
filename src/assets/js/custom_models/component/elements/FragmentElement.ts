import { MElement } from "../../../model/MElement";

export class FragmentElement extends MElement {
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
    }
}