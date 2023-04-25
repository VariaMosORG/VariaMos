<!--
    @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>
  <div class="btn-group" role="group">
    <button class="btn btn-secondary dropdown-toggle" type="button"
      data-toggle="dropdown" aria-expanded="false" aria-haspopup="true" id="btnGroupActions1">
      Derivation
    </button>
    <div id="divDropdownActions" class="dropdown-menu" aria-labelledby="btnGroupActions1">
      <a class="dropdown-item dropdown-pointer" v-on:click="testComponentBackend">
        Test Component Management Backend
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="uploadComponentPool">
        Upload Component Pool (.zip)
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="showFileCode">
        Show File Code
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="executeDerivation">
        Execute Derivation
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="customizeDerivation">
        Customize Derivation
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="cleanComments">
        Clean comments
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="verifyDerivation">
        Verify Derivation
      </a>
      <a class="dropdown-item dropdown-pointer" v-on:click="obtainProduct">
        Obtain Product (.zip)
      </a>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { Vue, Options } from 'vue-class-component';
import axios from 'axios';
import { ComponentFunctions } from './ComponentFunctions';

@Options({
  props: ['variaMosGraph'],
})
export default class ComponentDerivation extends Vue {
  public variaMosGraph:any; // VariaMosGraph object

  public customConfig:any; // CustomConfig for component model

  public customizationResponse:any;

  public customizationCompPos:any;

  public customizationCusPos:any;

  public customizationCusMaxPos:any;

  public customizationCompMaxPos:any;

  public previousDest:any;

  public previousCPoint:any;

  public previousPlan:any;

  public fileDest:any;

  public mounted() {
    this.customConfig = this.variaMosGraph.configApp.getCustomConfigAsJsonObject().component;
  }

  public testComponentBackend() {
    const modal = this.variaMosGraph.getModal();
    axios.get(`${this.customConfig.backendURL}test`)
      .then((response) => {
        if (response.data == 'Ok') {
          modal.setData('success', 'Success', 'Backend connection is Ok');
          modal.click();
        } else {
          modal.setData('error', 'Error', 'Wrong backend connection');
          modal.click();
        }
      })
      .catch((error) => {
        modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
        modal.click();
      });
  }

  public showFileCode() {
    const cell = this.variaMosGraph.getGraph().getSelectionCell();
    const modal = this.variaMosGraph.getModal();
    if (cell == null) {
      modal.setData('error', 'Error', 'Please select a valid file to show the code');
      modal.click();
    } else if (cell.getAttribute('type') == 'file' || cell.getAttribute('type') == 'fragment' || cell.getAttribute('type') == 'custom') {
      const data = { filename: '', component: '' };
      let customFile = false;
      const { htmlEntities } = this;

      if (cell.getAttribute('type') == 'custom') {
        data.filename = 'customization.json';
        customFile = true;
      } else {
        data.filename = cell.getAttribute('filename');
      }

      data.component = cell.getEdgeAt(0).target.getAttribute('label');
      const modelData = JSON.stringify(data);
      axios.post(`${this.customConfig.backendURL}ComponentImplementation/getFile`, {
        data: modelData,
        p_pool: this.customConfig.backendPoolFolder,
      })
        .then((response) => {
          const stringBody = `<div class='vertical-scroll border'><pre><code>${htmlEntities(response.data)}</code></pre></div>`;
          modal.setData('', 'File code', stringBody);
          modal.click();
        })
        .catch((error) => {
          modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
          modal.click();
        });
    }
  }

  public cleanComments() {
    const modal = this.variaMosGraph.getModal();
    if (this.customConfig.backendURL != '' && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder) {
      const modelData = JSON.stringify(ComponentFunctions.execute(this.variaMosGraph.getGraph()));
      const self = this;
      const confirmAction = function anonymousConfirm() {
        const textArea = document.getElementById('cleanCommentFiles') as any;
        const filesToBeCleaned = textArea.value;
        axios.post(`${self.customConfig.backendURL}ComponentImplementation/cleanComments`, {
          data: filesToBeCleaned,
          p_pool: self.customConfig.backendPoolFolder,
          p_derived: self.customConfig.backendDerivationFolder,
        })
          .then((response) => {
            modal.setData('success', 'Success', response.data);
          })
          .catch((error) => {
            modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
          });
      };

      const stringBody = `<div>Please enter the paths of the derived files to be cleaned (comments will be removed) in the next textarea (separated by a comma):
      <br /><br /><textarea class='form-control' id='cleanCommentFiles'>path/fileExample.java, path/fileExample2.java</textarea></div>`;
      modal.setData(
        '',
        'Confirm Clean Comments',
        stringBody,
        'confirm',
        confirmAction,
      );
      modal.setSecondaryMessage(true);
      modal.click();
    }
  }

  public executeDerivation() {
    const modal = this.variaMosGraph.getModal();
    if (this.customConfig.backendURL != '' && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder) {
      const modelData = JSON.stringify(ComponentFunctions.execute(this.variaMosGraph.getGraph()));
      const self = this;
      const confirmAction = function anonymousConfirm() {
        axios.post(`${self.customConfig.backendURL}ComponentImplementation/execute`, {
          data: modelData,
          p_pool: self.customConfig.backendPoolFolder,
          p_derived: self.customConfig.backendDerivationFolder,
        })
          .then((response) => {
            modal.setData('success', 'Success', response.data);
          })
          .catch((error) => {
            modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
          });
      };

      const stringBody = '<div>Click confirm button to execute the derivation process</div>';
      modal.setData(
        '',
        'Confirm Execute Derivation',
        stringBody,
        'confirm',
        confirmAction,
      );
      modal.setSecondaryMessage(true);
      modal.click();
    }
  }

  public customizeDerivation() {
    const modal = this.variaMosGraph.getModal();
    const self = this;
    if (this.customConfig.backendURL != '' && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder) {
      const modelData = ComponentFunctions.customize(this.variaMosGraph.getGraph());
      if (modelData.length == 0) {
        modal.setData('error', 'Error', 'No files to customize');
        modal.click();
      } else {
        const { modalCustomization } = this;
        axios.post(`${this.customConfig.backendURL}ComponentImplementation/customize/start`, {
          data: JSON.stringify(modelData),
          p_pool: this.customConfig.backendPoolFolder,
          p_derived: this.customConfig.backendDerivationFolder,
        })
          .then((response) => {
            self.customizationResponse = response.data;
            self.customizationCompPos = 0;
            self.customizationCusPos = 0;
            self.customizationCusMaxPos = 0;
            self.customizationCompMaxPos = self.customizationResponse.length;
            const defaultVals = ['', '', '', '', ''];
            const texts = [
              'Current file',
              'Default content',
              'New customized content',
              'File to upload',
              'Notification',
            ];
            const inputs = [
              'current',
              'default',
              'customized',
              'filetoupload',
              'notification',
            ];
            const body = modalCustomization(texts, inputs, defaultVals);
            const confirmAction = self.executeCustomization;
            modal.setData('', 'Customization process', body, 'confirm', confirmAction);
            modal.setSpinnerActive(false);
            modal.setConfirmButtonText('Start/Next');
            modal.setSecondaryMessage(true);
            modal.click();
          })
          .catch((error) => {
            modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
            modal.click();
          });
      }
    }
  }

  public executeCustomization() {
    const fileToUploadTr = document.getElementById('filetouploadtr') as any;
    const customizedTextArea = document.getElementById('customized') as any;

    if (fileToUploadTr) {
      fileToUploadTr.style.display = 'none';
    }

    if (customizedTextArea) {
      customizedTextArea.disabled = false;
    }

    if (this.customizationCompPos < this.customizationCompMaxPos) {
      this.customizationCusMaxPos = this.customizationResponse[this.customizationCompPos][1];
      if (this.customizationCusPos < this.customizationCusMaxPos) {
        const currentPos = 2 + this.customizationCusPos * 3;
        const notificationTextArea = document.getElementById('notification') as any;
        const defaultTextArea = document.getElementById('default') as any;
        const currentInput = document.getElementById('current') as any;
        notificationTextArea.value = '';
        defaultTextArea.value = '';
        let customizedContent = '';
        if (this.previousDest != '') {
          customizedContent = customizedTextArea.value;
        }
        customizedTextArea.value = '';
        const currentValue = this.customizationResponse[this.customizationCompPos][currentPos];
        currentInput.value = currentValue;

        const destination = this.findDestinationFile(currentValue);

        if (destination == '') {
          this.previousDest = '';
          notificationTextArea.value = 'Current file not found, verify the component diagram';
        } else {
          currentInput.value = `ID: ${currentValue} - DEST: ${destination}`;
          const modelDatax = [] as any;
          modelDatax[0] = destination;
          modelDatax[1] = this.customizationResponse[this.customizationCompPos][currentPos + 1];
          modelDatax[2] = this.customizationResponse[this.customizationCompPos][currentPos + 2];
          if (this.previousDest && this.previousDest != '') {
            modelDatax[3] = this.previousDest;
            modelDatax[4] = this.previousCPoint;
            modelDatax[5] = this.previousPlan;
            modelDatax[6] = customizedContent;
          }

          const modelData = JSON.stringify(modelDatax);
          const startNext = document.getElementById('gmodal-button-confirm') as any;
          const customizedArea = document.getElementById('customized') as any;
          startNext.disabled = true;
          const self = this;

          axios.post(`${this.customConfig.backendURL}ComponentImplementation/customize/next`, {
            data: modelData,
            p_pool: this.customConfig.backendPoolFolder,
            p_derived: this.customConfig.backendDerivationFolder,
          })
            .then((response) => {
              startNext.disabled = false;
              if (response.data == '') {
                self.previousDest = '';
                notificationTextArea.value = 'Customization point not found, verify current file';
              } else if (response.data == 'file') {
                self.fileDest = destination;
                fileToUploadTr.style.display = '';
                customizedArea.disabled = true;
              } else {
                self.previousDest = destination;
                self.previousCPoint = modelDatax[1];
                self.previousPlan = modelDatax[2];
                defaultTextArea.value = response.data;
                customizedArea.value = response.data;
              }
            })
            .catch((error) => {
              self.previousDest = '';
              startNext.disabled = false;
            });
        }
        this.customizationCusPos += 1;
      } else {
        const customizedArea = document.getElementById('customized') as any;
        const notificationTextArea = document.getElementById('notification') as any;
        const defaultTextArea = document.getElementById('default') as any;
        const currentInput = document.getElementById('current') as any;
        const customizedContent = customizedArea.value;
        if (this.previousDest && this.previousDest != '' && customizedContent != '') {
          const modelDatax = [] as any;
          modelDatax[0] = this.previousDest;
          modelDatax[1] = this.previousCPoint;
          modelDatax[2] = this.previousPlan;
          modelDatax[3] = customizedContent;
          const modelData = JSON.stringify(modelDatax);
          const self = this;

          axios.post(`${this.customConfig.backendURL}ComponentImplementation/customize/onlysave`, {
            data: modelData,
            p_pool: this.customConfig.backendPoolFolder,
            p_derived: this.customConfig.backendDerivationFolder,
          })
            .then((response) => {
              // nothing
            })
            .catch((error) => {
              self.previousDest = '';
            });
        }
        this.previousDest = '';
        customizedArea.value = '';
        currentInput.value = '';
        defaultTextArea.value = '';
        notificationTextArea.value = 'Component succesfully customized, click Start/Next to continue with another component';
        this.customizationCusPos = 0;
        this.customizationCompPos += 1;
      }
    } else {
      const modal = this.variaMosGraph.getModal();
      modal.setData('success', 'Success', 'Customization completed!');
    }
  }

  public findDestinationFile(id:any) {
    // collect the information of the components and files to be customized
    const componentRoot = this.variaMosGraph.getModel().getCell('component');
    const componentRelations = this.variaMosGraph.getModel().getChildEdges(componentRoot);
    const destination = '';
    for (let i = 0; i < componentRelations.length; i += 1) {
      const source = componentRelations[i].source.getAttribute('label');
      if (source == id) {
        return componentRelations[i].source.getAttribute('destination');
      }
    }
    return '';
  }

  public modalCustomization(texts:any, inputs:any, defaultVals:any) {
    const table = document.createElement('table');
    for (let i = 0; i < texts.length; i += 1) {
      const tr = document.createElement('tr');
      if (i == 3) {
        tr.id = 'filetouploadtr';
        tr.style.display = 'none';
      }
      const td = document.createElement('td');
      td.innerHTML = texts[i];
      tr.appendChild(td);

      let input:any;

      if (i == 0) {
        input = document.createElement('input');
        input.size = 47;
      } else if (i == 3) {
        input = document.createElement('input');
        input.type = 'file';
      } else {
        input = document.createElement('textarea');
        input.cols = 50;
      }

      input.value = defaultVals[i];
      input.id = inputs[i];
      input.name = inputs[i];
      if (i == 0 || i == 1 || i == 4) {
        input.disabled = 'disabled';
      }

      const td2 = document.createElement('td');
      td2.appendChild(input);
      tr.appendChild(td2);
      table.appendChild(tr);
    }
    return table;
  }

  public uploadComponentPool() {
    const modal = this.variaMosGraph.getModal();
    if (this.customConfig.backendURL != '' && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder) {
      const self = this;
      const inputFunction = function anonymousInput(e:any) {
        const files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
          // nothing
        } else {
          const fileToLoad = files[0];
          const formData = new FormData();
          formData.append('file', files[0]);
          let route = `${self.customConfig.backendURL}ComponentImplementation/uploadpool?`;
          route += `pool=${self.customConfig.backendPoolFolder}`;
          axios.post(route, formData,
            {
              headers: {
                'Content-Type': undefined,
              },
            })
            .then((response) => {
              modal.setData('success', 'Success', 'File Uploaded!');
            })
            .catch((error) => {
              modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
            });
        }
      };

      const div = document.createElement('div');
      div.innerHTML = 'Be careful, once the file is uploaded, it will remove the previous component pool folder.<br /><br />';
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = inputFunction;
      div.appendChild(input);
      modal.setData('', 'Upload Component Pool (.zip)', div);
      modal.click();
    }
  }

  public verifyDerivation() {
    const modal = this.variaMosGraph.getModal();
    if (this.customConfig.backendURL != '' && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder) {
      const modelData = JSON.stringify(ComponentFunctions.verify(this.variaMosGraph.getGraph()));
      const self = this;
      const confirmAction = function anonymousConfirm() {
        axios.post(`${self.customConfig.backendURL}ComponentImplementation/verify`, {
          data: modelData,
          p_derived: self.customConfig.backendDerivationFolder,
        })
          .then((response) => {
            modal.setData('success', 'Success', response.data);
          })
          .catch((error) => {
            modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
          });
      };
      const stringBody = '<div>Click confirm button to execute the verification process</div>';
      modal.setData(
        '',
        'Confirm Verification',
        stringBody,
        'confirm',
        confirmAction,
      );
      modal.setSecondaryMessage(true);
      modal.click();
    }
  }

  public htmlEntities(str:string) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  public obtainProduct() {
    const modal = this.variaMosGraph.getModal();
    const self = this;
    const confirmAction = function anonymousConfirm() {
      axios.post(`${self.customConfig.backendURL}ComponentImplementation/getDerivedProduct`, {
        p_derived: self.customConfig.backendDerivationFolder,
      }, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/zip' });
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'product.zip';
          document.body.appendChild(a);
          a.click();
          modal.click();
        })
        .catch((error) => {
          modal.setData('error', 'Error', `Wrong backend connection. ${error}`);
        });
    };

    const stringBody = '<div>Click confirm button to obtain the product</div>';
    modal.setData(
      '',
      'Obtain Product',
      stringBody,
      'confirm',
      confirmAction,
    );
    modal.setSecondaryMessage(true);
    modal.click();
  }
}
</script>
