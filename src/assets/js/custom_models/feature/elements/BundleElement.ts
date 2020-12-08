import { ModelElement } from "../../../model/ModelElement";

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class BundleElement extends ModelElement {
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
                "inputType":"select", "inputValues":["AND","OR","XOR","RANGE"],
                "display":"true", "onchange":this.getOnChangeBundleTypeFunction()
            },
            { 
                "id":"lowRange", "label": "Low Range", "defValue":"1", 
                "inputType":"text", "customTypeText":"number", "display":"basedOnPropertyValue", 
                "displayCheckProperty":"bundleType", "displayIfValue":"RANGE",
            },
            { 
                "id":"highRange", "label": "High Range", "defValue":"1", 
                "inputType":"text", "customTypeText":"number", "display":"basedOnPropertyValue", 
                "displayCheckProperty":"bundleType", "displayIfValue":"RANGE",
            },
        );
        this.setProperties(properties);
    }

    //if bundle type is changed to range, then display the high range and low range properties
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