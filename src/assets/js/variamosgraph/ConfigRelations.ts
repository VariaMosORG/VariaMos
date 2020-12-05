import { mxgraphFactory } from "ts-mxgraph";
const { mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigRelations {
    
    private vGraph:any; //VariaMos Graph

    public constructor(vGraph:any) {
        this.vGraph = vGraph;
    }

    public initializeRelations(){
        let graph = this.vGraph.getGraph();
        let currentModel = this.vGraph.getCurrentModel();
        let modal = this.vGraph.getModal();
        graph.connectionHandler.insertEdge = function(parent:any, id:any, value:any, source:any, target:any, style:any){
            let doc = mxUtils.createXmlDocument();
            let node = doc.createElement('rel_' + source.getAttribute("type") + '_' + target.getAttribute("type"));

            //by default bidirectional edges are not allowed (disjoint)
            if(target.edges != null && target.edges.length > 0){
                for (let i = 0; i < target.edges.length; i++) {
                    if(target.edges[i].target.getId() == source.getId()){
                        modal.setData("error", "Error", "Bidirectional connections not allowed");
                        modal.click();
                        return null;
                    }
                }
            }

            //check custom constraints relations
            let customConstraintRelations = currentModel.customConstraintsRelations(graph, source, target);
            if(customConstraintRelations.message){
                modal.setData("error", "Error", customConstraintRelations.message);
                modal.click();
                return null;
            }

            //set properties to the edge
            let currentRelProperties = currentModel.relationProperties;
            for (let i = 0; i < currentRelProperties.length; i++) {
                if(currentRelProperties[i].conditions){ //check if the property has conditions
                    if(currentRelProperties[i].conditions.type == "and"){
                        if((currentRelProperties[i].conditions.source.indexOf(source.getAttribute("type")) > -1) && (currentRelProperties[i].conditions.target.indexOf(target.getAttribute("type"))> -1)){
                            node.setAttribute(currentRelProperties[i].id, currentRelProperties[i].defValue);
                        }
                    }
                    else if((currentRelProperties[i].conditions.source.indexOf(source.getAttribute("type")) > -1) || (currentRelProperties[i].conditions.target.indexOf(target.getAttribute("type"))> -1)){
                        node.setAttribute(currentRelProperties[i].id, currentRelProperties[i].defValue);
                    }
                }else{
                    node.setAttribute(currentRelProperties[i].id, currentRelProperties[i].defValue);
                }
            }

            //set custom relation styles
            let currentRelStyles = currentModel.relationStyles;
            for (let i = 0; i < currentRelStyles.length; i++) {
                if(currentRelStyles[i].type == "and"){
                    if((currentRelStyles[i].source.indexOf(source.getAttribute("type")) > -1) && (currentRelStyles[i].target.indexOf(target.getAttribute("type"))> -1)){
                        style = currentRelStyles[i].style;
                    }
                }else{
                    if((currentRelStyles[i].source.indexOf(source.getAttribute("type")) > -1) || (currentRelStyles[i].target.indexOf(target.getAttribute("type"))> -1)){
                        style = currentRelStyles[i].style;
                    }
                }
            }


            let cell = graph.insertEdge(parent, id, node, source, target, style);
            return cell;
        }
    }
}