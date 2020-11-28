import { mxgraphFactory } from "ts-mxgraph";
import { initCustomFormatter } from 'vue';
const { mxEvent, mxCellAttributeChange } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ConfigProperties {
    
    private currentModel:any; //current loaded model (FeatureModel)
    private graph:any; //mxGraph (mxGraph)
    private model:any; //mxGraphModel (mxGraphModel)
    private divProperties:any; //div properties (HTMLElement)

    public constructor(graph:any, model:any, currentModel:any, divProperties:any) {
        this.currentModel = currentModel;
        this.graph = graph;
        this.model = model;
        this.divProperties = divProperties;
    }

    public getCurrentModel(){
        return this.currentModel;
    }

    public getGraph(){
        return this.graph;
    }

    public getModel(){
        return this.model;
    }

    public getDivProperties(){
        return this.divProperties;
    }

    public initializeProperties(){
        let configPropertiesObject = this;
        let selChanges = this.selectionChanged;

        if(this.graph.getSelectionModel().eventListeners.length > 3){ //remove previous listeners
            this.graph.getSelectionModel().eventListeners.pop();
            this.graph.getSelectionModel().eventListeners.pop();
        }

        this.graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender:any, evt:any){
            selChanges(configPropertiesObject);
        });
    }

    public selectionChanged(configPropertiesObject:any){
        configPropertiesObject.graph.container.focus();
        configPropertiesObject.divProperties.innerHTML = "";
        let cell = configPropertiesObject.graph.getSelectionCell();
        let elements = configPropertiesObject.currentModel.elements;
        if(cell != null){
            if(cell.value.attributes){
                let currentType = cell.getAttribute("type");
                let currentProperties = [];
                let attrs = cell.value.attributes;

                if(cell.isVertex()){ //get properties for current vertex
                    for (let i = 0; i < elements.length; i++){
                        if(elements[i].type == currentType){
                            currentProperties = elements[i].properties;
                        }
                    }
                }

                if(cell.isEdge()){ //get properties for current edge
                    currentProperties = configPropertiesObject.currentModel.relationProperties;
                }

                configPropertiesObject.setIdProperty(cell);

                for (let i = 0; i < attrs.length; i++){
                    for (let j = 0; j < currentProperties.length; j++){
                        if(currentProperties[j].id == attrs[i].nodeName){
                            switch (currentProperties[j].inputType) {
                                case "text":
                                    configPropertiesObject.createTextField(configPropertiesObject.graph, attrs[i], cell, currentProperties[j]);
                                    break;
                                case "select":
                                    configPropertiesObject.createSelectField(configPropertiesObject.graph, attrs[i], cell, currentProperties[j]);
                                    break;
                                case "checkbox":
                                    configPropertiesObject.createCheckboxField(configPropertiesObject.graph, attrs[i], cell, currentProperties[j]);
                                    break;
                                default:
                                    configPropertiesObject.createTextField(configPropertiesObject.graph, attrs[i], cell, currentProperties[j]);
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    public setIdProperty(cell:any){
        let idSection = document.createElement('div');
        idSection.className = "property-id-section";
        if(cell.isVertex()){
            idSection.innerText = "ID: "+cell.getId();
        }else{
            idSection.innerText = "Source: "+cell.source.getId()+" - Target: "+cell.target.getId();
        }
        this.divProperties.appendChild(idSection);
    }

    public createCheckboxField(graph:any, attribute:any, cell:any, currentProperties:any){
        let input = document.createElement('input');	
	    input.setAttribute('type', "checkbox");
        input.id = "property-" + attribute.nodeName;

        if (attribute.nodeValue == "true")
        {
            input.checked = true;
        }

        input.className = "form-control";
        input.value = attribute.nodeValue;
        this.createField(attribute, input, currentProperties.label, currentProperties.disabled, currentProperties.display);
        this.executeApplyHandler(graph, input, cell, attribute.nodeName, currentProperties);
    }

    public createSelectField(graph:any, attribute:any, cell:any, currentProperties:any){
        let values = currentProperties.input_values;
        let input = document.createElement("select");
        input.id = "property-" + attribute.nodeName;

        for (let i = 0; i < values.length; i++){
            let option = document.createElement("option");
            option.setAttribute("value", values[i]);
            option.innerText = values[i];
            if (values[i] == attribute.nodeValue){
                option.setAttribute("selected", "selected");
            }
            input.appendChild(option);
        }

        input.className="form-control";        
        this.createField(attribute, input, currentProperties.label, currentProperties.disabled, currentProperties.display);
        this.executeApplyHandler(graph, input, cell, attribute.nodeName, currentProperties);
    }

    public createTextField(graph:any, attribute:any, cell:any, currentProperties:any){
        let input = document.createElement('input');	
	    input.setAttribute('type', "text");
        input.id = "property-" + attribute.nodeName;
        input.className = "form-control";
        input.value = attribute.nodeValue;
        let display =  this.checkCustomDisplay(cell, currentProperties);       
        this.createField(attribute, input, currentProperties.label, currentProperties.disabled, display);
        this.executeApplyHandler(graph, input, cell, attribute.nodeName, currentProperties);
    }

    public checkCustomDisplay(cell:any, currentProperties:any){
        if(currentProperties.display){
            if(currentProperties.display == "basedOnPropertyValue"){
                if(currentProperties.displayIfValue == cell.getAttribute(currentProperties.displayCheckProperty)){
					return "true";
				}else{
                    return "false";
                }
            }else if(currentProperties.display == "false"){
                return "false";
            }
        }
        return "true";
    }

    public createField(attribute:any, input:any, label:any, disabled:any, display:any){
        let tr = document.createElement('div');

        if(disabled == "true"){ //disable input
            input.disabled = true;
        }

        if(display == "true"){
            tr.style.display = "";
        }else{
            tr.style.display = "none";
        }

        tr.className = "div-property-field";
        tr.id = "tr-" + attribute.nodeName;
        let td = document.createElement('div');
        td.innerText = label+": ";
        tr.appendChild(td);
        td.appendChild(input);
        tr.appendChild(td);
        this.divProperties.appendChild(tr);
    }

    public executeApplyHandler(graph:any, input:any, cell:any, attributeNodeName:any, currentProperties:any){
        this.applyCustomFunctions(input, cell, currentProperties);
        let applyHandler = function(){
            let oldValue = cell.getAttribute(attributeNodeName, '');
            let newValue = input.value;

            if(input.type == "checkbox"){
				newValue = "false";
				if(input.checked){
					newValue = "true";
				}
            }
            
            if (newValue != oldValue){ //verify value modified from the form
                graph.getModel().beginUpdate();
                try{
                    let edit = new mxCellAttributeChange(cell, attributeNodeName, newValue); //change to newValue
                    graph.getModel().execute(edit);

                    //update clon cell if exists
                    let clon = graph.getModel().getCell("clon"+cell.getId());
					if(clon){
						let edit2 = new mxCellAttributeChange(clon, attributeNodeName, newValue);
						graph.getModel().execute(edit2);
					}
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

    public applyCustomFunctions(input:any, cell:any, currentProperties:any){
        if(currentProperties.onchange){
            input.setAttribute("data-cell-id",cell.getId());
            input.onchange = currentProperties.onchange;
        }

        if(currentProperties.customTypeText){
            input.setAttribute('type', currentProperties.customTypeText);
        }
    }
}