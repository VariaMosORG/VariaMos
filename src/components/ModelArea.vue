<template>
  <div class="row main_area">
    <div id="left-draw" class="col-sm-9 left-area">

      <div class="card bg-light text-white shadow font13">
        <div class="card-body pad10">
          <div id="vgraph-buttons" class="buttons">
              <button class="btn btn-info" v-for="button in buttons" :key="button" :id="button.id">
                <i :class="'fas fa-'+button.icon"></i>
                {{ button.label }}
              </button>
          </div>
        </div>
      </div>

      <div class="card bg-light text-black shadow mtop">
        <div class="card-body">
          <div id="vgraph-container" class="model-area"></div>
        </div>
      </div>

    </div>

    <div id="right-draw" class="col-sm-3 right-area font13">
      <div class="card bg-white text-black shadow">
        <div class="card-body">
          Elements
          <div id="vgraph-elements" class="elements"></div>
        </div>
      </div>

      <div class="card bg-light text-black shadow mtop">
        <div class="card-body">
          Navigation
          <div id="vgraph-navigator" class="navigator"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { VariaMosGraph } from "@/assets/js/variamosgraph/VariaMosGraph";

export default class ModelArea extends Vue {
  public variaMosGraph = new VariaMosGraph();
  public buttons = VariaMosGraph.buttons;

  public mounted() {
    const divContainer = document.getElementById("vgraph-container");
    const divNavigator = document.getElementById("vgraph-navigator");
    const divElements = document.getElementById("vgraph-elements");
    const modelType = "component";
    this.variaMosGraph.initializeGraph(modelType, divContainer, divNavigator, divElements);
  }

}
</script>

<style>
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
  display: flex;
  margin: auto;
  justify-content: space-between;
}

.buttons button {
  /*flex: 0 0 18%;*/
  height: 30px;
  padding: 0px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
}

.pad10{
  padding: 15px !important;
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
</style>