import { mxgraphFactory } from "ts-mxgraph";
import { Model } from '../Model/Model';

export class configElements {

    public currentModel: Model;
    public graph: any;
    public model: any;
    public divElements:any;
    public toolbar:any; //toolbar (mxToolbar)

    public constructor(graph:any, model:any, currentModel:Model, divElements:any) {
        this.currentModel = currentModel;
        this.graph = graph;
        this.model = model;
        this.divElements = divElements;
    }

    public initializeElements(){
        const { mxToolbar } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        this.toolbar = new mxToolbar(this.divElements);
        for (let i = 0; i < this.currentModel.elements.length; i++) {
            this.addVertex(this.currentModel.elements[i]);
        }
    }

    public addVertex(element:any){
        const { mxUtils, mxCell, mxGeometry } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement(element.type);
        node.setAttribute('label', element.type);
        node.setAttribute('type', element.type);

        let vertex = new mxCell(node, new mxGeometry(0, 0, element.width, element.height), element.style);
        vertex.setConnectable(true);
        vertex.setVertex(true);
        this.addToolbarItem(vertex, element);
    }

    public addToolbarItem(vertexToClone:any, element:any){
        const { mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        const graph = this.graph;

        let drapAndDropCreation = function(graph:any, evt:any, cell:any){
            graph.stopEditing(false);
            let pt = graph.getPointForEvent(evt);
            let vertex = graph.getModel().cloneCell(vertexToClone);
            vertex.geometry.x = pt.x;
            vertex.geometry.y = pt.y;
            let newCells = graph.importCells([vertex], 0, 0, cell);
        }

        let mdiv = document.createElement('div');
        let span = document.createElement('span');
        span.innerHTML = element.label + "<br />";
        mdiv.appendChild(span);

        let img = this.toolbar.addMode(element.label, element.icon, drapAndDropCreation);
        mxUtils.makeDraggable(img, graph, drapAndDropCreation);

        mdiv.classList.add("pallete-div"); 
        mdiv.appendChild(img);
        this.divElements.appendChild(mdiv);
    }
}