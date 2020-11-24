import { mxgraphFactory } from "ts-mxgraph";
const { mxCodec, mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ProjectOperations {
    
    private graph:any; //mxGraph (mxGraph)
    private model:any; //mxGraphModel (mxGraphModel)
    private currentProject:any;
    private $store:any;

    public constructor(graph:any, model:any, currentProject:any, store:any) {
        this.graph = graph;
        this.model = model;
        this.currentProject = currentProject;
        this.$store = store;
    }

    public getGraph(){
        return this.graph;
    }

    public getModel(){
        return this.model;
    }

    public getCurrentProject(){
        return this.currentProject;
    }

    public saveAll(index:any){
        let encoder = new mxCodec();
        let result = encoder.encode(this.model);
        let xml = mxUtils.getPrettyXml(result);
        this.currentProject.setXml(xml);
        this.$store.commit("updateProject", {"project":this.currentProject, "index":index});
    }
}