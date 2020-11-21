import { mxgraphFactory } from "ts-mxgraph";
import { Model } from '../Model/Model';
const { mxEvent, mxCellAttributeChange } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

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
                let currentType = cell.getAttribute("type");
                let currentProperties = null;
                let attrs = cell.value.attributes;
                
                for (let i = 0; i < elements.length; i++){
                    if(elements[i].type == currentType){
                        currentProperties = elements[i].properties;
                    }
                }

                for (let i = 0; i < attrs.length; i++){
                    for (let j = 0; j < currentProperties.length; j++){
                        if(currentProperties[j].id == attrs[i].nodeName){
                            configPropertiesObject.createTextField(configPropertiesObject.graph, attrs[i], cell, currentProperties[j]);
                        }
                    }
                }
            }
        }
    }

    public createTextField(graph:any, attribute:any, cell:any, currentProperties:any){
        let input = document.createElement('input');
	
	    input.setAttribute('type', "text");
        input.id = "property-" + attribute.nodeName;

        if(currentProperties.disabled == "true"){ //disable input
            input.disabled = true;
        }

        input.className="form-control";
        input.value = attribute.nodeValue;
        
        this.createField(input, attribute.nodeName);
        this.executeApplyHandler(graph, input, cell, attribute.nodeName);
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

    public executeApplyHandler(graph:any, input:any, cell:any, attributeNodeName:any){
        let applyHandler = function(){
            let oldValue = cell.getAttribute(attributeNodeName, '');
            let newValue = input.value;
            if (newValue != oldValue){ //verify value modified from the form
                graph.getModel().beginUpdate();
                try{
                    let edit = new mxCellAttributeChange(cell, attributeNodeName, newValue); //change to newValue
                    graph.getModel().execute(edit);
                }
                catch(error){
                    console.log(error);
                }
				finally{
					graph.getModel().endUpdate();
				}
            }
        }
        mxEvent.addListener(input, 'focusout', applyHandler);
    }
}