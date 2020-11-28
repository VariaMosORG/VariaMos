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

  public exportProject(index:any){
    let jsonProject = this.$store.getters.getProjectJson(index);
    let pseudoelement = document.createElement("a");
    let filename = "project.json";
    let blob = new Blob([ jsonProject ], { type: "application/json" });

    pseudoelement.setAttribute("href", window.URL.createObjectURL(blob));
    pseudoelement.setAttribute("download", filename);
    pseudoelement.dataset.downloadurl = ["application/json", pseudoelement.download, pseudoelement.href].join(":");
    pseudoelement.draggable = true;
    pseudoelement.classList.add("dragout");
    pseudoelement.click();
  }

  public getBeautyModelName(name:string){
    if(name.includes("_")){
      let parts = name.split("_");
      let completeName = "";
      for (let i = 0; i < parts.length; i++) {
        completeName = completeName + parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      }
      completeName = completeName + "Model";
      return completeName;
    }else{
      return name.charAt(0).toUpperCase() + name.slice(1) + "Model";
    }
  }
}
</script>

<style>
.marr20{
  margin-right: 10px;
  margin-bottom: 5px;
}

.vertical-scroll { 
  max-height: 300px; 
  overflow-x: hidden; 
  overflow-y: auto; 
  text-align:justify; 
} 
</style>