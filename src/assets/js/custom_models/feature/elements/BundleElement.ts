import { MElement } from "../../../model/MElement";

export class BundleElement extends MElement {
    public constructor(currentModel:any){
        super(
            "bundle.png",
            "bundle",
            35,
            35,
            "shape=ellipse",
            "Bundle",
            currentModel
        );

        let properties = this.getProperties();
        properties.push(
            { 
                "id":"bundleType", "label": "Bundle Type", "defValue":"AND", 
                "inputType":"select", "input_values":["AND","OR","XOR","RANGE"],
                "display":"true", "onchange":this.getOnChangeBundleTypeFunction()
            },
            { 
                "id":"lowRange", "label": "Low Range", "defValue":"1", 
                "inputType":"text", "customTypeText":"number", "display":"false", 
            },
            { 
                "id":"highRange", "label": "High Range", "defValue":"1", 
                "inputType":"text", "customTypeText":"number", "display":"false", 
            },
        );
        this.setProperties(properties);
    }

    //if bundle type is change to range, then display the high range and low range
    public getOnChangeBundleTypeFunction(){
        let OnChangeBundleTypeFunction = function(this:any){
            let trLowRange = document.getElementById("tr-lowRange");
            let trHighRange = document.getElementById("tr-highRange");
            if(trLowRange !== null && trHighRange !== null){
                trLowRange.style.display = "none";
                trHighRange.style.display = "none";
                if(this.value == "RANGE"){
                    trLowRange.style.display = "";
                    trHighRange.style.display = "";
                }
            }
        }
        return OnChangeBundleTypeFunction;
    }
}