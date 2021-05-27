import { mxgraphFactory } from 'ts-mxgraph';

const {
  mxUtils, mxCell, mxGeometry, mxToolbar, mxConstants,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigElements {
  private vGraph:any; // VariaMos Graph

  private toolbar:any; // toolbar (mxToolbar)

  public constructor(vGraph:any) {
    this.vGraph = vGraph;
    this.toolbar = new mxToolbar(this.vGraph.getDivElements());
  }

  public getVGraph() {
    return this.vGraph;
  }

  public getToolbar() {
    return this.toolbar;
  }

  public setToolbar(toolbar: any) {
    this.toolbar = toolbar;
  }

  public initializeElements() {
    const currentModel = this.vGraph.getCurrentModel();
    for (let i = 0; i < currentModel.elements.length; i += 1) {
      this.addVertex(currentModel.elements[i]);
    }
  }

  public addVertex(element:any) {
    const doc = mxUtils.createXmlDocument();
    const node = doc.createElement(element.type);

    if (element.properties.length > 0) {
      for (let i = 0; i < element.properties.length; i += 1) {
        node.setAttribute(element.properties[i].id, element.properties[i].defValue);
      }
    }

    const vertex = new mxCell(node,
      new mxGeometry(0, 0, element.width, element.height),
      element.style);
    vertex.setConnectable(true);
    vertex.setVertex(true);
    this.addToolbarItem(vertex, element);
  }

  public addToolbarItem(vertexToClone:any, element:any) {
    const currentModel = this.vGraph.getCurrentModel();
    const modal = this.vGraph.getModal();

    const dragAndDropCreation = function anonymousDragAndDrop(graph:any, evt:any, cell:any) {
      let validDragAndDrop = true;
      // check custom model constraints in element creation
      const customConstraintsElementCreation = currentModel.customConstraintsElementCreation(
        graph,
        vertexToClone,
      );
      if (customConstraintsElementCreation.message) {
        modal.setData('error', 'Error', customConstraintsElementCreation.message);
        modal.click();
        validDragAndDrop = false;
      }

      if (validDragAndDrop) {
        graph.stopEditing(false);
        const pt = graph.getPointForEvent(evt);
        const vertex = graph.getModel().cloneCell(vertexToClone);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;
        const newCells = graph.importCells([vertex], 0, 0, cell);
        graph.setSelectionCells(newCells);

        // start cloning feature
        const clonesInfo = currentModel.getElementClones();
        // check if clone is defined for current element
        if (clonesInfo[vertex.getAttribute('type')]) {
          const clonDestinationModel = clonesInfo[vertex.getAttribute('type')];
          // if the destination model is available
          if (graph.getModel().getCell(clonDestinationModel)) {
            /* eslint no-param-reassign: "off" */
            graph.getModel().prefix = 'clon'; // cloned cell contains clon prefix
            graph.getModel().nextId = graph.getModel().nextId - 1;
            const vertex2 = graph.getModel().cloneCell(newCells[0]);
            const parent2 = graph.getModel().getCell(clonDestinationModel);
            // different background for a cloned cell
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#DCDCDC', [vertex2]);
            graph.importCells([vertex2], 0, 0, parent2);
            graph.getModel().prefix = ''; // restart prefix
          }
        }
        // end cloning feature
      }
    };

    const graph = this.vGraph.getGraph();
    const mdiv = document.createElement('div');
    const mspan = document.createElement('span'); // tooltip
    mspan.classList.add('csstooltiptext2');
    const typeG = this.vGraph.getCurrentModel().type;
    /* eslint import/no-dynamic-require: "off" */
    const imgSrc = require(`@/assets/js/custom_models/${typeG}/img/${element.icon}`);
    const img = this.toolbar.addMode(element.label, imgSrc, dragAndDropCreation);
    mspan.innerText = img.getAttribute('title');
    img.removeAttribute('title');

    mxUtils.makeDraggable(img, graph, dragAndDropCreation);

    mdiv.classList.add('pallete-div');
    mdiv.classList.add('csstooltip');
    mdiv.appendChild(img);
    mdiv.appendChild(mspan);
    this.vGraph.getDivElements().appendChild(mdiv);
  }
}
