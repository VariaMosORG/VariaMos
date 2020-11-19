<template>
  <div class="row main_area">
    <div id="left-draw" class="col-sm-9 left-area">
      <div class="card bg-light text-black shadow">
        <div class="card-body">
          <div id="vgraph-container" class="model-area"></div>
        </div>
      </div>
    </div>

    <div id="right-draw" class="col-sm-3 right-area" style="font-size:13px">
      <div class="card bg-primary text-white shadow">
        <div class="card-body">
          Elements
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

  public mounted() {
    const container = document.getElementById("vgraph-container");
    const navigator = document.getElementById("vgraph-navigator");
    this.variaMosGraph.initializeGraph(container, navigator);
    this.variaMosGraph.createModel();
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
</style>