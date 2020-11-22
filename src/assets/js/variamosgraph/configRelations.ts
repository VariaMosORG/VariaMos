import { mxgraphFactory } from "ts-mxgraph";
const { mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class configRelations {
    
    public currentModel: any; //current loaded model (FeatureModel)
    public graph:any; //mxGraph (mxGraph)
    public model:any; //mxGraphModel (mxGraphModel)

    public constructor(graph:any, model:any, currentModel:any) {
        this.currentModel = currentModel;
        this.graph = graph;
        this.model = model;
    }

    public initializeRelations(){
        //to continue
        /*let graph = this.graph;
        graph.connectionHandler.insertEdge = function(parent:any, id:any, value:any, source:any, target:any, style:any){
            let doc = mxUtils.createXmlDocument();
            let node = doc.createElement('rel_' + source.getAttribute("type") + '_' + target.getAttribute("type"));
            node.setAttribute('type', "relation");

            if(target.edges != null && target.edges.length > 0){
                for (let i = 0; i < target.edges.length; i++) {
                    if(target.edges[i].target.getId() == source.getId()){
                        alert("Bidirectional connections not allowed");
                        return null;
                    }
                }
            }



            let cell = graph.insertEdge(parent, id, node, source, target, style);
            return cell;
        }*/
    }
}