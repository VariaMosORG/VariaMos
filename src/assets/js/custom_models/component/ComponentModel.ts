import { Model } from "../../model/Model";

export class ComponentModel extends Model {

    public constructor() {
        super("component",
            ["ComponentElement", "FileElement", "FragmentElement", "CustomElement"]
        );
        this.constraints = [
            {
                "source":"true", "type":"component", "attr":null,
                "value":null, "min":0, "max":0, "validNeighbors":null,
                "countError":"Invalid connection", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"file", "attr":null,
                "value":null, "min":0, "max":1, "validNeighbors":["component"],
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"custom", "attr":null,
                "value":null, "min":0, "max":1, "validNeighbors":["component"],
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"fragment", "attr":null,
                "value":null, "min":0, "max":null, "validNeighbors":["file","component"],
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            },
        ];
    }
    
}