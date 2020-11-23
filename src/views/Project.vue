<template>

  <Breadcrumb :navigationList="navigationList" />

  <div class="card shadow mb-4">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 font-weight-bold text-primary">Project: {{ currentProjectName }} </h6>
    </div>

    <div class="card-body">
      <router-link v-for="model in currentProjectModels" :key="model" :to="'/projects/'+currentProjectName+'/'+model" class="btn btn-info marr20">
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
export default class Project extends Vue {
  public currentProjectName:any = "";
  public currentProjectModels:any = "";
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
    this.currentProjectName = this.$route.params.projectName;
    let currentProject = ProjectClass.getProjectByName(this.$store.getters.getProjects, this.$route.params.projectName);
    this.currentProjectModels = currentProject.getAvailableModels();
    this.navigationList.push({"title":this.currentProjectName, "route":""});
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
</style>