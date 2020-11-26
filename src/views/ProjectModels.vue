<template>

  <Breadcrumb :navigationList="navigationList" />

  <div class="card shadow mb-4">
    <div class="card-header py-3 nopad">
      <ul class="tab">
        <li v-for="availableModel in availableModels" :key="availableModel">
          <router-link v-if="availableModel == this.$route.params.modelType" :to="'/projects/'+this.$route.params.projectName+'/'+availableModel" class="tablinks active">{{ getBeautyModelName(availableModel) }}</router-link>
          <router-link v-else :to="'/projects/'+this.$route.params.projectName+'/'+availableModel" class="tablinks">{{ getBeautyModelName(availableModel) }}</router-link>
        </li>
      </ul>
    </div>

    <div class="card-body">
      <!-- Begin Model Area -->
      <div class="row main_area">
        <div id="left-draw" class="col-sm-9 left-area">

          <div id="vgraph-buttons" class="btn-group flex-wrap" role="group">
            <button class="btn btn-info btn-title csstooltip" v-for="button in buttonsArea" :key="button" :id="button.getId()">
              <i :class="'fas fa-'+button.getIcon()"></i>
              <span class="csstooltiptext">{{ button.getButtonTitle() }}</span>
            </button>
          </div>

          <div class="card bg-light text-black shadow mtop">
            <div class="card-body">
              <div id="vgraph-container" class="model-area"></div>
            </div>
          </div>

        </div>

        <div id="right-draw" class="col-sm-3 right-area font13">

          <!-- Begin Elements Section -->
          <div class="card bg-white text-black shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Elements</h6>
            </div>
            <div class="card-body">
              <div id="vgraph-elements" class="elements"></div>
            </div>
          </div>
          <!-- End Elements Section -->

          <!-- Begin Properties Section -->
          <div class="card bg-info text-white shadow mtop">
            <div class="card-header bg-info py-3">
              <h6 class="m-0 font-weight-bold text-white">Properties</h6>
            </div>
            <div class="card-body">
              <div id="vgraph-properties" class="properties"></div>
            </div>
          </div>
          <!-- End Properties Section -->

          <!-- Begin Navigation Section -->
          <div class="card bg-light text-black shadow mtop">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Navigation</h6>
            </div>
            <div class="card-body">
              <div id="vgraph-navigator" class="navigator"></div>
            </div>
          </div>
          <!-- End Navigation Section -->

        </div>
      </div>
      <!-- End Model Area -->
    </div>

    <GlobalModalPlugin ref="modalPlugin" />
    
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { VariaMosGraph } from "@/assets/js/variamosgraph/VariaMosGraph";
import { Project as ProjectClass } from '@/store/Project';
import Breadcrumb from '@/components/Breadcrumb.vue';

@Options({
  components: {
    Breadcrumb
  },
  watch:{
    $route (to, from){
      if(this.$route.name === 'ProjectModel'){
        this.updatePageOnRouteChange();
      }
    }
  } 
})
export default class ProjectModels extends Vue {
  public modelType:any = ""; //example feature
  public modelTypeLabel:any = ""; //example FeatureModel
  public currentProject:any; //currentProject (ProjectClass)
  public availableModels:any = [];
  public variaMosGraph = new VariaMosGraph();
  public buttonsArea = VariaMosGraph.buttons.buttonArea; // buttons
  public divContainer:any; //div container (HTMLElement)
  public divNavigator:any; //div navigator (HTMLElement)
  public divElements:any; //div elements (HTMLElement)
  public divProperties:any; //div properties (HTMLElement)
  public $store:any; //references vuex store
  public $modal:any; //references modalPlugin
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
    this.availableModels = this.currentProject.getAvailableModels();
    this.navigationList.push(
      {
        "title":this.$route.params.projectName, 
        "route":"/projects/"+this.$route.params.projectName
      },
      {
        "title":this.getBeautyModelName(this.$route.params.modelType),
        "route":""
      }
    );
  }

  public mounted(){
    this.variaMosGraph.initTreeModel(this.availableModels, this.currentProject.getXml());
    this.$modal = <any> this.$refs.modalPlugin; //reference the modal plugin
    this.initGraph(1);
  }

  public updatePageOnRouteChange(){
    this.divElements.innerHTML = "";
    this.divNavigator.innerHTML = "";
    this.divProperties.innerHTML = "";
    this.variaMosGraph.removeAllButtonEventListeners();
    this.navigationList.pop();
    this.navigationList.push(
      {
        "title":this.getBeautyModelName(this.$route.params.modelType),
        "route":""
      }
    );
    this.initGraph(2);
  }

  public initGraph(caseLoad:number){
    this.modelType = String(this.$route.params.modelType);
    this.modelTypeLabel = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1) + "Model";
    this.divContainer = document.getElementById("vgraph-container");
    this.divNavigator = document.getElementById("vgraph-navigator");
    this.divElements = document.getElementById("vgraph-elements");
    this.divProperties = document.getElementById("vgraph-properties");
    this.variaMosGraph.initializeGraph(
      this.modelType, this.currentProject, this.divContainer, this.divNavigator, 
      this.divElements, this.divProperties, this.$modal, this.$store, caseLoad
    );
  }

  public getBeautyModelName(name:any){
    return name.charAt(0).toUpperCase() + name.slice(1) + "Model";
  }
}
</script>

<style>
.nopad{
  padding:0px !important;
}

ul.tab {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

ul.tab li {
  float: left;
}

ul.tab li a {
  display: inline-block;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  transition: 0.3s;
  font-weight: 600;
}

ul.tab li a:hover {
  background-color: lavender;
}

ul.tab li a:focus, .active {
  background-color: lavender;
}

@media (max-width: 1261px){
  #vgraph-buttons{
    display: inline-block !important;
  }
  #vgraph-buttons button {
    margin-bottom: 5px;
  }
}

@media (max-width: 992px){
  .right-area, .left-area{
    flex: 100%;
    max-width: 100%;
  }
  .right-area{
    margin-top: 10px;
    padding-left: 0px !important;
  }
}

.model-area{
  overflow-block: scroll;
  overflow-x: auto;
  overflow-y: auto;
  height:55vh;
  background:url("../assets/img/grid.gif");
  cursor:default;
  padding-right: 0px; 
  padding-left: 0px;
}

.main_area{
  margin-right: 0px;
  margin-left: 0px;
}

.left-area{
  padding-right: 0px;
  padding-left: 0px;
}

.mtop{
  margin-top: 10px;
}

.right-area{
  padding-right: 0px;
  padding-left: 10px;
}

.navigator{
  margin-bottom: -30px;
  margin-top: 10px;
}

.font13{
  font-size:13px;
}

.pad10{
  padding: 15px !important;
}

/* buttons */
.buttons {
  display: inline;
  margin: auto;
}

.pad10{
  padding: 15px !important;
}

.navi-buttons{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 0 auto;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
}

.navi-buttons button {
    border: 1px solid #ccc;
    padding: 2px;
    padding-left: 5px;
    padding-right: 5px;
    width: 25px;
    margin-right: 2px;
}

.project-buttons button {
    padding: 2px;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 2px;
}
/* buttons */

/* elements */
.elements{
  touch-action: none;
  display: block;
  padding: 6px;
  padding-left: 10px;
  padding-bottom: 6px;
  overflow: hidden;
}

.elements .pallete-div{
  display: inline-block;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border-radius: 8px;
  overflow: hidden;
  width: 40px;
  height: 32px;
  padding: 1px;
}
/* elements */

/* properties */
.div-property-field{
  padding-bottom: 5px;
}

.property-id-section{
  text-align: right;
  font-weight: 700;
}
/* properties */

</style>