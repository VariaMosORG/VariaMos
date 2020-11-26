<template>

    <Breadcrumb :navigationList="navigationList" />

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Config</h6>
        </div>
        <div class="card-body">
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-4 col-form-label">Model Area Height (400px):</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="configApp.modelAreaHeight">
                </div>
            </div>
            <div class="form-group row">
                <label for="inputPassword" class="col-sm-4 col-form-label">Sidebar background color (navy):</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="configApp.sidebarBackgroundColor">
                </div>
            </div>
          <button v-on:click="saveConfig" class="btn btn-info marr20">Save</button>
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
        this.configApp = this.$store.getters.getConfigApp;
    }

    public mounted(){
        this.$modal = <any> this.$refs.modalPlugin; //reference the modal plugin
    }

    public saveConfig(){
        this.$store.commit("setConfigApp",this.configApp);
        this.$modal.setData("success", "Success", "Config set successfully");
        this.$modal.click();
    }
}
</script>
