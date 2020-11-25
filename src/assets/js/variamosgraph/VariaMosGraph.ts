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
    mxMultiplicity, mxKeyHandler, mxCodec } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class VariaMosGraph {

    private graph:any; //mxGraph (mxGraph)
    private model:any; //mxGraphModel (mxGraphModel)
    private keyHandler:any; //mxKeyHandler (mxKeyHandler)
    private modelType:string = ""; //current model type - example feature
    private className:string = ""; //current className - example FeatureModel
    private currentModel:any; //current loaded model (example FeatureModel)
    private currentProject:any; //current project (ProjectClass)
    private divContainer:any; //div container (HTMLElement)
    private divNavigator:any; //div navigator (HTMLElement)
    private divElements:any; //div elements (HTMLElement)
    private divProperties:any; //div properties (HTMLElement)
    private configButtonActions:any; //configButtons (ConfigButtonActions)
    private configElements:any; //configElements (ConfigElements)
    private configProperties:any; //configProperties (ConfigProperties)
    private configKeys:any; //configKeys (ConfigKeys)
    private configRelations:any; //configRelations (ConfigRelations)
    private layers:any; //availble layers of the current model
    private $store:any; //references vuex store
    private $modal:any; //references modalPlugin

    public static buttons: any = {
        "buttonArea":[
            new Button("delete","Delete","eraser","Delete selected cells"),
            new Button("save","Save All","save","Save all the project models info"),
            /*new Button("pdf","PDF","print","Bla bla"),
            new Button("img","Img","print","Bla bla"),*/
            new Button("resetAll","Reset All","eraser","Delete all the project models info"),
            //new Button("export","Export","upload","Bla bla"),
            new Button("xml","View XML","code","Show XML code of all project models"),
        ],
        "navigationArea":[
            new Button("zoomIn","+","","Zoom in the model"),
            new Button("zoomOut","-","","Zoom out the model"),
            new Button("zoomReset","R","","Restore model zoom"),
        ]
    };

    public constructor() {
        this.model = new mxGraphModel();
    }

    public getGraph(){
        return this.graph;
    }

    public getModel(){
        return this.model;
    }

    public initTreeModel(modelsInfo:any, xmlCode:any){
        if(xmlCode != ""){ //load model based on previously saved model
            let xmlDoc = mxUtils.parseXml(xmlCode);
            let node = xmlDoc.documentElement;
            let dec = new mxCodec(node.ownerDocument);
            dec.decode(node, this.model);
            this.layers = []
            for (let i = 0; i < modelsInfo.length; i++) {
                let layer = this.model.getCell(modelsInfo[i]);
                this.layers[modelsInfo[i]] = layer;
            }
        }else{ //create a new model structure
            let root = new mxCell();
            this.layers = []
            for (let i = 0; i < modelsInfo.length; i++) {
                let mCell =new mxCell();
                mCell.setId(modelsInfo[i]);
                this.layers[modelsInfo[i]] = root.insert(mCell);
            }
            this.model.setRoot(root);
        }
    }

    public async initializeGraph(modelType:string, currentProject:any, divContainer:any, divNavigator:any, 
            divElements:any, divProperties:any, modal:any, store:any, caseLoad:any){
        this.modelType = modelType;
        this.className = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1) + "Model";
        this.divElements = divElements;
        this.divContainer = divContainer;
        this.divNavigator = divNavigator;
        this.divProperties = divProperties;
        this.currentProject = currentProject;
        this.$modal = modal;
        this.$store = store;
        if(caseLoad == 1){
            this.setGraph(); //create mxGraph object    
        }
        this.hideAllLayers(); //hide all layers while configuring the model
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
        this.setOverlay(); //set overlays functions
        this.setCurrentLayer(); //specific current layer to be shown and display it
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

    public hideAllLayers(){
        for (let layer in this.layers) { //hide all layers
			this.model.setVisible(this.layers[layer], false);
        }
    }

    public setCurrentLayer(){
        let currentLayer = this.layers[this.modelType]; //current layer to be displayed (feature, component, etc)
        this.graph.setDefaultParent(currentLayer);
        this.model.setVisible(currentLayer, true); //unhide current layer
    }

    public setNavigator(){
        let outline = new mxOutline(this.graph, this.divNavigator);
        outline.refresh();
    }

    public setButtonActions(){
        let buttonsConcat = VariaMosGraph.buttons.buttonArea;
        buttonsConcat = buttonsConcat.concat(VariaMosGraph.buttons.navigationArea);
        this.configButtonActions = new ConfigButtonActions(this.graph, this.model, this.$modal,
            this.$store, this.currentProject, buttonsConcat);
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