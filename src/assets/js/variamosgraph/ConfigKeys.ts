import { mxgraphFactory } from "ts-mxgraph";
const { mxEvent } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ConfigKeys {
    
    private graph:any; //mxGraph (mxGraph)
    private model:any; //mxGraphModel (mxGraphModel)
    private keyHandler:any; //mxKeyHandler (mxKeyHandler)
    private $modal:any; //references modalPlugin

    public constructor(graph:any, model:any, keyHandler:any, modal:any) {
        this.graph = graph;
        this.model = model;
        this.keyHandler = keyHandler;
        this.$modal = modal;
    }

    public getGraph(){
        return this.graph;
    }

    public getModel(){
        return this.model;
    }

    public getKeyHandler(){
        return this.keyHandler;
    }

    public initializeKeys(){
        this.suprKey();
    }

    public suprKey(){
        let graph = this.graph;
        let modal = this.$modal;
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
        this.keyHandler.bindKey(46,suprFunction);
    }
}