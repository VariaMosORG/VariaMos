import { MElement } from "../../../model/MElement"; 

export class ComponentElement extends MElement {
    public constructor(currentModel:any){
        super(
            "component.png",
            "component",
            100,
            40,
            "shape=component",
            "Component",
            currentModel
        );
    }
}