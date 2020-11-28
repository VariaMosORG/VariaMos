import { mxgraphFactory } from "ts-mxgraph";
const { mxUtils, mxCell, mxGeometry, mxToolbar } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ConfigElements {
    
    private currentModel:any; //current loaded model (FeatureModel)
    private graph:any; //mxGraph (mxGraph)
    private model:any; //mxGraphModel (mxGraphModel)
    private divElements:any; //div elements (HTMLElement)
    private toolbar:any; //toolbar (mxToolbar)
    private $modal:any; //references modalPlugin

    public constructor(graph:any, model:any, currentModel:any, divElements:any, modal:any) {
        this.currentModel = currentModel;
        this.graph = graph;
        this.model = model;
        this.divElements = divElements;
        this.$modal = modal;
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

    public getDivElements(){
        return this.divElements;
    }

    public getToolbar(){
        return this.toolbar;
    }

    public initializeElements(){
        this.toolbar = new mxToolbar(this.divElements);
        for (let i = 0; i < this.currentModel.elements.length; i++) {
            this.addVertex(this.currentModel.elements[i]);
        }
    }

    public addVertex(element:any){
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement(element.type);
        
        if(element.properties.length > 0){
            for (let i = 0; i < element.properties.length; i++) {
                node.setAttribute(element.properties[i].id, element.properties[i].defValue);
            }
        }

        let vertex = new mxCell(node, new mxGeometry(0, 0, element.width, element.height), element.style);
        vertex.setConnectable(true);
        vertex.setVertex(true);
        this.addToolbarItem(vertex, element);
    }

    public addToolbarItem(vertexToClone:any, element:any){
        const graph = this.graph;
        const currentModel = this.currentModel;
        const modal = this.$modal;

        let drapAndDropCreation = function(graph:any, evt:any, cell:any){
            //check custom model constraints in element creation
            let customConstraintsElementCreation = currentModel.customConstraintsElementCreation(graph);
            if(customConstraintsElementCreation.message){
                modal.setData("error", "Error", customConstraintsElementCreation.message);
                modal.click();
                return null;
            }

            graph.stopEditing(false);
            let pt = graph.getPointForEvent(evt);
            let vertex = graph.getModel().cloneCell(vertexToClone);
            vertex.geometry.x = pt.x;
            vertex.geometry.y = pt.y;
            let newCells = graph.importCells([vertex], 0, 0, cell);
        }

        let mdiv = document.createElement('div');
        let mspan = document.createElement('span'); //tooltip
        mspan.classList.add("csstooltiptext2");

        let img = this.toolbar.addMode(element.label, "/img/custom_models/"+this.currentModel.type+"/"+element.icon, drapAndDropCreation);
        mspan.innerText = img.getAttribute('title');
        img.removeAttribute('title');

        mxUtils.makeDraggable(img, graph, drapAndDropCreation);

        mdiv.classList.add("pallete-div");
        mdiv.classList.add("csstooltip");
        mdiv.appendChild(img);
        mdiv.appendChild(mspan);
        this.divElements.appendChild(mdiv);
    }
}