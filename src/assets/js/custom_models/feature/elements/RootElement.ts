import { ModelElement } from "../../../model/ModelElement";

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class RootElement extends ModelElement {
    public constructor(currentModel:any){
        super(
            "rectangle3.png",
            "root",
            100,
            35,
            "strokeWidth=3",
            "Root Feature",
            currentModel
        );
    }
}