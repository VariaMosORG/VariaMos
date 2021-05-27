import { Model } from "../../model/Model";

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class CircleModel extends Model {

    public constructor() {
        super(
            "circle",
            ["CircleElement"]
        );
    }
}