<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>

    <Breadcrumb :navigationList="navigationList" />

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">General Config</h6>
        </div>
        <div class="card-body">
            <div class="form-group row">
                <label class="col-sm-4 col-form-label">Model Area Height (400px):</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="configApp.modelAreaHeight">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-4 col-form-label">Sidebar background color (navy):</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="configApp.sidebarBackgroundColor">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-4 col-form-label">Display Top Bar (flex):</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="configApp.displayTopBar">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-4 col-form-label">Custom Config:</label>
                <div class="col-sm-8">
                <textarea class="form-control" rows="3" v-model="configApp.customConfig"></textarea>
                </div>
            </div>
          <button v-on:click="saveConfig" class="btn btn-info marr20">Save</button>
        </div>
    </div>

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Available Installed Models</h6>
        </div>
        <div class="card-body">
            <ul class="list-group">
                <li class="list-group-item" v-for="installedModel in configApp.installedModels" v-bind:key="installedModel">
                    {{ installedModel }}
                </li>
            </ul>
            <br />
            <button v-on:click="discoverModels" class="btn btn-info marr20">Discover installed models</button>
        </div>
    </div>

    <GlobalModalPlugin ref="modalPlugin" />

</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Breadcrumb from '@/components/Breadcrumb.vue';

@Options({
  components: {
    Breadcrumb
  }
})
export default class Config extends Vue {
    public configApp:any; //global configApp (store)
    public $store:any; //references vuex store
    public $modal:any; //references modalPlugin
    public navigationList:any = [
        {
            "title":"Home", "route":"/"
        },
        {
            "title":"Config", "route":""
        },
    ];

    public beforeMount(){
        this.configApp = this.$store.getters['configApp/getConfigApp'];
    }

    public mounted(){
        this.$modal = <any> this.$refs.modalPlugin; //reference the modal plugin
    }

    public discoverModels(){
        const modelFiles = require.context('@/assets/js/custom_models', true, /\.ts$/);
        const modelFilesKeys = modelFiles.keys();
        let listOfModels:string[] = [];
        for (let i = 0; i < modelFilesKeys.length; i++) {
            let modelSplit = modelFilesKeys[i].split("/");
            if(modelSplit.length == 3){
                if (listOfModels.indexOf(modelSplit[1]) == -1) {
                    listOfModels.push(modelSplit[1]);
                }
            }
        }
        this.configApp.setInstalledModels(listOfModels);
        this.$store.commit("configApp/setConfigApp",this.configApp);
        this.$modal.setData("success", "Success", "List of installed models updated");
        this.$modal.click();
    }

    public saveConfig(){
        this.$store.commit("configApp/setConfigApp",this.configApp);
        this.$modal.setData("success", "Success", "Config set successfully");
        this.$modal.click();
    }
}
</script>
