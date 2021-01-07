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
      <a class="dropdown-item dropdown-pointer" v-on:click="transformModel2Json">
        Transform Model to JSON
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="executeSolver">
        Execute Solver
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mxgraphFactory } from 'ts-mxgraph';
import axios from 'axios';
import { SplotTransformer } from './custom/SplotTransformer';

const {
  mxImage, mxCodec,
  mxCellOverlay, mxUtils,
} = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });

@Options({
  props: ['variaMosGraph'],
})
export default class FeatureModelActions extends Vue {
  public variaMosGraph:any; // VariaMosGraph object

  public customConfig:any; // CustomConfig for feature model

  public mounted() {
    if (!this.variaMosGraph.getCustomData().errorCells) {
      const errorDict = {
        errorCells: [],
        errorOverlays: [],
      };
      this.variaMosGraph.setCustomData(errorDict); // custom data for this model actions
    }
    this.customConfig = this.variaMosGraph.configApp.getCustomConfigAsJsonObject().feature;
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

  // test transform model to Json
  public transformModel2Json() {
    const modal = this.variaMosGraph.getModal();
    const model = this.variaMosGraph.getModel();
    const encoder = new mxCodec();
    const node = encoder.encode(model);
    const modelData = mxUtils.getPrettyXml(node);

    const headers = {
      'Content-Type': 'text/plain',
    };

    axios.post(`${this.customConfig.backendURL}transform/mx-graph-to-json`,
      modelData,
      {
        headers: { headers },
      })
      .then((response) => {
        const JsonCode = JSON.stringify(JSON.parse(response.data), undefined, 2);
        const stringBody = `<div class='vertical-scroll border'><pre>${JsonCode}</pre></div>`;
        modal.setData('', 'JSON version code', stringBody);
        modal.click();
      })
      .catch((error) => {
        modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
        modal.click();
      });
  }

  // execute solver actions
  public executeSolver() {
    const modal = this.variaMosGraph.getModal();
    if (this.customConfig.backendURL != '') {
      const self = this;
      const model = this.variaMosGraph.getModel();
      const encoder = new mxCodec();
      const node = encoder.encode(model);
      const modelData = mxUtils.getPrettyXml(node);

      const confirmAction = function anonymousConfirm() {
        const arraySelections = [];
        const checkboxes = document.querySelectorAll('input[type=checkbox]:checked') as any;

        for (let i = 0; i < checkboxes.length; i += 1) {
          arraySelections.push(checkboxes[i].value);
        }
        axios.post(`${self.customConfig.backendURL}transform/execute-solver`, {
          modelData,
          selectedActions: arraySelections,
        })
          .then((response) => {
            modal.setData('success', 'Success', response.data);
          })
          .catch((error) => {
            modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
          });
      };

      const stringBody = `<div>Click confirm button to execute the solver process</div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="type" value="dead" />
        <label class="form-check-label">Get Dead Features</label><br />
        <input class="form-check-input" type="checkbox" name="type" value="optional" />
        <label class="form-check-label">Get Fake Optional Features</label><br />
        <input class="form-check-input" type="checkbox" name="type" value="void" />
        <label class="form-check-label">Is Void Model?</label><br />
        <input class="form-check-input" type="checkbox" name="type" value="fake" />
        <label class="form-check-label">Is Fake Product Line?</label>
      </div>
        `;
      modal.setData(
        '',
        'Confirm Solver Execution',
        stringBody,
        'confirm',
        confirmAction,
      );
      modal.setSecondaryMessage(true);
      modal.click();
    }
  }
}
</script>
