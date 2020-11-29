import { mxgraphFactory } from "ts-mxgraph";
const { mxEvent } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ConfigKeys {
    
    private vGraph:any; //VariaMos Graph

    public constructor(vGraph:any) {
        this.vGraph = vGraph;
    }

    public getVGraph(){
        return this.vGraph;
    }

    public initializeKeys(){
        this.suprKey();
    }

    public suprKey(){
        let graph = this.vGraph.getGraph();
        let modal = this.vGraph.getModal();
        let suprFunction = function(evt:any){
			if (graph.isEnabled())
			{
                //avoid removing cloned elements directly
                let cells = graph.getSelectionCells();
                for (let i = 0; i < cells.length; i++) {
                    if(cells[i].isVertex()){
                        if(cells[i].getId().includes("clon")){
                            modal.setData("error", "Error", "Cloned elements cannot be removed directly");
                            modal.click();
                            return null;
                        }
                    }
                }
                
                //remove clons if exist
                let removedCells = graph.removeCells();
                for (let i = 0; i < removedCells.length; i++) {
                    if(removedCells[i].isVertex()){
                        let clon = graph.getModel().getCell("clon" + removedCells[i].getId());
                        if(clon){
                            let cells = [];
                            cells[0] = clon;
                            graph.removeCells(cells);
                        }
                    }
                }
            }
        }
        this.vGraph.getKeyHandler().bindKey(46,suprFunction);
    }
}