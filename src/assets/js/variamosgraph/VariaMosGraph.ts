import { mxgraph, mxgraphFactory } from "ts-mxgraph";
import { Button } from './Button';
import { ButtonActions } from './ButtonActions';

export class VariaMosGraph {

    public graph:any; //mxGraph
    public model:any; //mxGraphModel
    public buttonActions:any;

    public static buttons: Button[] = [ new Button("save","Save","save"),
            new Button("pdf","PDF","print"),
            new Button("img","Img","print"),
            new Button("delete","Delete","eraser"),
            new Button("resetall","Reset All","eraser"),
            new Button("export","Export","upload"),
            new Button("xml","View XML","code"),
         ]

    public constructor() {
        const { mxGraphModel } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        this.model = new mxGraphModel();
    }

    public initializeGraph(container:any, navigator:any){
        this.setGraph(container);
        this.setNavigator(navigator);
        this.setButtonActions();
        this.configModel();
    }

    public setGraph(container:any){
        const { mxGraph } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        if (container) {
            this.graph = new mxGraph(container, this.model);
        }
        this.buttonActions = new ButtonActions(this.graph, this.model, VariaMosGraph.buttons);
    }

    public setNavigator(navigator:any){
        const { mxOutline } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        let outline = new mxOutline(this.graph, navigator);
        outline.refresh();
    }

    public setButtonActions(){
        this.buttonActions.initilizeActions();
    }

    public configModel() : void {
        const { mxRubberband, mxRectangle } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        this.graph.dropEnabled = true;
		this.graph.setConnectable(true); // Enables new connections in the graph
		this.graph.setMultigraph(false);
		this.graph.setAllowDanglingEdges(false);
		this.graph.setCellsDisconnectable(false) // Avoid disconnect egdes
		this.graph.setDisconnectOnMove(false);
		this.graph.setPanning(true);
		this.graph.setCellsEditable(false); // Avoid double click cells
		new mxRubberband(this.graph); // Enables rectangular selection
		this.graph.maximumGraphBounds = new mxRectangle(0, 0, 4000, 4000);
    }

    public createModel() : void{
        let parent = this.graph.getDefaultParent();
        let vertex = this.graph.insertVertex(parent, null, 'Hello, World!', 20, 20, 180, 60,'boxstyle');
    }

}