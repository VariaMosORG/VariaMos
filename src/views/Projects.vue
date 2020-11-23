<template>

  <Breadcrumb :navigationList="navigationList" />

  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Create new project</h6>
    </div>

    <div class="card-body">
      <div class="form-group">
        <label><b>Project Name:</b> (Blank spaces not allowed)</label>
        <input type="text" class="form-control" v-model="projectName" placeholder="Enter projectName">
      </div>
      <div class="form-group">
        <label><b>Select available models for current project:</b></label>
        <div class="form-check" v-for="avaModel in avaModels" :key="avaModel">
          <input class="form-check-input" type="checkbox" v-model="projectAvailableModels" :value="avaModel" id="defaultCheck1">
          <label class="form-check-label" for="defaultCheck2">
            {{ getBeautyModelName(avaModel) }}
          </label>
        </div>
      </div>
      <button v-on:click="createProject" class="btn btn-info marr20">Create Project</button>
    </div>
  </div>

  <div class="card shadow mb-4" v-for="(project, index) in projects" :key="project">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <router-link class="m-0 font-weight-bold text-primary" :to="'/projects/'+project.getName()">Project: {{ project.getName() }}</router-link>
        <div class="right-buttons">
          <div class="btn-group">
            <i v-on:click="removeProject(index)" class="fas fa-trash-alt hover-hand"></i>
          </div>
        </div>
    </div>
    <div class="card-body">
      <router-link v-for="model in project.getAvailableModels()" :key="model" :to="'/projects/'+project.getName()+'/'+model" class="btn btn-info marr20">
        {{ getBeautyModelName(model) }}
      </router-link>
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
  }
})
export default class Projects extends Vue {
  public avaModels:any = ["feature","component"];
  public projectName:string = "";
  public projectAvailableModels:any = [];
  public projects:any = [];
  public $store:any; //references vuex store
  public navigationList:any = [
    {
        "title":"Home", "route":"/"
    },
    {
        "title":"Projects", "route":""
    },
  ];

  public mounted(){
    this.projects = this.$store.getters.getProjects;
  }

  public createProject(){
    if(this.projectName == ""){
      alert("Please enter a project name");
    }else if (/\s/.test(this.projectName)) {
      alert("Blank spaces not allowed");
    }else if(ProjectClass.checkIfProjectExists(this.projects, this.projectName)){
      alert("A project with that name already exists");
    }else{
      if(this.projectAvailableModels.length > 0){
        let project = new ProjectClass(this.projectName, "", this.projectAvailableModels);
        this.$store.commit("addProject",project);
      }else{
        alert("You must select at least one model");
      }
    }
  }

  public removeProject(index:any){
    this.$store.commit("removeProject",index);
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
.hover-hand:hover{
  cursor: pointer;
}
</style>