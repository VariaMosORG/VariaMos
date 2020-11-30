import { Button } from './Button';
import { mxgraphFactory } from "ts-mxgraph";
const { mxCodec, mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
const saveSVG = require("save-svg-as-png");

export class ConfigButtonActions {

    private buttons:Button[]; //model buttons
    private vGraph:any; //VariaMos Graph

    public constructor(vGraph:any, buttons:any) {
        this.vGraph = vGraph;
        this.buttons = buttons;
    }

    public getButtons(){
        return this.buttons;
    }

    //initialize button actions (onclick)
    public initializeActions(){
        for(let i = 0; i < this.buttons.length; i++) {
            const functionToExecute = this.buttons[i].getId();
            if((this as any)[functionToExecute]){ // Verify if the function exists
                const currentButton = document.getElementById(functionToExecute);
                (this as any)[functionToExecute](currentButton); // Execute the function that exists
            }
        }
    }

    //remove all event listeners from all the buttons
    public removeAllEventListeners(){
        for(let i = 0; i < this.buttons.length; i++) {
            const buttonId = this.buttons[i].getId();
            const oldButton = document.getElementById(buttonId);
            if(oldButton){
                let newButton = oldButton.cloneNode(true);
                if(newButton != null && oldButton.parentNode != null){
                    oldButton.parentNode.replaceChild(newButton, oldButton);
                }
            }
        }
    }

    //remove current model for current project
    public resetCurrent(currentButton:HTMLElement){
        const currentProject = this.vGraph.getCurrentProject();
        const store = this.vGraph.getStore();
        const modal = this.vGraph.getModal();
        const graph = this.vGraph.getGraph();
        const model = this.vGraph.getModel();
        const modelUtil = this.vGraph.getModelUtil();
        let index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters.getProjects, currentProject.getName());
        if(index != -1){
            currentButton.addEventListener('click', function () {
                let confirmAction = function(){
                    let existCloneCells = modelUtil.existCloneCells(graph.getDefaultParent());
                    if(existCloneCells){
                        modal.setData("error", "Error", "Models that contains cloned cells cannot be removed");
                        modal.setSecondaryMessage(true);
                    }else{
                        //remove clons if exist
                        let removedCells = graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
                        for (let i = 0; i < removedCells.length; i++) {
                            if(removedCells[i].isVertex()){
                                let clon = graph.getModel().getCell("clon"+removedCells[i].getId());
                                if(clon){
                                    let cells = [];
                                    cells[0] = clon;
                                    graph.removeCells(cells);
                                }
                            }
                        }

                        let encoder = new mxCodec();
                        let result = encoder.encode(model);
                        let xml = mxUtils.getPrettyXml(result);
                        currentProject.setXml(xml);
                        store.commit("updateProject", {"project":currentProject, "index":index});
                        location.reload();
                    }
                }
                modal.setData("warning", "Warning", "Are you sure you want to remove the current model of this project?", "confirm", confirmAction);
                modal.click();
            });
        }
    }

    //remove all models for current project
    public resetAll(currentButton:HTMLElement){
        const currentProject = this.vGraph.getCurrentProject();
        const store = this.vGraph.getStore();
        const modal = this.vGraph.getModal();
        let index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters.getProjects, currentProject.getName());
        if(index != -1){
            currentButton.addEventListener('click', function () {
                let confirmAction = function(){
                    currentProject.setXml("");
                    store.commit("updateProject", {"project":currentProject, "index":index});
                    location.reload();
                }
                modal.setData("warning", "Warning", "Are you sure you want to remove all models of this project?", "confirm", confirmAction);
                modal.click();
            });
        }
    }

    //save current project models in localstorage
    public save(currentButton:HTMLElement){
        const currentProject = this.vGraph.getCurrentProject();
        const model = this.vGraph.getModel();
        const store = this.vGraph.getStore();
        const modal = this.vGraph.getModal();
        let index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters.getProjects, currentProject.getName());
        if(index != -1){
            currentButton.addEventListener('click', function () {
                let encoder = new mxCodec();
                let result = encoder.encode(model);
                let xml = mxUtils.getPrettyXml(result);
                currentProject.setXml(xml);
                store.commit("updateProject", {"project":currentProject, "index":index});
                modal.setData("success", "Success", "All models saved succesfully!");
                modal.click();
            });
        }
    }

    //show current project models XML in popup
    public xml(currentButton:HTMLElement){
        const model = this.vGraph.getModel();
        const modal = this.vGraph.getModal();
        currentButton.addEventListener('click', function () {
            let encoder = new mxCodec();
            let node = encoder.encode(model);
            let xmlCode = mxUtils.getPrettyXml(node);
            let parsedXml = String(xmlCode).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            let stringBody = "<div class='vertical-scroll border'><pre lang='xml'>"+parsedXml+"</pre></div>";
            modal.setData("", "XML code", stringBody);
            modal.click();
        });
    }

    //import current project models XML from an XML file
    public import(currentButton:HTMLElement){
        const store = this.vGraph.getStore();
        const modal = this.vGraph.getModal();
        const currentProject = this.vGraph.getCurrentProject();
        let index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters.getProjects, currentProject.getName());
        currentButton.addEventListener('click', function () {
            let inputFunction = function(e:any){
                let files = e.target.files || e.dataTransfer.files;
                if(!files.length){
                return;
                }else{
                    let fileToLoad = files[0];
                    let fileReader = new FileReader();
                    fileReader.onload = function(fileLoadedEvent:any) 
                    {
                        let xml = fileLoadedEvent.target.result;
                        currentProject.setXml(xml);
                        store.commit("updateProject", {"project":currentProject, "index":index});
                        location.reload(); //reload page
                    }
                    fileReader.readAsText(fileToLoad, "UTF-8");
                }
            }
            let div = document.createElement("div");
            div.innerHTML = "Be careful, once the file is uploaded, it will remove the previous XML data.<br /><br />";
            let input = document.createElement("input");
            input.type = "file";
            input.onchange =  inputFunction;
            div.appendChild(input);
            modal.setData("", "Upload XML models code", div);
            modal.click();
        });
    }

    //export current project models XML in an XML file
    public export(currentButton:HTMLElement){
        const model = this.vGraph.getModel();
        const name = this.vGraph.getCurrentProject().getName();
        currentButton.addEventListener('click', function () {
            let encoder = new mxCodec();
            let node = encoder.encode(model);
            let xmlCode = mxUtils.getPrettyXml(node);
            let toXml = xmlCode;
            let pseudoelement = document.createElement("a");
            let filename = "Models-"+name+".xml";
            let blob = new Blob([ toXml ], { type: "text/xml" });

            pseudoelement.setAttribute("href", window.URL.createObjectURL(blob));
            pseudoelement.setAttribute("download", filename);
            pseudoelement.dataset.downloadurl = ["text/xml", pseudoelement.download, pseudoelement.href].join(":");
            pseudoelement.draggable = true;
            pseudoelement.classList.add("dragout");
            pseudoelement.click();
        });
    }

    //zoom in model
    public zoomIn(currentButton:HTMLElement){
        const graph = this.vGraph.getGraph();
        currentButton.addEventListener('click', function () {
            graph.zoomIn();
        });
    }

    //delete selected cells in current model
    public delete(currentButton:HTMLElement){
        const graph = this.vGraph.getGraph();
        const modal = this.vGraph.getModal();
        currentButton.addEventListener('click', function () {
            if(graph.isEnabled()){
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
        });
    }

    //zoom out model
    public zoomOut(currentButton:HTMLElement){
        const graph = this.vGraph.getGraph();
        currentButton.addEventListener('click', function () {
            graph.zoomOut();
        });
    }

    //reset zoom model
    public zoomReset(currentButton:HTMLElement){
        const graph = this.vGraph.getGraph();
        currentButton.addEventListener('click', function () {
            graph.view.scaleAndTranslate(1, 0, 0);
        });
    }

    //convert current model to png format and download it
    public img(currentButton:HTMLElement){
        const divContainer = this.vGraph.getDivContainer();
        const graph = this.vGraph.getGraph();
        currentButton.addEventListener('click', function () {
            if(divContainer){
                const svg = divContainer.firstElementChild;
                saveSVG.saveSvgAsPng(svg, "Model-"+graph.getDefaultParent().getId()+".png");
            }
        });
    }
}