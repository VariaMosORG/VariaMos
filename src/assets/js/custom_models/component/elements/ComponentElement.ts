import { ModelElement } from "../../../model/ModelElement"; 

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
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