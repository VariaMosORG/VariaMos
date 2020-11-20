import { Model } from "../../model/Model";

export class ComponentModel extends Model {

    public constructor() {
        super("component",
            ["ComponentElement", "FileElement", "FragmentElement", "CustomElement"]
        );
    }
    
}