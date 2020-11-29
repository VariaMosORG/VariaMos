import { ModelElement } from "../../../model/ModelElement"; 

export class AbstractElement extends ModelElement {
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