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
                        let confirmAction = function(){console.log("oli");};
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

    /*public customizeDerivation(){
        let modal = this.variaMosGraph.getModal();
        let customizationResponse = this.customizationResponse;
        console.log(this.customizationResponse);
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
                        customizationResponse = response.data;
                        console.log(customizationResponse);
                        this.customization_response = response.data;
                        this.customization_comp_pos = 0;
                        this.customization_cus_pos = 0;
                        this.customization_cus_max_pos = 0;
                        this.customization_comp_max_pos = this.customization_response.length;
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
                        let stringBody = modalCustomization(texts, inputs, defaultVals);
                        modal.setData("", "Customization process", stringBody);
                        modal.click();
                    })
                    .catch(function (error) {
                        modal.setData("error", "Error", "Wrong backend connection. " + error);
                        modal.click();
                    });
            }
        }
    }*/

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