import { Model } from "../../model/Model";

export class ComponentModel extends Model {

    public constructor() {
        super(
            "component",
            ["ComponentElement", "FileElement", "FragmentElement", "CustomElement"]
        );
        
        let constraints = this.getConstraints();
        constraints = [
            {
                "source":"true", "type":"component", "attr":null,
                "value":null, "min":0, "max":0, "validNeighbors":null,
                "countError":"Invalid connection", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"file", "attr":null,
                "value":null, "min":0, "max":1, "validNeighbors":["component"],
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"custom", "attr":null,
                "value":null, "min":0, "max":1, "validNeighbors":["component"],
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            },
            {
                "source":"true", "type":"fragment", "attr":null,
                "value":null, "min":0, "max":null, "validNeighbors":["file","component"],
                "countError":"Only 1 target allowed", "typeError":"Only shape targets allowed"
            },
        ];
        this.setConstraints(constraints);
    }

    public customConstraintsRelations(graph:any, source:any, target:any){
        let returnConstraintRelations = {};

		//only one custom file per component
		if(target.getAttribute("type") == "component" && source.getAttribute("type") == "custom"){
			let targetId = target.getId();
			let incoEgdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(targetId));
			for (let j = 0; j < incoEgdes.length; j++) {
				if(incoEgdes[j].source.getAttribute("type")=="custom"){
                    returnConstraintRelations = {
                        "message":"Invalid connection only one Custom. file can be linked for this component"
                    }
				}
			}
		}

		//fragment can be only linked with one component
		if(target.getAttribute("type") == "component" && source.getAttribute("type") == "fragment"){
			let sourceId = source.getId();
			let outEgdes = graph.getModel().getOutgoingEdges(graph.getModel().getCell(sourceId));
			for (let j = 0; j < outEgdes.length; j++) {
				if(outEgdes[j].target.getAttribute("type") == "component"){
                    returnConstraintRelations = {
                        "message":"Invalid connection one Fragment can be only linked with one component"
                    }
				}
			}
		}

		return returnConstraintRelations;
	}
    
}