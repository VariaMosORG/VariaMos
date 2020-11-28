import { Model } from "../../model/Model";

export class BindingFeatureComponentModel extends Model {

    public constructor() {
        super(
            "binding_feature_component",
            []
        );

        let constraints = this.getConstraints();
        constraints = [
            {
                "source":"true", "type":"component", "attr":null,
                "value":null, "min":0, "max":0, "validNeighbors":null,
                "countError":"Invalid connection", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"concrete", "attr":null,
                "value":null, "min":0, "max":1, "validNeighbors":["component"],
                "countError":"Invalid connection", "typeError":"Only shape targets allowed"
            },
        ];
        this.setConstraints(constraints);
    }
}