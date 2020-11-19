import { mxgraph, mxgraphFactory } from "ts-mxgraph";

export class VariaMosGraph {

    public graph:any; //mxGraph
    public model:any; //mxGraphModel

    public constructor() {
        const { mxGraphModel } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        this.model = new mxGraphModel();
    }

    public setGraph(container:any){
        const { mxGraph } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        if (container) {
            this.graph = new mxGraph(container, this.model);
        }
    }

    public createModel() : void{
        if (this.graph) {
            let parent = this.graph.getDefaultParent();
            let vertex = this.graph.insertVertex(parent, null, 'Hello, World!', 20, 20, 180, 60,'boxstyle');
        }
    }

}