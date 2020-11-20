import { mxgraphFactory } from "ts-mxgraph";
import { Button } from './Button';
import { configButtonActions } from './configButtonActions';
import { configElements } from './configElements';
const { mxGraphModel, mxGraph, mxOutline, mxRubberband, mxRectangle } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

/* */
import { MElement } from '../model/MElement';
import { FeatureModel } from '../custom_models/feature/FeatureModel';
import { AbstractElement } from '../custom_models/feature/elements/AbstractElement';
import { RootElement } from '../custom_models/feature/elements/RootElement';
/* */

export class VariaMosGraph {

    public graph:any; //mxGraph (mxGraph)
    public model:any; //mxGraphModel (mxGraphModel)
    public modelType:string = ""; //current model type 
    public currentModel:any; //current loaded model (FeatureModel)
    public divContainer:any; //div container (HTMLElement)
    public divNavigator:any; //div navigator (HTMLElement)
    public divElements:any; //div elements (HTMLElement)
    public configButtonActions:any; //configButtons (configButtonActions)
    public configElements:any; //configElements (configElements)

    public static buttons: Button[] = [ new Button("save","Save","save"),
            new Button("pdf","PDF","print"),
            new Button("img","Img","print"),
            new Button("delete","Delete","eraser"),
            new Button("resetall","Reset All","eraser"),
            new Button("export","Export","upload"),
            new Button("xml","View XML","code"),
        ]

    public constructor() {
        this.model = new mxGraphModel();
    }

    public initializeGraph(modelType:string, divContainer:any, divNavigator:any, divElements:any){
        this.modelType = modelType;
        this.divElements = divElements;
        this.divContainer = divContainer;
        this.divNavigator = divNavigator;
        this.setGraph();
        this.setNavigator();
        this.setConfigModel();
        this.setButtonActions();
        this.setElements();
    }

    public setGraph(){
        if (this.divContainer) {
            this.graph = new mxGraph(this.divContainer, this.model);
        }
    }

    public setNavigator(){
        let outline = new mxOutline(this.graph, this.divNavigator);
        outline.refresh();
    }

    public setButtonActions(){
        this.configButtonActions = new configButtonActions(this.graph, this.model, VariaMosGraph.buttons);
        this.configButtonActions.initializeActions();
    }

    public setConfigModel() : void {
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

    public setElements() : void{
        this.currentModel = new FeatureModel([new RootElement(),new AbstractElement()]); 
        this.configElements = new configElements(this.graph, this.model, this.currentModel, this.divElements);
        this.configElements.initializeElements();
    }

    /*public createModel() : void{
        let parent = this.graph.getDefaultParent();
        let vertex = this.graph.insertVertex(parent, null, 'Hello, World!', 20, 20, 180, 60,'boxstyle');
    }*/

}