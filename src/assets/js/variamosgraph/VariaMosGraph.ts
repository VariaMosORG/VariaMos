import { mxgraphFactory } from "ts-mxgraph";
import { Button } from './Button';
import { configButtonActions } from './configButtonActions';
import { configElements } from './configElements';
const { mxGraphModel, mxGraph, mxOutline, 
    mxRubberband, mxRectangle, mxShape, 
    mxUtils, mxCellRenderer, mxConstants,
    mxStencilRegistry, mxStencil, mxCell, 
    mxMultiplicity } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class VariaMosGraph {

    public graph:any; //mxGraph (mxGraph)
    public model:any; //mxGraphModel (mxGraphModel)
    public modelType:string = ""; //current model type - example feature
    public className:string = ""; //current className - example FeatureModel
    public currentModel:any; //current loaded model (FeatureModel)
    public divContainer:any; //div container (HTMLElement)
    public divNavigator:any; //div navigator (HTMLElement)
    public divElements:any; //div elements (HTMLElement)
    public configButtonActions:any; //configButtons (configButtonActions)
    public configElements:any; //configElements (configElements)
    public layers:any; //availble layers of the current model

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

    public initTreeModel(modelsInfo:any){
        let root = new mxCell();
        this.layers = []
        for (let i = 0; i < modelsInfo.length; i++) {
            let mCell =new mxCell();
            mCell.setId(modelsInfo[i].modelType);
            this.layers[modelsInfo[i].modelType] = root.insert(mCell);
        }
        this.model.setRoot(root);
    }

    public async initializeGraph(modelType:string, divContainer:any, divNavigator:any, divElements:any){
        this.modelType = modelType;
        this.className = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1) + "Model";
        this.divElements = divElements;
        this.divContainer = divContainer;
        this.divNavigator = divNavigator;
        this.setGraph(); //create mxGraph object
        this.setCurrentLayer(); //specific current layer to be shown
        this.setNavigator(); //define the div navigator
        this.setConfigModel(); //some graph configs
        this.setButtonActions(); //implement button actions
        await this.setElements(); //wait to load model class and model elements, and then continue
        this.setConstraints(); //set model elements constraints
        this.setCustomShapes(); //set custom shapes
    }

    public setGraph(){
        if (this.divContainer) {
            this.graph = new mxGraph(this.divContainer, this.model);
        }
    }

    public setCurrentLayer(){
		let currentLayer = this.layers[this.modelType]; //current layer to be displayed (feature, component, etc)
        this.graph.setDefaultParent(currentLayer);
        for (let layer in this.layers) { //hide all layers
			this.model.setVisible(this.layers[layer], false);
		}
		this.model.setVisible(currentLayer, true); //unhide current layer
    }

    public setNavigator(){
        let outline = new mxOutline(this.graph, this.divNavigator);
        outline.refresh();
    }

    public setButtonActions(){
        this.configButtonActions = new configButtonActions(this.graph, this.model, VariaMosGraph.buttons);
        this.configButtonActions.initializeActions();
    }

    public removeAllButtonEventListeners(){
        this.configButtonActions.removeAllEventListeners();
    }

    public setConfigModel(){
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

    public async setElements(){
        const modelModule = await import('../'+"custom_models/"+this.modelType+"/"+this.className); //load current model Class
        this.currentModel = new modelModule[this.className]();

        for (let i = 0; i < this.currentModel.elementClassNames.length; i++) {
            //load current model element classes
            const elementModule = await import('../'+"custom_models/"+this.modelType+"/elements/"+this.currentModel.elementClassNames[i]);
            this.currentModel.addElement(new elementModule[this.currentModel.elementClassNames[i]]);
        }

        this.configElements = new configElements(this.graph, this.model, this.currentModel, this.divElements);
        this.configElements.initializeElements();
    }

    public setConstraints(){
        this.graph.multiplicities = [];
        for (let i = 0; i < this.currentModel.constraints.length; i++) {
            this.graph.multiplicities.push(new mxMultiplicity(
                this.currentModel.constraints[i].source,
                this.currentModel.constraints[i].type,
                this.currentModel.constraints[i].attr,
                this.currentModel.constraints[i].value,
                this.currentModel.constraints[i].min,
                this.currentModel.constraints[i].max,
                this.currentModel.constraints[i].validNeighbors,
                this.currentModel.constraints[i].countError,
                this.currentModel.constraints[i].typeError
            ));
        }
    }

    public setCustomShapes(){
        function CustomShape()
		{
			mxShape.call(null);
        };
        
        mxUtils.extend(CustomShape, mxShape);
        mxCellRenderer.registerShape('customShape', CustomShape);

        let req = mxUtils.load('/xml/MX/' + this.modelType + '/custom_shapes.xml');
		let root = req.getDocumentElement();
        let shape = root.firstChild;
        
        while (shape != null)
		{
			if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				mxStencilRegistry.addStencil(shape.getAttribute('name'), new mxStencil(shape));
			}
			shape = shape.nextSibling;
		}
    }
}