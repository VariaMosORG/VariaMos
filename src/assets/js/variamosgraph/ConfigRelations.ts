import { mxgraphFactory } from 'ts-mxgraph';

const { mxUtils } = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigRelations {
  private vGraph:any; // VariaMos Graph

  public constructor(vGraph:any) {
    this.vGraph = vGraph;
  }

  public initializeRelations() {
    const graph = this.vGraph.getGraph();
    const currentModel = this.vGraph.getCurrentModel();
    const modal = this.vGraph.getModal();
    graph.connectionHandler.insertEdge = function anonymousInsertEdge(parent:any, id:any, value:any, source:any, target:any, style:any) {
      const doc = mxUtils.createXmlDocument();
      const node = doc.createElement(`rel_${source.getAttribute('type')}_${target.getAttribute('type')}`);

      // by default bidirectional edges are not allowed (disjoint)
      if (target.edges != null && target.edges.length > 0) {
        for (let i = 0; i < target.edges.length; i++) {
          if (target.edges[i].target.getId() == source.getId()) {
            modal.setData('error', 'Error', 'Bidirectional connections not allowed');
            modal.click();
            return null;
          }
        }
      }

      // check custom constraints relations
      const customConstraintRelations = currentModel.customConstraintsRelations(graph, source, target);
      if (customConstraintRelations.message) {
        modal.setData('error', 'Error', customConstraintRelations.message);
        modal.click();
        return null;
      }

      // set properties to the edge
      const currentRelProperties = currentModel.relationProperties;
      for (let i = 0; i < currentRelProperties.length; i++) {
        if (currentRelProperties[i].conditions) { // check if the property has conditions
          if (currentRelProperties[i].conditions.type == 'and') {
            if ((currentRelProperties[i].conditions.source.indexOf(source.getAttribute('type')) > -1) && (currentRelProperties[i].conditions.target.indexOf(target.getAttribute('type')) > -1)) {
              node.setAttribute(currentRelProperties[i].id, currentRelProperties[i].defValue);
            }
          } else if ((currentRelProperties[i].conditions.source.indexOf(source.getAttribute('type')) > -1) || (currentRelProperties[i].conditions.target.indexOf(target.getAttribute('type')) > -1)) {
            node.setAttribute(currentRelProperties[i].id, currentRelProperties[i].defValue);
          }
        } else {
          node.setAttribute(currentRelProperties[i].id, currentRelProperties[i].defValue);
        }
      }

      let currentStyle = style;

      // set custom relation styles
      const currentRelStyles = currentModel.relationStyles;
      for (let i = 0; i < currentRelStyles.length; i++) {
        if (currentRelStyles[i].type == 'and') {
          if ((currentRelStyles[i].source.indexOf(source.getAttribute('type')) > -1) && (currentRelStyles[i].target.indexOf(target.getAttribute('type')) > -1)) {
            currentStyle = currentRelStyles[i].style;
          }
        } else if ((currentRelStyles[i].source.indexOf(source.getAttribute('type')) > -1) || (currentRelStyles[i].target.indexOf(target.getAttribute('type')) > -1)) {
          currentStyle = currentRelStyles[i].style;
        }
      }

      const cell = graph.insertEdge(parent, id, node, source, target, currentStyle);
      return cell;
    };
  }
}
