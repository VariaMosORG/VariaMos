import { mxgraphFactory } from 'ts-mxgraph';

const { mxCodec, mxUtils } = mxgraphFactory({ mxLoadResources: false, mxLoadStylesheets: false });
const saveSVG = require('save-svg-as-png');

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigButtonActions {
  private buttons:any; // model buttons

  private vGraph:any; // VariaMos Graph

  public constructor(vGraph:any, buttons:any) {
    this.vGraph = vGraph;
    this.buttons = buttons;
  }

  public getButtons() {
    return this.buttons;
  }

  // initialize button actions (onclick)
  public initializeActions() {
    for (let i = 0; i < this.buttons.length; i += 1) {
      const functionToExecute = this.buttons[i].getId();
      if ((this as any)[functionToExecute]) { // Verify if the function exists
        const currentButton = document.getElementById(functionToExecute);
        (this as any)[functionToExecute](currentButton); // Execute the function that exists
      }
    }
  }

  // remove all event listeners from all the buttons
  public removeAllEventListeners() {
    for (let i = 0; i < this.buttons.length; i += 1) {
      const buttonId = this.buttons[i].getId();
      const oldButton = document.getElementById(buttonId);
      if (oldButton) {
        const newButton = oldButton.cloneNode(true);
        if (newButton != null && oldButton.parentNode != null) {
          oldButton.parentNode.replaceChild(newButton, oldButton);
        }
      }
    }
  }

  // remove current model for current project
  public resetCurrent(currentButton:HTMLElement) {
    const currentProject = this.vGraph.getCurrentProject();
    const store = this.vGraph.getStore();
    const modal = this.vGraph.getModal();
    const graph = this.vGraph.getGraph();
    const model = this.vGraph.getModel();
    const modelUtil = this.vGraph.getModelUtil();
    const index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters['projects/getProjects'], currentProject.getName());
    if (index != -1) {
      currentButton.addEventListener('click', () => {
        const confirmAction = function anonymousConfirm() {
          const existCloneCells = modelUtil.existCloneCells(graph.getDefaultParent());
          if (existCloneCells) {
            modal.setData('error', 'Error', 'Models that contains cloned cells cannot be removed');
            modal.setSecondaryMessage(true);
          } else {
            // remove clons if exist
            const removedCells = graph.removeCells(graph.getChildVertices(
              graph.getDefaultParent(),
            ));
            for (let i = 0; i < removedCells.length; i += 1) {
              if (removedCells[i].isVertex()) {
                const clon = graph.getModel().getCell(`clon${removedCells[i].getId()}`);
                if (clon) {
                  const cells = [];
                  cells[0] = clon;
                  graph.removeCells(cells);
                }
              }
            }

            const encoder = new mxCodec();
            const result = encoder.encode(model);
            const xml = mxUtils.getPrettyXml(result);
            currentProject.setXml(xml);
            store.commit('projects/updateProject', { project: currentProject, index });
            window.location.reload();
          }
        };
        modal.setData('warning', 'Warning', 'Are you sure you want to remove the current model of this project?', 'confirm', confirmAction);
        modal.click();
      });
    }
  }

  // remove all models for current project
  public resetAll(currentButton:HTMLElement) {
    const currentProject = this.vGraph.getCurrentProject();
    const store = this.vGraph.getStore();
    const modal = this.vGraph.getModal();
    const index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters['projects/getProjects'], currentProject.getName());
    if (index != -1) {
      currentButton.addEventListener('click', () => {
        const confirmAction = function anonymousConfirm() {
          currentProject.setXml('');
          store.commit('projects/updateProject', { project: currentProject, index });
          window.location.reload();
        };
        modal.setData('warning', 'Warning', 'Are you sure you want to remove all models of this project?', 'confirm', confirmAction);
        modal.click();
      });
    }
  }

  // save current project models in localstorage
  public save(currentButton:HTMLElement) {
    const currentProject = this.vGraph.getCurrentProject();
    const model = this.vGraph.getModel();
    const store = this.vGraph.getStore();
    const modal = this.vGraph.getModal();
    const index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters['projects/getProjects'], currentProject.getName());
    if (index != -1) {
      currentButton.addEventListener('click', () => {
        const encoder = new mxCodec();
        const result = encoder.encode(model);
        const xml = mxUtils.getPrettyXml(result);
        currentProject.setXml(xml);
        store.commit('projects/updateProject', { project: currentProject, index });
        modal.setData('success', 'Success', 'All models saved succesfully!');
        modal.click();
      });
    }
  }

  // show current project models XML in popup
  public xml(currentButton:HTMLElement) {
    const model = this.vGraph.getModel();
    const modal = this.vGraph.getModal();
    currentButton.addEventListener('click', () => {
      const encoder = new mxCodec();
      const node = encoder.encode(model);
      const xmlCode = mxUtils.getPrettyXml(node);
      const parsedXml = String(xmlCode).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      const stringBody = `<div class='vertical-scroll border'><pre lang='xml'>${parsedXml}</pre></div>`;
      modal.setData('', 'XML code', stringBody);
      modal.click();
    });
  }

  // import current project models XML from an XML file
  public import(currentButton:HTMLElement) {
    const store = this.vGraph.getStore();
    const modal = this.vGraph.getModal();
    const currentProject = this.vGraph.getCurrentProject();
    const index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters['projects/getProjects'], currentProject.getName());
    currentButton.addEventListener('click', () => {
      const inputFunction = function anonymousInput(e:any) {
        const files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
          // nothing
        } else {
          const fileToLoad = files[0];
          const fileReader = new FileReader();
          fileReader.onload = function anonymousFileReader(fileLoadedEvent:any) {
            const xml = fileLoadedEvent.target.result;
            currentProject.setXml(xml);
            store.commit('projects/updateProject', { project: currentProject, index });
            window.location.reload(); // reload page
          };
          fileReader.readAsText(fileToLoad, 'UTF-8');
        }
      };
      const div = document.createElement('div');
      div.innerHTML = 'Be careful, once the file is uploaded, it will remove the previous XML data.<br /><br />';
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = inputFunction;
      div.appendChild(input);
      modal.setData('', 'Upload XML models code', div);
      modal.click();
    });
  }

  // export current project models XML in an XML file
  public export(currentButton:HTMLElement) {
    const model = this.vGraph.getModel();
    const name = this.vGraph.getCurrentProject().getName();
    currentButton.addEventListener('click', () => {
      const encoder = new mxCodec();
      const node = encoder.encode(model);
      const xmlCode = mxUtils.getPrettyXml(node);
      const toXml = xmlCode;
      const pseudoelement = document.createElement('a');
      const filename = `Models-${name}.xml`;
      const blob = new Blob([toXml], { type: 'text/xml' });

      pseudoelement.setAttribute('href', window.URL.createObjectURL(blob));
      pseudoelement.setAttribute('download', filename);
      pseudoelement.dataset.downloadurl = ['text/xml', pseudoelement.download, pseudoelement.href].join(':');
      pseudoelement.draggable = true;
      pseudoelement.classList.add('dragout');
      pseudoelement.click();
    });
  }

  // zoom in model
  public zoomIn(currentButton:HTMLElement) {
    const graph = this.vGraph.getGraph();
    currentButton.addEventListener('click', () => {
      graph.zoomIn();
    });
  }

  // delete selected cells in current model
  public delete(currentButton:HTMLElement) {
    const graph = this.vGraph.getGraph();
    const modal = this.vGraph.getModal();
    currentButton.addEventListener('click', () => {
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

        if (validRemove) {
          // remove clons if exist
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
    });
  }

  // zoom out model
  public zoomOut(currentButton:HTMLElement) {
    const graph = this.vGraph.getGraph();
    currentButton.addEventListener('click', () => {
      graph.zoomOut();
    });
  }

  // reset zoom model
  public zoomReset(currentButton:HTMLElement) {
    const graph = this.vGraph.getGraph();
    currentButton.addEventListener('click', () => {
      graph.view.scaleAndTranslate(1, 0, 0);
    });
  }

  // convert current model to png format and download it
  public img(currentButton:HTMLElement) {
    const divContainer = this.vGraph.getDivContainer();
    const graph = this.vGraph.getGraph();
    currentButton.addEventListener('click', () => {
      if (divContainer) {
        const svg = divContainer.firstElementChild;
        saveSVG.saveSvgAsPng(svg, `Model-${graph.getDefaultParent().getId()}.png`);
      }
    });
  }
}
