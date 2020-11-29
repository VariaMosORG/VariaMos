export class ModelUtil {

    private vGraph:any; //VariaMos Graph
    
    public constructor(vGraph:any) {
        this.vGraph = vGraph;
    }

    public getVGraph(){
        return this.vGraph;
    }

    public searchCellsByType(rootToSearch:any, typeToSearch:any){
        let cells = [];
        let root = this.vGraph.getModel().getCell(rootToSearch);
        let rootChildren = this.vGraph.getModel().getChildVertices(root);
        for (let i = 0; i < rootChildren.length; i++) {
            let cell = rootChildren[i];
            let type = cell.getAttribute("type");
            if(type == typeToSearch){
                cells.push(cell);
            }
        }
        return cells;
    }

    public existCloneCells(rootCell:any){
        let rootChildren = this.vGraph.getModel().getChildVertices(rootCell);
        for (let i = 0; i < rootChildren.length; i++) {
            let cell = rootChildren[i];
            let id = cell.getId();
            if(id.includes("clon")){
                return true;
            }
        }
        return false;
    }
}