<template>

  <Breadcrumb :navigationList="navigationList" />

  <div class="card shadow mb-4">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 font-weight-bold text-primary">Project: {{ currentProject.getName() }} </h6>
    </div>

    <div class="card-body">
      <router-link v-for="model in currentProject.getAvailableModels()" :key="model" :to="'/projects/'+currentProject.getName()+'/'+model" class="btn btn-info marr20">
        {{ getBeautyModelName(model) }}
      </router-link>
    </div>
  </div>

  <div class="card shadow mb-4">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 font-weight-bold text-primary">XML code </h6>
    </div>

    <div class="card-body">
      <div class="vertical-scroll border">
        <pre lang="xml">{{ this.currentProject.getXml() }}</pre>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Project as ProjectClass } from '@/store/Project';
import Breadcrumb from '@/components/Breadcrumb.vue';

@Options({
  components: {
    Breadcrumb
  },
  watch:{
    $route (to, from){
      if(this.$route.name === 'Project'){
        this.updatePageOnRouteChange();
      }
    }
  } 
})
export default class Project extends Vue {
  public currentProject:any = "";
  public $store:any; //references vuex store
  public navigationList:any = [
    {
        "title":"Home", "route":"/"
    },
    {
        "title":"Projects", "route":"/projects"
    }
  ];

  public beforeMount(){
    this.currentProject = ProjectClass.getProjectByName(this.$store.getters.getProjects, this.$route.params.projectName);
    this.navigationList.push({"title":this.currentProject.getName(), "route":""});
  }

  public updatePageOnRouteChange(){
    this.currentProject = ProjectClass.getProjectByName(this.$store.getters.getProjects, this.$route.params.projectName);
    this.navigationList.pop();
    this.navigationList.push({"title":this.currentProject.getName(), "route":""});
  }

  public getBeautyModelName(name:string){
    return name.charAt(0).toUpperCase() + name.slice(1) + "Model";
  }
}
</script>

<style>
.marr20{
  margin-right: 10px;
}

.vertical-scroll { 
  height: 300px; 
  overflow-x: hidden; 
  overflow-y: auto; 
  text-align:justify; 
} 
</style>