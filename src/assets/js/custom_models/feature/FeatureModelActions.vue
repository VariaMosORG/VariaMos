<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>
  <div class="btn-group flex-wrap show" role="group">
    <button class="btn btn-secondary dropdown-toggle" type="button"
      data-toggle="dropdown" aria-expanded="false" aria-haspopup="true"
      id="btnGroupActions1">
      Model Actions
    </button>
    <div id="divDropdownActions" class="dropdown-menu" aria-labelledby="btnGroupActions1">
      <a class="dropdown-item dropdown-pointer" v-on:click="clearErrors">
        Clear Errors
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="checkUniqueLabels">
        Check Unique Feature labels
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="importSplotModel">
        Import Splot Model
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mxgraphFactory } from 'ts-mxgraph';
import { SplotTransformer } from './custom/SplotTransformer';

const {
  mxImage,
  mxCellOverlay,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

@Options({
  props: ['variaMosGraph'],
})
export default class FeatureModelActions extends Vue {
  public variaMosGraph:any; // VariaMosGraph object

  public mounted() {
    if (!this.variaMosGraph.getCustomData().errorCells) {
      const errorDict = {
        errorCells: [],
        errorOverlays: [],
      };
      this.variaMosGraph.setCustomData(errorDict); // custom data for this model actions
    }
  }

  // clear all the error overlays
  public clearErrors() {
    const { errorCells } = this.variaMosGraph.getCustomData();
    const { errorOverlays } = this.variaMosGraph.getCustomData();
    for (let i = 0; i < errorCells.length; i += 1) {
      this.variaMosGraph.getGraph().removeCellOverlay(errorCells[i], errorOverlays[i]);
    }
    const errorDict = {
      errorCells: [],
      errorOverlays: [],
    };
    this.variaMosGraph.setCustomData(errorDict);
  }

  // check unique feature model labels
  public checkUniqueLabels() {
    const vGraph = this.variaMosGraph;
    const modal = this.variaMosGraph.getModal();
    const graph = this.variaMosGraph.getGraph();
    this.clearErrors();
    const featureRoot = graph.getModel().getCell('feature');
    const childs = graph.getModel().getChildVertices(featureRoot);
    const labels = [];
    let result = '';
    for (let i = 0; i < childs.length; i += 1) {
      const label = childs[i].getAttribute('label');
      if (labels.indexOf(label) > -1) {
        result += `- Duplicated Feature label: ${label}<br />`;
        const overlay = new mxCellOverlay(
          new mxImage('img/error.gif', 16, 16),
          'Overlay tooltip',
          'right',
          'top',
        );
        graph.addCellOverlay(childs[i], overlay);

        // insert overlay and error info in the custom data
        const customData = vGraph.getCustomData();
        customData.errorOverlays.push(overlay);
        customData.errorCells.push(childs[i]);
        vGraph.setCustomData(customData);
      } else {
        labels.push(label);
      }
    }
    if (result != '') {
      modal.setData('error', 'Error', result);
      modal.click();
    } else {
      modal.setData('success', 'Success', 'No errors found');
      modal.click();
    }
  }

  // import models from SPLOT format
  public importSplotModel() {
    const self = this;
    const confirmAction = async function anonymousConfirm() {
      const textArea = document.getElementById('splotModelCode') as any;
      await SplotTransformer.init(self.variaMosGraph, textArea.value);
      setTimeout(() => {
        const organizeButton = document.getElementById('organize') as any;
        organizeButton.click();
      }, 500);
    };
    const modal = this.variaMosGraph.getModal();
    const stringBody = `<div>Please enter the SPLOT XML model code in the next textarea:
      <br /><br /><textarea class='form-control' id='splotModelCode'></textarea></div>`;
    modal.setData('', 'Splot Model Code', stringBody, 'confirm', confirmAction);
    modal.click();
  }
}
</script>
