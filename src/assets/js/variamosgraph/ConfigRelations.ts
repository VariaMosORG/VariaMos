import { mxgraphFactory } from "ts-mxgraph";
const { mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ConfigRelations {
    
    private currentModel: any; //current loaded model (FeatureModel)
    private graph:any; //mxGraph (mxGraph)
    private model:any; //mxGraphModel (mxGraphModel)

    public constructor(graph:any, model:any, currentModel:any) {
        this.currentModel = currentModel;
        this.graph = graph;
        this.model = model;
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

    public initializeRelations(){
        let graph = this.graph;
        let currentModel = this.currentModel;
        graph.connectionHandler.insertEdge = function(parent:any, id:any, value:any, source:any, target:any, style:any){
            let doc = mxUtils.createXmlDocument();
            let node = doc.createElement('rel_' + source.getAttribute("type") + '_' + target.getAttribute("type"));

            //by default bidirectional edges are not allowed (disjoint)
            if(target.edges != null && target.edges.length > 0){
                for (let i = 0; i < target.edges.length; i++) {
                    if(target.edges[i].target.getId() == source.getId()){
                        alert("Bidirectional connections not allowed");
                        return null;
                    }
                }
            }

            //set properties to the edge
            let currentProperties = currentModel.relationProperties;
            for (let i = 0; i < currentProperties.length; i++) {
                node.setAttribute(currentProperties[i].id, currentProperties[i].defValue);
            }

            let cell = graph.insertEdge(parent, id, node, source, target, style);
            return cell;
        }
    }
}