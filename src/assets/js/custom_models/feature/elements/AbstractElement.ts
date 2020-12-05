import { ModelElement } from "../../../model/ModelElement"; 

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
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