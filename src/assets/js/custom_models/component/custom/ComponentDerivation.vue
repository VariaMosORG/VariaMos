<template>
<div class="btn-group" role="group">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" aria-haspopup="true" id="btnGroupActions1">Derivation</button>
    <div id="divDropdownActions" class="dropdown-menu" aria-labelledby="btnGroupActions1">
        <a class="dropdown-item dropdown-pointer" v-on:click="testComponentBackend">Test Component Management Backend</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="showFileCode">Show File Code</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="executeDerivation">Execute Derivation</a>
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