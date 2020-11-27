import { MElement } from "../../../model/MElement"; 

export class AbstractElement extends MElement {
    public constructor(currentModel:any){
        super(
            "rectangle2.png",
            "abstract",
            100,
            35,
            "strokeWidth=2",
            "Abstract Feature",
            currentModel
        );
    }
}