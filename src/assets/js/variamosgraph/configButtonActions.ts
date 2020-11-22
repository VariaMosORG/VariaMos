import { Button } from './Button';
import { mxgraphFactory } from "ts-mxgraph";

export class configButtonActions {

    public buttons: Button[];
    public graph: any;
    public model: any;

    public constructor(graph:any, model:any, buttons:any) {
        this.buttons = buttons;
        this.graph = graph;
        this.model = model;
    }

    public removeAllEventListeners(){
        for (let i = 0; i < this.buttons.length; i++) {
            const buttonId = this.buttons[i].id;
            const oldButton = document.getElementById(buttonId);
            if(oldButton){
                let newButton = oldButton.cloneNode(true);
                if(newButton !=null && oldButton.parentNode != null){
                    oldButton.parentNode.replaceChild(newButton, oldButton);
                }
            }
        }
    }

    public initializeActions(){
        for (let i = 0; i < this.buttons.length; i++) {
            const functionToExecute = this.buttons[i].id;
            if((this as any)[functionToExecute]){ // Verify if the function exists
                const currentButton = document.getElementById(functionToExecute);
                (this as any)[functionToExecute](currentButton); // Execute the function exists
            }
        }
    }

    public xml(currentButton:HTMLElement){
        const { mxCodec, mxUtils } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        const model = this.model;
        currentButton.addEventListener('click', function () {
            let encoder = new mxCodec();
            let node = encoder.encode(model);
            let xmlCode = mxUtils.getPrettyXml(node);
            alert(xmlCode);
        });
    }

    public zoomIn(currentButton:HTMLElement){
        let graph = this.graph;
        currentButton.addEventListener('click', function () {
            graph.zoomIn();
        });
    }

    public zoomOut(currentButton:HTMLElement){
        let graph = this.graph;
        currentButton.addEventListener('click', function () {
            graph.zoomOut();
        });
    }

    public zoomReset(currentButton:HTMLElement){
        let graph = this.graph;
        currentButton.addEventListener('click', function () {
            graph.view.scaleAndTranslate(1, 0, 0);
        });
    }

    public img(currentButton:HTMLElement){
        //const { mxPrintPreview } = mxgraphFactory({mxLoadResources: false, mxLoadStylesheets: false});
        //const graph = this.graph;
        //preview.open();
        /*currentButton.addEventListener('click', function () {
            const preview = new mxPrintPreview(graph,1,10,"");
            preview.open(null,null,null,null);
        });*/ //not working
    }
    
}