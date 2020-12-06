<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>
<div class="btn-group" role="group">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" aria-haspopup="true" id="btnGroupActions1">Derivation</button>
    <div id="divDropdownActions" class="dropdown-menu" aria-labelledby="btnGroupActions1">
        <a class="dropdown-item dropdown-pointer" v-on:click="testComponentBackend">Test Component Management Backend</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="showFileCode">Show File Code</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="executeDerivation">Execute Derivation</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="customizeDerivation">Customize Derivation</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="verifyDerivation">Verify Derivation</a>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { ComponentFunctions } from '../custom/ComponentFunctions';
import axios from "axios";

@Options({
  props: ['variaMosGraph']
})
export default class ComponentDerivation extends Vue {
    public variaMosGraph:any; //VariaMosGraph object
    public customConfig:any; //CustomConfig for component model
    public customizationResponse:any;
    public customizationCompPos:any;
    public customizationCusPos:any;
    public customizationCusMaxPos:any;
    public customizationCompMaxPos:any;
    public previousDest:any;
    public previousCPoint:any;
    public previousPlan:any;
    public fileDest:any;

    public mounted(){
        this.customConfig = this.variaMosGraph.configApp.getCustomConfigAsJsonObject().component;
    }

    public testComponentBackend(){
        let modal = this.variaMosGraph.getModal();
        axios.get(this.customConfig.backendURL + 'test')
            .then(function (response) {
                if(response.data == "Ok"){
                    modal.setData("success", "Success", "Backend connection is Ok");
                    modal.click();
                }else{
                    modal.setData("error", "Error", "Wrong backend connection");
                    modal.click();
                }
            })
            .catch(function (error) {
                modal.setData("error", "Error", "Wrong backend connection. " + error);
                modal.click();
            });
    }

    public showFileCode(){
        let cell = this.variaMosGraph.getGraph().getSelectionCell(); 
        let modal = this.variaMosGraph.getModal();
        if(cell==null){
            modal.setData("error", "Error", "Please select a valid file to show the code");
            modal.click();
        }else if(cell.getAttribute("type") == "file" || cell.getAttribute("type") == "fragment" || cell.getAttribute("type") == "custom"){
            let data = {"filename":"", "component":""};
            let customFile = false;
            let htmlEntities = this.htmlEntities;

            if(cell.getAttribute("type")=="custom"){
                data.filename = "customization.json";
                customFile = true;
            }else{
                data.filename = cell.getAttribute("filename");
            }

            data.component = cell.getEdgeAt(0).target.getAttribute("label");
            let modelData = JSON.stringify(data);
            axios.post(this.customConfig.backendURL + 'ComponentImplementation/getFile', {
                    data: modelData,
                    p_pool: this.customConfig.backendPoolFolder
                })
                .then(function (response) {
                    let stringBody = "<div class='vertical-scroll border'><pre><code>" + htmlEntities(response.data) + "</code></pre></div>";
                    modal.setData("", "File code", stringBody);
                    modal.click();
                })
                .catch(function (error) {
                    modal.setData("error", "Error", "Wrong backend connection. " + error);
                    modal.click();
                });

        }
    }

    public executeDerivation(){
        let modal = this.variaMosGraph.getModal();
        if (this.customConfig.backendURL != "" && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder){
            let modelData = JSON.stringify(ComponentFunctions.execute(this.variaMosGraph.getGraph()));
            axios.post(this.customConfig.backendURL + 'ComponentImplementation/execute', {
                    data: modelData,
                    p_pool: this.customConfig.backendPoolFolder,
                    p_derived: this.customConfig.backendDerivationFolder
                })
                .then(function (response) {
                    modal.setData("success", "Success", response.data);
                    modal.click();
                })
                .catch(function (error) {
                    modal.setData("error", "Error", "Wrong backend connection. " + error);
                    modal.click();
                });
        }
    }

    public customizeDerivation(){
        let modal = this.variaMosGraph.getModal();
        let self = this;
        if (this.customConfig.backendURL != "" && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder){
            let modelData = ComponentFunctions.customize(this.variaMosGraph.getGraph());
            if (modelData.length == 0) {
                modal.setData("error", "Error", "No files to customize");
                modal.click();
            }else{
                let modalCustomization = this.modalCustomization;
                axios.post(this.customConfig.backendURL + 'ComponentImplementation/customize/start', {
                        data: JSON.stringify(modelData),
                        p_pool: this.customConfig.backendPoolFolder,
                        p_derived: this.customConfig.backendDerivationFolder
                    })
                    .then(function (response) {
                        self.customizationResponse = response.data;
                        self.customizationCompPos = 0;
                        self.customizationCusPos = 0;
                        self.customizationCusMaxPos = 0;
                        self.customizationCompMaxPos = self.customizationResponse.length;
                        let defaultVals = ["", "", "", "", ""];
                        let texts = [
                            "Current file",
                            "Default content",
                            "New customized content",
                            "File to upload",
                            "Notification",
                        ];
                        let inputs = [
                            "current",
                            "default",
                            "customized",
                            "filetoupload",
                            "notification",
                        ];
                        let body = modalCustomization(texts, inputs, defaultVals);
                        //let confirmAction = function(){console.log("oli");};
                        let confirmAction = self.executeCustomization;
                        modal.setData("", "Customization process", body, "confirm", confirmAction);
                        modal.setConfirmButtonText("Start/Next");
                        modal.setSecondaryMessage(true);
                        modal.click();
                    })
                    .catch(function (error) {
                        modal.setData("error", "Error", "Wrong backend connection. " + error);
                        modal.click();
                    });
            }
        }
    }

    public executeCustomization(){
        let fileToUploadTr = document.getElementById("filetouploadtr") as any;
        let customizedTextArea = document.getElementById("customized") as any;

        if(fileToUploadTr){
            fileToUploadTr.style.display = "none";
        }

        if(customizedTextArea){
            customizedTextArea.disabled = false;
        }

        if (this.customizationCompPos < this.customizationCompMaxPos) {
            this.customizationCusMaxPos = this.customizationResponse[this.customizationCompPos][1];
            if (this.customizationCusPos < this.customizationCusMaxPos) {
                let currentPos = 2 + this.customizationCusPos * 3;
                let notificationTextArea = document.getElementById("notification") as any;
                let defaultTextArea = document.getElementById("default") as any;
                let currentInput = document.getElementById("current") as any;
                notificationTextArea.value = "";
                defaultTextArea.value = "";
                let customizedContent = "";
                if (this.previousDest != "") {
                    customizedContent = customizedTextArea.value;
                }
                customizedTextArea.value = "";
                let currentValue = this.customizationResponse[this.customizationCompPos][currentPos];
                currentInput.value = currentValue;

                let destination = this.findDestinationFile(currentValue);

                if (destination == "") {
                    this.previousDest = "";
                    notificationTextArea.value = "Current file not found, verify the component diagram";
                }else{
                    currentInput.value = "ID: " + currentValue + " - DEST: " + destination;
                    let modelDatax = [] as any;
                    modelDatax[0] = destination;
                    modelDatax[1] = this.customizationResponse[this.customizationCompPos][currentPos+1];
                    modelDatax[2] = this.customizationResponse[this.customizationCompPos][currentPos+2];
                    if(this.previousDest && this.previousDest != ""){
                        modelDatax[3] = this.previousDest;
                        modelDatax[4] = this.previousCPoint;
                        modelDatax[5] = this.previousPlan;
                        modelDatax[6] = customizedContent;
                    }

                    let modelData = JSON.stringify(modelDatax);
                    let startNext = document.getElementById("gmodal-button-confirm") as any;
                    let customizedArea = document.getElementById("customized") as any;
                    startNext.disabled = true;
                    let self = this;

                    axios.post(this.customConfig.backendURL + 'ComponentImplementation/customize/next', {
                            data: modelData,
                            p_pool: this.customConfig.backendPoolFolder,
                            p_derived: this.customConfig.backendDerivationFolder
                        })
                        .then(function (response) {
                            startNext.disabled = false;
                            if(response.data == ""){
                                self.previousDest = "";
                                notificationTextArea.value = "Customization point not found, verify current file";
                            }else if(response.data == "file"){
                                self.fileDest = destination;
                                fileToUploadTr.style.display = "";
                                customizedArea.disabled = true;
                            }else{
                                self.previousDest = destination;
                                self.previousCPoint = modelDatax[1];
                                self.previousPlan = modelDatax[2];
                                defaultTextArea.value = response.data;
                                customizedArea.value = response.data;
                            }
                        })
                        .catch(function (error) {
                            self.previousDest = "";
                            startNext.disabled = false;
                        });
                }
                this.customizationCusPos++;
            }else{
                let customizedArea = document.getElementById("customized") as any;
                let notificationTextArea = document.getElementById("notification") as any;
                let defaultTextArea = document.getElementById("default") as any;
                let currentInput = document.getElementById("current") as any;
                let customizedContent = customizedArea.value;
                if (this.previousDest && this.previousDest != "" && customizedContent != "") {
                    let modelDatax = [] as any;
                    modelDatax[0] = this.previousDest;
                    modelDatax[1] = this.previousCPoint;
                    modelDatax[2] = this.previousPlan;
                    modelDatax[3] = customizedContent;
                    let modelData = JSON.stringify(modelDatax);
                    let self = this;

                    axios.post(this.customConfig.backendURL + 'ComponentImplementation/customize/onlysave', {
                            data: modelData,
                            p_pool: this.customConfig.backendPoolFolder,
                            p_derived: this.customConfig.backendDerivationFolder
                        })
                        .then(function (response) {
                            //nothing
                        })
                        .catch(function (error) {
                            self.previousDest = "";
                        });
                }
                this.previousDest = "";
                customizedArea.value = "";
                currentInput.value = "";
                defaultTextArea.value = "";
                notificationTextArea.value = "Component succesfully customized, click Start/Next to continue with another component";
                this.customizationCusPos = 0;
                this.customizationCompPos++;
            }
        }else{
            let modal = this.variaMosGraph.getModal();
            modal.setData("success", "Success", "Customization completed!");
        }
    }

    public findDestinationFile(id:any){
        //collect the information of the components and files to be customized
        let componentRoot = this.variaMosGraph.getModel().getCell("component");
        let componentRelations = this.variaMosGraph.getModel().getChildEdges(componentRoot);
        let destination = "";
        for (let i = 0; i < componentRelations.length; i++) {
            let source = componentRelations[i].source.getAttribute("label");
            if (source == id) {
                return componentRelations[i].source.getAttribute("destination");
                break;
            }
        }
        return "";
    }

    public modalCustomization(texts:any, inputs:any, defaultVals:any){
        let table = document.createElement('table');
        for(let i = 0; i < texts.length; i++){
            let tr = document.createElement('tr');
            if(i == 3){
                tr.id = "filetouploadtr";
                tr.style.display = "none";
            }
            let td = document.createElement('td');
            td.innerHTML = texts[i];
            tr.appendChild(td);

            let input:any;

            if(i == 0){
                input = document.createElement('input');
                input.size = 47;
            }
            else if(i == 3){
                input = document.createElement('input');
                input.type = "file";
            }else{
                input = document.createElement('textarea');
                input.cols = 50;
            }

            input.value = defaultVals[i];
            input.id = inputs[i];
            input.name = inputs[i];
            if(i == 0 || i == 1 || i == 4){
                input.disabled = "disabled";
            }

            let td2 = document.createElement('td');
            td2.appendChild(input);
            tr.appendChild(td2);
            table.appendChild(tr);
        }
        return table;
    }

    public verifyDerivation(){
        let modal = this.variaMosGraph.getModal();
        if (this.customConfig.backendURL != "" && this.customConfig.backendPoolFolder && this.customConfig.backendDerivationFolder){
            let modelData = JSON.stringify(ComponentFunctions.verify(this.variaMosGraph.getGraph()));
            axios.post(this.customConfig.backendURL + 'ComponentImplementation/verify', {
                    data: modelData,
                    p_derived: this.customConfig.backendDerivationFolder
                })
                .then(function (response) {
                    modal.setData("success", "Success", response.data);
                    modal.click();
                })
                .catch(function (error) {
                    modal.setData("error", "Error", "Wrong backend connection. " + error);
                    modal.click();
                });
        }
    }

    public htmlEntities(str:string) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
}
</script>

<style>
</style>