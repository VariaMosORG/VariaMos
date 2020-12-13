<!--
    @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>

  <Breadcrumb :navigationList="navigationList" />

  <div v-if="currentProject !== null" class="card shadow mb-4">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 class="m-0 font-weight-bold text-primary">Project: {{ currentProject.getName() }} </h6>
    </div>

    <div class="card-body">
      <router-link v-for="model in currentProject.getAvailableModels()" :key="model" :to="'/projects/'+currentProject.getName()+'/'+model" class="btn btn-info marr20">
        {{ getBeautyModelName(model) }}
      </router-link>
    </div>
  </div>

  <div v-if="currentProject !== null" class="card shadow mb-4">
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
import { Options, mixins } from 'vue-class-component';
import { Project as ProjectClass } from '@/store/project/Project';
import Breadcrumb from '@/components/Breadcrumb.vue';
import GlobalVueFunctions from '../mixins/GlobalVueFunctions';

@Options({
  components: {
    Breadcrumb,
  },
  watch: {
    $route(to, from) {
      if (this.$route.name === 'Project') {
        this.updatePageOnRouteChange();
      }
    },
  },
})
export default class Project extends mixins(GlobalVueFunctions) {
  public currentProject:any = '';

  public $store:any; // references vuex store

  public navigationList:any = [
    {
      title: 'Home', route: '/',
    },
    {
      title: 'Projects', route: '/projects',
    },
  ];

  public beforeMount() {
    this.currentProject = ProjectClass.getProjectByName(this.$store.getters['projects/getProjects'], this.$route.params.projectName);
    if (this.currentProject == null) { // redirect if project not found
      this.$router.push({ name: 'NotFound' });
    } else {
      this.navigationList.push({ title: this.currentProject.getName(), route: '' });
    }
  }

  public updatePageOnRouteChange() {
    this.currentProject = ProjectClass.getProjectByName(this.$store.getters['projects/getProjects'], this.$route.params.projectName);
    if (this.currentProject == null) { // redirect if project not found
      this.$router.push({ name: 'NotFound' });
    } else {
      this.navigationList.pop();
      this.navigationList.push({ title: this.currentProject.getName(), route: '' });
    }
  }

  public exportProject(index:any) {
    const jsonProject = this.$store.getters['projects/getProjectJson'](index);
    const pseudoelement = document.createElement('a');
    const filename = 'project.json';
    const blob = new Blob([jsonProject], { type: 'application/json' });

    pseudoelement.setAttribute('href', window.URL.createObjectURL(blob));
    pseudoelement.setAttribute('download', filename);
    pseudoelement.dataset.downloadurl = ['application/json', pseudoelement.download, pseudoelement.href].join(':');
    pseudoelement.draggable = true;
    pseudoelement.classList.add('dragout');
    pseudoelement.click();
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
