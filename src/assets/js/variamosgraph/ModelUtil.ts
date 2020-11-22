export class ModelUtil {

    public graph:any; //mxGraph (mxGraph)
    public model:any; //mxGraphModel (mxGraphModel)
    
    public constructor(graph:any, model:any) {
        this.graph = graph;
        this.model = model;
    }

    public searchCellsByType(rootToSearch:any, typeToSearch:any){
        let cells = [];
        let root = this.model.getCell(rootToSearch);
        let rootChildren = this.model.getChildVertices(root);
        for (let i = 0; i < rootChildren.length; i++) {
            let cell = rootChildren[i];
            let type = cell.getAttribute("type");
            if(type == typeToSearch){
                cells.push(cell);
            }
        }
        return cells;
    }
}