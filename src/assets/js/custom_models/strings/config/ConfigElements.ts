import { ConfigElements as CE } from '../../../variamosgraph/ConfigElements';
import { ModelElement } from '../../../model/ModelElement';
import { DynamicElement } from '../elements/DynamicElement';
import { mxgraphFactory } from 'ts-mxgraph';

const {
  mxToolbar
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigElements extends CE {

  /* eslint no-useless-constructor: "off" */
  public constructor(vGraph:any) {
    super(vGraph);
  }

  public initializeElements() {
    const graph = this.getVGraph();
    this.setToolbar(new mxToolbar(graph.getDivElements()));
    const uicomponentRoot = graph.getModel().getCell('uicomponent');
    const childs = graph.getModel().getChildVertices(uicomponentRoot);
    const currentModel = graph.getCurrentModel();
    for (let i = 0; i < childs.length; i += 1) {
      const label = childs[i].getAttribute('label');
      let element = new DynamicElement(currentModel);
      element.getProperties()[0].defValue = label;
      element.getProperties()[2].defValue = label;
      this.addVertex(element);
    }
  }
}