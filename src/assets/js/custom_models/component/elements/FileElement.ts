import { MElement } from "../../../model/MElement";

export class FileElement extends MElement {
    public constructor(currentModel:any){
        super(
            "file.png",
            "file",
            100,
            40,
            "shape=file",
            "File",
            currentModel
        );
    }
}