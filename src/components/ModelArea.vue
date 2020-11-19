<template>
  <div id="mxgraph-container" class="model-area"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { VariaMosGraph } from "@/assets/js/variamosgraph/VariaMosGraph";

export default class ModelArea extends Vue {
  public variaMosGraph = new VariaMosGraph();

  public mounted() {
    const container = document.getElementById("mxgraph-container");
    this.variaMosGraph.initializeGraph(container);
    this.variaMosGraph.createModel();
  }
}
</script>

<style>
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
</style>