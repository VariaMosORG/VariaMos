import { ModelElement } from "../../../model/ModelElement";

export class CircleElement extends ModelElement {
    public constructor(currentModel:any){
        super(
            "circle.png",
            "Circle",
            100,
            100,
            "shape=ellipse",
            "Circle",
            currentModel
        );
    }
}