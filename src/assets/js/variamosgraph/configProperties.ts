import { mxgraphFactory } from "ts-mxgraph";
import { Model } from '../Model/Model';
const { mxEvent } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class configProperties {
    
    public currentModel: Model; //current loaded model (FeatureModel)
    public graph: any; //mxGraph (mxGraph)
    public model: any; //mxGraphModel (mxGraphModel)
    public divProperties:any; //div properties (HTMLElement)

    public constructor(graph:any, model:any, currentModel:Model, divProperties:any) {
        this.currentModel = currentModel;
        this.graph = graph;
        this.model = model;
        this.divProperties = divProperties;
    }

    public initializeProperties(){
        let configPropertiesObject = this;
        let selChanges = this.selectionChanged;

        this.graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender:any, evt:any){
            selChanges(configPropertiesObject);
        });
    }

    public selectionChanged(configPropertiesObject:any){
        configPropertiesObject.graph.container.focus();
        configPropertiesObject.divProperties.innerHTML="";
        let cell = configPropertiesObject.graph.getSelectionCell();
        let elements = configPropertiesObject.currentModel.elements;

        if(cell != null){
            if(cell.value.attributes){
                let currentType = cell.getAttribute("label");
                let currentProperties = null;
                
                for (let i = 0; i < elements.length; i++){
                    if(elements[i].type == currentType){
                        currentProperties = elements[i].properties;
                    }
                }

                for (let i = 0; i < currentProperties.length; i++){
                    configPropertiesObject.createTextField(currentProperties[i]);
                }
            }
        }
    }

    public createTextField(currentProperty:any){
        let input = document.createElement('input');
	
	    input.setAttribute('type', "text");
        input.id="property-"+currentProperty.id;
        input.className="form-control";
        input.value = currentProperty.defValue;
        
        this.createField(input, currentProperty.label);
    }

    public createField(input:any, label:any){
        let tr = document.createElement('div');
        //tr.id="tr-"+name;
        tr.className="tr-unique";
        tr.style.display="";
        let td = document.createElement('div');
        td.innerText=label+": ";
        tr.appendChild(td);
        td.appendChild(input);
        tr.appendChild(td);
        this.divProperties.appendChild(tr);
    }
}