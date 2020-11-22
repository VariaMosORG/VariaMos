import { mxgraphFactory } from "ts-mxgraph";
import { Button } from './Button';
import { ConfigButtonActions } from './ConfigButtonActions';
import { ConfigElements } from './ConfigElements';
import { ConfigProperties } from './ConfigProperties';
import { ConfigKeys } from './ConfigKeys';
import { ConfigRelations } from './ConfigRelations';
import { ModelUtil } from './ModelUtil';
const { mxGraphModel, mxGraph, mxOutline, 
    mxRubberband, mxRectangle, mxShape, 
    mxUtils, mxCellRenderer, mxConstants,
    mxStencilRegistry, mxStencil, mxCell, 
    mxMultiplicity, mxKeyHandler, mxImage,
    mxCellOverlay } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class VariaMosGraph {

    public graph:any; //mxGraph (mxGraph)
    public model:any; //mxGraphModel (mxGraphModel)
    public keyHandler:any; //mxKeyHandler (mxKeyHandler)
    public modelType:string = ""; //current model type - example feature
    public className:string = ""; //current className - example FeatureModel
    public currentModel:any; //current loaded model (example FeatureModel)
    public divContainer:any; //div container (HTMLElement)
    public divNavigator:any; //div navigator (HTMLElement)
    public divElements:any; //div elements (HTMLElement)
    public divProperties:any; //div properties (HTMLElement)
    public configButtonActions:any; //configButtons (configButtonActions)
    public configElements:any; //configElements (configElements)
    public configProperties:any; //configProperties (configProperties)
    public configKeys:any; //configKeys (configKeys)
    public configRelations:any; //configRelations (configRelations)
    public layers:any; //availble layers of the current model

    public static buttons: any = {
        "buttonArea":[
            new Button("save","Save","save"),
            new Button("pdf","PDF","print"),
            new Button("img","Img","print"),
            new Button("delete","Delete","eraser"),
            new Button("resetall","Reset All","eraser"),
            new Button("export","Export","upload"),
            new Button("xml","View XML","code"),
        ],
        "navigationArea":[
            new Button("zoomIn","+",""),
            new Button("zoomOut","-",""),
            new Button("zoomReset","R",""),
        ]
    };

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

    public async initializeGraph(modelType:string, divContainer:any, divNavigator:any, divElements:any, divProperties:any, caseLoad:any){
        this.modelType = modelType;
        this.className = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1) + "Model";
        this.divElements = divElements;
        this.divContainer = divContainer;
        this.divNavigator = divNavigator;
        this.divProperties = divProperties;
        if(caseLoad == 1){
            this.setGraph(); //create mxGraph object    
        }
        this.setCurrentLayer(); //specific current layer to be shown
        this.setNavigator(); //define the div navigator
        this.setConfigModel(); //some graph configs
        this.setButtonActions(); //implement button actions
        this.setKeys(); //implement key actions
        await this.loadCurrentModelClasses(); //wait to load model class and model elements, and then continue
        this.setElements(); //load model elements (palette)
        this.setConstraints(); //set model elements constraints
        this.setProperties(); //set model element properties
        this.setRelations(); //set element relations
        this.setMainCellText(); //set the main text to be displayed for cells
        this.setCustomShapes(); //set custom shapes
        this.setOverlay();
    }

    public setGraph(){
        if (this.divContainer) {
            this.graph = new mxGraph(this.divContainer, this.model);
        }
    }

    public setKeys(){
        this.keyHandler = new mxKeyHandler(this.graph);
        this.configKeys = new ConfigKeys(this.graph, this.model, this.keyHandler);
        this.configKeys.initializeKeys();
    }

    public setOverlay(){
        this.currentModel.overlayStart();
    }

    public setRelations(){
        this.configRelations = new ConfigRelations(this.graph, this.model, this.currentModel);
        this.configRelations.initializeRelations();
    }

    public setMainCellText(){
        this.graph.convertValueToString = function(cell:any){
            if(cell.isEdge()){
                return cell.getAttribute('relType', ''); //default attribute showed in drawing area for edges is relType
            }else{
                return cell.getAttribute('label', ''); //default attribute showed in drawing area for vertex is label
            }
        };
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
        let buttonsConcat = VariaMosGraph.buttons.buttonArea;
        buttonsConcat = buttonsConcat.concat(VariaMosGraph.buttons.navigationArea);
        this.configButtonActions = new ConfigButtonActions(this.graph, this.model, buttonsConcat);
        this.configButtonActions.initializeActions();
    }

    public setProperties(){
        this.configProperties = new ConfigProperties(this.graph, this.model, this.currentModel, this.divProperties);
        this.configProperties.initializeProperties();
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

    public async loadCurrentModelClasses(){
        //load current model class
        const modelUtil = new ModelUtil(this.graph, this.model); // create model util and send to current model 
        const modelModule = await import('../'+"custom_models/"+this.modelType+"/"+this.className); //load current model Class
        this.currentModel = new modelModule[this.className]();
        this.currentModel.setModelUtil(modelUtil);

        for (let i = 0; i < this.currentModel.elementClassNames.length; i++) {
            //load current model element classes
            const elementModule = await import('../'+"custom_models/"+this.modelType+"/elements/"+this.currentModel.elementClassNames[i]);
            this.currentModel.addElement(new elementModule[this.currentModel.elementClassNames[i]]);
        }
    }

    public setElements(){
        this.configElements = new ConfigElements(this.graph, this.model, this.currentModel, this.divElements);
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