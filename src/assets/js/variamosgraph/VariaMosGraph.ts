import { mxgraphFactory } from 'ts-mxgraph';
import { Button } from './Button';
import { ConfigButtonActions } from './ConfigButtonActions';
import { ConfigElements } from './ConfigElements';
import { ConfigProperties } from './ConfigProperties';
import { ConfigKeys } from './ConfigKeys';
import { ConfigRelations } from './ConfigRelations';
import { ModelUtil } from './ModelUtil';

const {
  mxGraphModel, mxGraph, mxOutline,
  mxRubberband, mxRectangle, mxShape,
  mxUtils, mxCellRenderer, mxConstants,
  mxStencilRegistry, mxStencil, mxCell,
  mxMultiplicity, mxKeyHandler, mxCodec,
  mxDragSource,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class VariaMosGraph {
  private graph:any; // mxGraph (mxGraph)

  private model:any; // mxGraphModel (mxGraphModel)

  private keyHandler:any; // mxKeyHandler (mxKeyHandler)

  private modelType:string = ''; // current model type - example feature

  private className:string = ''; // current className - example FeatureModel

  private currentModel:any; // current loaded model (example FeatureModel)

  private currentProject:any; // current project (ProjectClass)

  private divContainer:any; // div container (HTMLElement)

  private divNavigator:any; // div navigator (HTMLElement)

  private divElements:any; // div elements (HTMLElement)

  private divProperties:any; // div properties (HTMLElement)

  private configButtonActions:any; // configButtons (ConfigButtonActions)

  private configElements:any; // configElements (ConfigElements)

  private configProperties:any; // configProperties (ConfigProperties)

  private configKeys:any; // configKeys (ConfigKeys)

  private configRelations:any; // configRelations (ConfigRelations)

  private layers:any; // availble layers of the current model

  private $store:any; // references vuex store

  private $modal:any; // references modalPlugin

  private modelUtil:any; // ModelUtil

  private configApp:any; // references current configApp (ConfigApp)

  private customData:any = {}; // references customData to maintain while navigating between models

  public static buttons: any = {
    buttonArea: [
      new Button('save', 'Save Models', 'save', 'Save all models'),
      new Button('img', 'Img', 'print', 'Download model in PNG format'),
      new Button('delete', 'Delete', 'eraser', 'Delete selected cells'),
      new Button('resetCurrent', 'Delete this Model', 'eraser', 'Delete current model'),
      new Button('resetAll', 'Delete Models', 'eraser', 'Delete all models'),
      new Button('import', 'Import Models', 'download', 'Import models (XML)'),
      new Button('export', 'Export Models', 'upload', 'Export project models (XML)'),
      new Button('zoomIn', '+', 'search-plus', 'Zoom in the model'),
      new Button('zoomOut', '-', 'search-minus', 'Zoom out the model'),
      new Button('zoomReset', 'R', 'search', 'Restore model zoom'),
      new Button('xml', 'View XML', 'code', 'Show XML code of models'),
    ],
  };

  public constructor() {
    this.model = new mxGraphModel();
  }

  public getGraph() {
    return this.graph;
  }

  public getModel() {
    return this.model;
  }

  public getStore() {
    return this.$store;
  }

  public getModal() {
    return this.$modal;
  }

  public getClassName() {
    return this.className;
  }

  public getKeyHandler() {
    return this.keyHandler;
  }

  public getCurrentProject() {
    return this.currentProject;
  }

  public getCurrentModel() {
    return this.currentModel;
  }

  public getDivContainer() {
    return this.divContainer;
  }

  public getDivElements() {
    return this.divElements;
  }

  public getDivProperties() {
    return this.divProperties;
  }

  public getModelUtil() {
    return this.modelUtil;
  }

  public getCustomData() {
    return this.customData;
  }

  public getConfigApp() {
    return this.configApp;
  }

  public setCustomData(customData:any) {
    this.customData = customData;
  }

  // initiliaze the main model tree (an XML element which is used to store the model info)
  public initTreeModel(modelsInfo:any, xmlCode:any) {
    if (xmlCode != '') { // load model based on previously saved model
      const xmlDoc = mxUtils.parseXml(xmlCode);
      const node = xmlDoc.documentElement;
      const dec = new mxCodec(node.ownerDocument);
      dec.decode(node, this.model);
      this.layers = [];
      for (let i = 0; i < modelsInfo.length; i += 1) {
        const layer = this.model.getCell(modelsInfo[i]);
        this.layers[modelsInfo[i]] = layer;
      }
    } else { // create a new model structure
      const root = new mxCell();
      this.layers = [];
      for (let i = 0; i < modelsInfo.length; i += 1) {
        const mCell = new mxCell();
        mCell.setId(modelsInfo[i]);
        this.layers[modelsInfo[i]] = root.insert(mCell);
      }
      this.model.setRoot(root);
    }
  }

  // initialize the VariaMosGraph and call the main functions
  public async initializeGraph(modelType:string, currentProject:any, divContainer:any,
    divNavigator:any, divElements:any, divProperties:any, configApp:any, modal:any,
    store:any, caseLoad:any) {
    this.modelType = modelType;
    this.className = this.getClassModelName(this.modelType);
    this.divElements = divElements;
    this.divContainer = divContainer;
    this.divNavigator = divNavigator;
    this.divProperties = divProperties;
    this.currentProject = currentProject;
    this.configApp = configApp;
    this.$modal = modal;
    this.$store = store;
    if (caseLoad == 1) { // case 1 is called each time the ProjectModels view is mounted
      this.setGraph(); // create mxGraph object
    }
    this.setModelUtil();
    this.hideAllLayers(); // hide all layers while configuring the model
    this.setNavigator(); // define the div navigator
    this.setConfigModel(); // some graph configs
    this.setButtonActions(); // implement button actions
    this.setKeys(); // implement key actions
    await this.loadCurrentModelClasses(); // wait to load model class and model elements
    this.setElements(); // load model elements (palette)
    this.setConstraints(); // set model elements constraints
    this.setProperties(); // set model element properties
    this.setRelations(); // set element relations
    this.setMainCellText(); // set the main text to be displayed for cells
    this.setCustomShapes(); // set custom shapes
    this.setCustomGraphConfig(); // set custom model graph config
    this.setOverlay(); // set overlays functions
    this.setCurrentLayer(); // specific current layer to be shown and display it
  }

  public getClassModelName(name:string) {
    if (name.includes('_')) {
      const parts = name.split('_');
      let completeName = '';
      for (let i = 0; i < parts.length; i += 1) {
        completeName = completeName + parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      }
      completeName += 'Model';
      return completeName;
    }
    return `${name.charAt(0).toUpperCase() + name.slice(1)}Model`;
  }

  // create model util
  public setModelUtil() {
    this.modelUtil = new ModelUtil(this);
  }

  // create a new mxgraph
  public setGraph() {
    if (this.divContainer) {
      this.graph = new mxGraph(this.divContainer, this.model);

      // Avoid that new elements (cells) can be placed inside existing elements (cells)
      mxDragSource.prototype.getDropTarget = function anonymousDrop(graph:any, x:any, y:any) {
        let cell = graph.getCellAt(x, y);
        if (!graph.isValidDropTarget(cell)) {
          cell = null;
        }
        return cell;
      };
    }
  }

  // set the keyboard key actions
  public async setKeys() {
    this.keyHandler = new mxKeyHandler(this.graph);
    // load custom config if available
    const modelModule = await this.loadModules(`custom_models/${this.modelType}/config/ConfigKeys`);
    if (modelModule != null) {
      this.configKeys = new modelModule.ConfigKeys(this);
    } else {
      this.configKeys = new ConfigKeys(this); // load default config
    }
    this.configKeys.initializeKeys();
  }

  // initialize the overlay function (if it is available for the current model)
  public setOverlay() {
    this.currentModel.overlayStart();
  }

  // initialize the custom graph config (if it is available for the current model)
  public setCustomGraphConfig() {
    this.currentModel.customGraphConfig();
  }

  // configure the relations between the current model elements
  public async setRelations() {
    // load custom config if available
    const modelModule = await this.loadModules(`custom_models/${this.modelType}/config/ConfigRelations`);
    if (modelModule != null) {
      this.configRelations = new modelModule.ConfigRelations(this);
    } else {
      this.configRelations = new ConfigRelations(this); // load default config
    }
    this.configRelations.initializeRelations();
  }

  // define the default attribute to be shown is drawing area for each element
  public setMainCellText() {
    const { currentModel } = this;
    this.graph.convertValueToString = function anonymousValueToString(cell:any) {
      const customTexts = currentModel.getCustomElementTexts();
      if (customTexts && customTexts[cell.getAttribute('type')]) {
        return cell.getAttribute(customTexts[cell.getAttribute('type')], ''); // default attribute showed in drawing area was customized in model
      }
      if (cell.isEdge()) {
        return cell.getAttribute('relType', ''); // default attribute showed in drawing area for edges is relType
      }
      return cell.getAttribute('label', ''); // default attribute showed in drawing area for vertex is label
    };
  }

  // hide all layers
  public hideAllLayers() {
    const keys = Object.keys(this.layers);
    for (let i = 0; i < keys.length; i += 1) {
      this.model.setVisible(this.layers[keys[i]], false);
    }
  }

  // set the current layer and unhide the current layer
  public setCurrentLayer() {
    // current layer to be displayed (feature, component, etc)
    const currentLayer = this.layers[this.modelType];
    this.graph.setDefaultParent(currentLayer);
    this.model.setVisible(currentLayer, true); // unhide current layer
  }

  // set the mxgraph navigator
  public setNavigator() {
    const outline = new mxOutline(this.graph, this.divNavigator);
    outline.refresh();
  }

  // initiliaze the button actions (buttons above the drawing area)
  public async setButtonActions() {
    const buttons = VariaMosGraph.buttons.buttonArea;
    const modelModule = await this.loadModules(`custom_models/${this.modelType}/config/ConfigButtonActions`); // load custom config if available
    if (modelModule != null) {
      this.configButtonActions = new modelModule.ConfigButtonActions(this, buttons);
    } else {
      this.configButtonActions = new ConfigButtonActions(this, buttons); // load default config
    }
    this.configButtonActions.initializeActions();
  }

  public async loadModules(path:any) {
    let modelModule = null;
    try {
      modelModule = await import(`../${path}`); // load custom modules
    } catch (error) {
      // return null module
    }
    return modelModule;
  }

  // configure the properties for each model element
  public async setProperties() {
    const modelModule = await this.loadModules(`custom_models/${this.modelType}/config/ConfigProperties`); // load custom config if available
    if (modelModule != null) {
      this.configProperties = new modelModule.ConfigProperties(this);
    } else {
      this.configProperties = new ConfigProperties(this); // load default config
    }
    this.configProperties.initializeProperties();
  }

  // remove all button event listeners once the URL is changed
  public removeAllButtonEventListeners() {
    this.configButtonActions.removeAllEventListeners();
  }

  // establish the main mxgraph configuration
  public setConfigModel() {
    this.graph.setConnectable(true); // Enables new connections in the graph
    // Multiple edges in the same direction between the same pair of vertices are not allowed
    this.graph.setMultigraph(false);
    this.graph.setAllowDanglingEdges(false);// Avoid disconnect egdes
    this.graph.setCellsDisconnectable(false); // Avoid disconnect egdes
    this.graph.setDisconnectOnMove(false); // Avoid disconnect egdes
    this.graph.setSplitEnabled(false); // Avoid a cell can split an edge is placed above it
    this.graph.setCellsEditable(false); // Avoid double click cells
    const mxrubber = new mxRubberband(this.graph); // Enables rectangular selection
    this.graph.maximumGraphBounds = new mxRectangle(0, 0, 4000, 4000);
  }

  // load and include all the element classes for the current model
  public async loadCurrentModelClasses() {
    // load current model class
    const modelModule = await this.loadModules(`custom_models/${this.modelType}/${this.className}`);
    this.currentModel = new modelModule[this.className]();
    this.currentModel.setModelUtil(this.modelUtil);

    for (let i = 0; i < this.currentModel.elementClassNames.length; i += 1) {
      // load current model element classes
      /* eslint no-await-in-loop: "off" */
      const elementModule = await this.loadModules(
        `custom_models/${this.modelType}/elements/${this.currentModel.elementClassNames[i]}`,
      );
      this.currentModel.addElement(
        new elementModule[this.currentModel.elementClassNames[i]](this.currentModel),
      );
    }
  }

  // configure each element of the current model
  public async setElements() {
    const modelModule = await this.loadModules(
      `custom_models/${this.modelType}/config/ConfigElements`,
    ); // load custom config if available
    if (modelModule != null) {
      this.configElements = new modelModule.ConfigElements(this);
    } else {
      this.configElements = new ConfigElements(this); // load default config
    }
    this.configElements.initializeElements();
  }

  // establish the constraints between the model elements
  public setConstraints() {
    this.graph.multiplicities = [];
    for (let i = 0; i < this.currentModel.constraints.length; i += 1) {
      this.graph.multiplicities.push(new mxMultiplicity(
        this.currentModel.constraints[i].source,
        this.currentModel.constraints[i].type,
        this.currentModel.constraints[i].attr,
        this.currentModel.constraints[i].value,
        this.currentModel.constraints[i].min,
        this.currentModel.constraints[i].max,
        this.currentModel.constraints[i].validNeighbors,
        this.currentModel.constraints[i].countError,
        this.currentModel.constraints[i].typeError,
      ));
    }
  }

  // establish the custom shapes for the current model (based on an XML file)
  public setCustomShapes() {
    function CustomShape() {
      mxShape.call(null);
    }

    mxUtils.extend(CustomShape, mxShape);
    mxCellRenderer.registerShape('customShape', CustomShape);
    try {
      // load custom shapes file for current model
      /* eslint import/no-dynamic-require: "off" */
      const xmlSrc = require(`@/assets/js/custom_models/${this.getCurrentModel().type}/xml/custom_shapes.xml`);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlSrc.default, 'text/xml');
      const root = xmlDoc.firstChild;
      if (root) {
        let shape = root.firstChild as any;
        if (shape) { // if xml document contains shapes
          while (shape != null) {
            if (shape.nodeType == mxConstants.NODETYPE_ELEMENT) {
              mxStencilRegistry.addStencil(shape.getAttribute('name'), new mxStencil(shape));
            }
            shape = shape.nextSibling;
          }
        }
      }
    } catch (error) {
      // custom shapes not defined for current model
    }
  }
}
