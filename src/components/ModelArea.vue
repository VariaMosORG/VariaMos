<template>
  <div>ModelArea</div>
  <div id="mxgraph-container"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { VariaMosGraph } from "@/assets/js/variamosgraph/VariaMosGraph";

export default class ModelArea extends Vue {
  public variaMosGraph = new VariaMosGraph();

  public mounted() {
    const container = document.getElementById("mxgraph-container");
    this.variaMosGraph.setGraph(container);
    this.variaMosGraph.createModel();
  }
}
</script>