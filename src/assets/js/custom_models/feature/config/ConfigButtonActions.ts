import { ConfigButtonActions as CBA } from "../../../variamosgraph/ConfigButtonActions";

export class ConfigButtonActions extends CBA {

    public constructor(vGraph:any, buttons:any) {
        super(vGraph, buttons);
    }

    //example of custom 'zoom in' button for this model
    /*public zoomIn(currentButton:HTMLElement){
        currentButton.addEventListener('click', function () {
            console.log("custom zoom");
        });
    }*/
}