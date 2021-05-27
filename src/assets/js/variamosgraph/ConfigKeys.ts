/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigKeys {
  private vGraph:any; // VariaMos Graph

  public constructor(vGraph:any) {
    this.vGraph = vGraph;
  }

  public getVGraph() {
    return this.vGraph;
  }

  public initializeKeys() {
    this.suprKey();
  }

  public suprKey() {
    const graph = this.vGraph.getGraph();
    const modal = this.vGraph.getModal();
    const suprFunction = function anonymousSupr(evt:any) {
      if (graph.isEnabled()) {
        let validRemove = true;
        // avoid removing cloned elements directly
        const cells = graph.getSelectionCells();
        for (let i = 0; i < cells.length; i += 1) {
          if (cells[i].isVertex()) {
            if (cells[i].getId().includes('clon')) {
              modal.setData('error', 'Error', 'Cloned elements cannot be removed directly');
              modal.click();
              validRemove = false;
            }
          }
        }

        // remove clons if exist
        if (validRemove) {
          const removedCells = graph.removeCells();
          for (let i = 0; i < removedCells.length; i += 1) {
            if (removedCells[i].isVertex()) {
              const clon = graph.getModel().getCell(`clon${removedCells[i].getId()}`);
              if (clon) {
                const cells2 = [];
                cells2[0] = clon;
                graph.removeCells(cells2);
              }
            }
          }
        }
      }
    };
    this.vGraph.getKeyHandler().bindKey(46, suprFunction);
  }
}
