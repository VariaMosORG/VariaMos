/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */

import { mxgraphFactory } from 'ts-mxgraph';

const {
  mxCellAttributeChange, mxUtils,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

export class SplotTransformer {
  public static variaMosGraph:any; // VariaMosGraph object

  public static graph:any; // MxGraph object

  public static parent:any; // Parent element (feature)

  public static featureTreeText:string = '';

  public static constraintsTreeText:string = '';

  public static ids: { [id: string] : Object; } = {};

  public static init(variaMosGraph:any, textAreaValue:string) {
    SplotTransformer.variaMosGraph = variaMosGraph;
    SplotTransformer.graph = SplotTransformer.variaMosGraph.getGraph();

    // obtain feature tree xml
    const baseFeatureString = '<feature_tree>';
    const initPos = textAreaValue.indexOf(baseFeatureString);
    const finPos = textAreaValue.indexOf('</feature_tree>');
    SplotTransformer.featureTreeText = textAreaValue.substring(
      initPos + baseFeatureString.length, finPos,
    );

    SplotTransformer.parent = SplotTransformer.graph.getModel().getCell('feature');
    SplotTransformer.importFeatureSplotModel();

    // obtain constraints tree xml
    const baseConstraintsString = '<constraints>';
    const initCPos = textAreaValue.indexOf(baseConstraintsString);
    const finCPos = textAreaValue.indexOf('</constraints>');
    SplotTransformer.constraintsTreeText = textAreaValue.substring(
      initCPos + baseConstraintsString.length, finCPos,
    );

    SplotTransformer.importConstraintsSplotModel();
  }

  public static importFeatureSplotModel() {
    const features:string[] = SplotTransformer.featureTreeText.trim().split(':');
    features.shift();
    // start to create features and relations
    for (let i = 0; i < features.length; i += 1) {
      const type = features[i].charAt(0);
      const data = features[i].slice(1);
      if (type == 'r') {
        SplotTransformer.createRoot(data);
      } else if (type == 'm') {
        SplotTransformer.createFeature(data);
      } else if (type == 'o') {
        SplotTransformer.createFeature(data, 'optional');
      } else if (type == 'g') {
        SplotTransformer.createBundle(data);
      } else {
        SplotTransformer.createFeature(data, '');
      }
    }
  }

  // create root feature
  public static createRoot(data:string) {
    const finPos = data.indexOf('(');
    if (finPos != -1) {
      const label = data.substring(0, finPos).trim();
      SplotTransformer.createElement('root', label);
    }
  }

  // create a new feature and its relation
  public static createFeature(data:string, type:string = 'mandatory') {
    const finPos = data.indexOf('(');
    let sourceType = '';
    let targetType = '';
    let source;
    let target;
    if (finPos != -1) {
      const label = data.substring(0, finPos).trim();
      const closePos = data.indexOf(')');
      const dataUnion = data.substring(finPos + 1, closePos);
      const relations:string[] = dataUnion.split('_');
      relations.shift();
      const newId = relations[relations.length - 1];
      const parentId = relations[relations.length - 2];
      target = SplotTransformer.ids[parentId] as any;
      targetType = target.getAttribute('type');
      if (SplotTransformer.featureTreeText.includes(`${dataUnion}_`)) {
        source = SplotTransformer.createElement('abstract', label, newId);
        SplotTransformer.ids[newId] = source;
        sourceType = 'abstract';
      } else {
        source = SplotTransformer.createElement('concrete', label, newId);
        SplotTransformer.ids[newId] = source;
        sourceType = 'concrete';
      }
      SplotTransformer.createRelation(sourceType, targetType, type, source, target);
    }
  }

  // create a new bundle
  public static createBundle(data:string) {
    const finPos = data.indexOf('(');
    const closePos = data.indexOf(')');
    const dataUnion = data.substring(finPos + 1, closePos);
    const relations:string[] = dataUnion.split('_');
    relations.shift();
    const newId = relations[relations.length - 1];
    const parentId = relations[relations.length - 2];
    const target = SplotTransformer.ids[parentId] as any;
    const targetType = target.getAttribute('type');
    const source = SplotTransformer.createElement('bundle', 'bundle', newId);
    const edit = new mxCellAttributeChange(source, 'bundleType', 'RANGE');
    SplotTransformer.graph.getModel().execute(edit);

    const iniRangePos = data.indexOf('[');
    const finRangePos = data.indexOf(']');
    const dataRange = data.substring(iniRangePos + 1, finRangePos);
    const rangeValues:string[] = dataRange.split(',');
    const edit2 = new mxCellAttributeChange(source, 'lowRange', rangeValues[0]);
    SplotTransformer.graph.getModel().execute(edit2);
    const edit3 = new mxCellAttributeChange(source, 'highRange', rangeValues[1]);
    SplotTransformer.graph.getModel().execute(edit3);

    SplotTransformer.createRelation('bundle', targetType, '', source, target);
  }

  // create a new element (vertex)
  public static createElement(type:string, label:string, id:string = 'r') {
    // dragAndDrop current element from the palette to the drawing area
    const rootImg = document.getElementById(`dragAndDrop-${type}`) as any;
    const vgraphContainer = document.getElementById('vgraph-container') as any;
    const svgContainer = vgraphContainer.firstElementChild;
    const position = SplotTransformer.getPos(vgraphContainer);
    const eventPD = new PointerEvent('pointerdown');
    const eventPM = new PointerEvent('pointermove', {
      bubbles: true,
      clientX: position.x + 10,
      clientY: position.y + 10,
    });
    const eventPU = new PointerEvent('pointerup', {
      bubbles: true,
    });
    rootImg.dispatchEvent(eventPD);
    svgContainer.dispatchEvent(eventPM);
    svgContainer.dispatchEvent(eventPU);
    const currentId = SplotTransformer.graph.getModel().nextId - 1;
    const newCell = SplotTransformer.graph.getModel().getCell(currentId);
    // modify label
    const edit = new mxCellAttributeChange(newCell, 'label', label);
    SplotTransformer.graph.getModel().execute(edit);
    // add the new cell to the list
    SplotTransformer.ids[id] = newCell;
    return newCell;
  }

  public static getPos(element:any) {
    let lx;
    let ly;
    let el = element;
    for (lx = 0, ly = 0; el != null;
      lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return { x: lx, y: ly };
  }

  // create relation between two vertex
  public static createRelation(sourceType:string, targetType:string, relType:string = '',
    source:any, target:any) {
    const doc = mxUtils.createXmlDocument();
    const node = doc.createElement(`rel_${sourceType}_${targetType}`);
    node.setAttribute('type', 'relation');
    if (relType != '') {
      node.setAttribute('relType', relType);
    }
    SplotTransformer.graph.insertEdge(
      SplotTransformer.parent, null, node, source, target, '',
    );
  }

  public static importConstraintsSplotModel() {
    const constraints:string[] = SplotTransformer.constraintsTreeText.trim().split(':');
    constraints.shift();
    // start to create requires and excludes relations
    for (let i = 0; i < constraints.length; i += 1) {
      const currentConstraint = constraints[i].trim().split('or');
      const partA = currentConstraint[0].trim();
      let partB = '';
      const initConst = currentConstraint[1].indexOf('const');
      if (initConst != -1) {
        partB = currentConstraint[1].substring(0, initConst).trim();
      } else {
        partB = currentConstraint[1].trim();
      }
      const partAType = partA.charAt(0);
      const partBType = partB.charAt(0);

      const partAIds = partA.split('_');
      const partAId = partAIds[partAIds.length - 1];
      const partAElement = SplotTransformer.ids[partAId] as any;

      const partBIds = partB.split('_');
      const partBId = partBIds[partBIds.length - 1];
      const partBElement = SplotTransformer.ids[partBId] as any;

      let source;
      let target;
      let typeOfRelation = 'requires';

      if (partAType == '~' && partBType == '~') {
        source = partAElement;
        target = partBElement;
        typeOfRelation = 'excludes';
      } else if (partAType == '~') {
        source = partBElement;
        target = partAElement;
      } else {
        source = partAElement;
        target = partBElement;
      }

      SplotTransformer.createRelation(
        source.getAttribute('type'),
        target.getAttribute('type'),
        typeOfRelation,
        source,
        target,
      );
    }
  }
}
