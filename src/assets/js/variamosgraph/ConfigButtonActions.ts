import { Button } from './Button';
import { mxgraphFactory } from "ts-mxgraph";
const saveSVG = require("save-svg-as-png");
const { mxCodec, mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});

export class ConfigButtonActions {

    private buttons:Button[];
    private graph:any; //mxGraph (mxGraph)
    private model:any; //mxGraphModel (mxGraphModel)
    private currentProject:any //current loaded project (ProjectClass)
    private divContainer:any; //div container (HTMLElement)
    private $store:any; //references vuex store
    private $modal:any; //references modalPlugin

    public constructor(graph:any, model:any, modal:any, store:any, currentProject:any, divContainer:any, buttons:any) {
        this.buttons = buttons;
        this.graph = graph;
        this.model = model;
        this.currentProject = currentProject;
        this.divContainer = divContainer;
        this.$modal = modal;
        this.$store = store;
    }

    public getButtons(){
        return this.buttons;
    }

    public getGraph(){
        return this.graph;
    }

    public getModel(){
        return this.model;
    }

    public removeAllEventListeners(){
        for (let i = 0; i < this.buttons.length; i++) {
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

    public initializeActions(){
        for (let i = 0; i < this.buttons.length; i++) {
            const functionToExecute = this.buttons[i].getId();
            if((this as any)[functionToExecute]){ // Verify if the function exists
                const currentButton = document.getElementById(functionToExecute);
                (this as any)[functionToExecute](currentButton); // Execute the function exists
            }
        }
    }

    //remove current model for current project
    public resetCurrent(currentButton:HTMLElement){
        const currentProject = this.currentProject;
        const store = this.$store;
        const modal = this.$modal;
        const graph = this.graph;
        const model = this.model;
        let index = Object.getPrototypeOf(currentProject).constructor.getProjectIndexByName(store.getters.getProjects, currentProject.getName());
        if(index != -1){
            currentButton.addEventListener('click', function () {
                let confirmAction = function(){
                    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
                    let encoder = new mxCodec();
                    let result = encoder.encode(model);
                    let xml = mxUtils.getPrettyXml(result);
                    currentProject.setXml(xml);
                    store.commit("updateProject", {"project":currentProject, "index":index});
                    location.reload();
                }
                modal.setData("warning", "Warning", "Are you sure you want to remove the current model of this project?", "confirm", confirmAction);
                modal.click();
            });
        }
    }

    //remove all models for current project
    public resetAll(currentButton:HTMLElement){
        const currentProject = this.currentProject;
        const store = this.$store;
        const modal = this.$modal;
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
        const currentProject = this.currentProject;
        const model = this.model;
        const store = this.$store;
        const modal = this.$modal;
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
        const model = this.model;
        const modal = this.$modal;
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

    //export current project models XML in an XML file
    public export(currentButton:HTMLElement){
        const model = this.model;
        const name =  this.currentProject.getName();
        currentButton.addEventListener('click', function () {
            let encoder = new mxCodec();
            let node = encoder.encode(model);
            let xmlCode = mxUtils.getPrettyXml(node);
            let toXml = xmlCode;
            let pseudoelement = document.createElement("a");
            let filename = name+".xml";
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
        let graph = this.graph;
        currentButton.addEventListener('click', function () {
            graph.zoomIn();
        });
    }

    //delete selected cells in current model
    public delete(currentButton:HTMLElement){
        let graph = this.graph;
        currentButton.addEventListener('click', function () {
            if (graph.isEnabled())
			{
                let removedCells = graph.removeCells();
            }
        });
    }

    //zoom out model
    public zoomOut(currentButton:HTMLElement){
        let graph = this.graph;
        currentButton.addEventListener('click', function () {
            graph.zoomOut();
        });
    }

    //reset zoom model
    public zoomReset(currentButton:HTMLElement){
        let graph = this.graph;
        currentButton.addEventListener('click', function () {
            graph.view.scaleAndTranslate(1, 0, 0);
        });
    }

    public img(currentButton:HTMLElement){
        let divContainer = this.divContainer;
        let name = this.currentProject.getName();
        currentButton.addEventListener('click', function () {
            if(divContainer){
                const svg = divContainer.firstElementChild;
                saveSVG.saveSvgAsPng(svg, name+".png");
            }
        });
    }
    
}