import { mxgraphFactory } from "ts-mxgraph";
const { mxUtils, mxCell, mxGeometry, mxToolbar, mxConstants } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ConfigElements {
    
    private vGraph:any; //VariaMos Graph
    private toolbar:any; //toolbar (mxToolbar)

    public constructor(vGraph:any) {
        this.vGraph = vGraph;
    }

    public getToolbar(){
        return this.toolbar;
    }

    public initializeElements(){
        this.toolbar = new mxToolbar(this.vGraph.getDivElements());
        const currentModel = this.vGraph.getCurrentModel();
        for (let i = 0; i < currentModel.elements.length; i++) {
            this.addVertex(currentModel.elements[i]);
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
        const graph = this.vGraph.getGraph();
        const currentModel = this.vGraph.getCurrentModel();
        const modal = this.vGraph.getModal();

        let drapAndDropCreation = function(graph:any, evt:any, cell:any){
            //check custom model constraints in element creation
            let customConstraintsElementCreation = currentModel.customConstraintsElementCreation(graph, vertexToClone);
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
            graph.setSelectionCells(newCells);

            //start cloning feature
            let clonesInfo = currentModel.getElementClones();
            if(clonesInfo[vertex.getAttribute("type")]){ //check if clone is defined for current element
                let clonDestinationModel = clonesInfo[vertex.getAttribute("type")];
                if(graph.getModel().getCell(clonDestinationModel)){ //if the destination model is available
                    graph.getModel().prefix = "clon"; //cloned cell contains clon prefix
                    graph.getModel().nextId = graph.getModel().nextId - 1;
                    let vertex2 = graph.getModel().cloneCell(newCells[0]);
                    let parent2 = graph.getModel().getCell(clonDestinationModel);
                    graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#DCDCDC", [vertex2]); //different background for a cloned cell
                    graph.importCells([vertex2], 0, 0, parent2);
                    graph.getModel().prefix = ""; //restart prefix
                }
            }
            //end cloning feature
        }

        let mdiv = document.createElement('div');
        let mspan = document.createElement('span'); //tooltip
        mspan.classList.add("csstooltiptext2");
        let imgSrc = require("@/assets/js/custom_models/"+this.vGraph.getCurrentModel().type+"/img/"+element.icon);
        let img = this.toolbar.addMode(element.label, imgSrc, drapAndDropCreation);
        mspan.innerText = img.getAttribute('title');
        img.removeAttribute('title');

        mxUtils.makeDraggable(img, graph, drapAndDropCreation);

        mdiv.classList.add("pallete-div");
        mdiv.classList.add("csstooltip");
        mdiv.appendChild(img);
        mdiv.appendChild(mspan);
        this.vGraph.getDivElements().appendChild(mdiv);
    }
}