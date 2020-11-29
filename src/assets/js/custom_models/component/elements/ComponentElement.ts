import { ModelElement } from "../../../model/ModelElement"; 

export class ComponentElement extends ModelElement {
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