<template>
  <div>ModelArea</div>
  <div id="mxgraph-container"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { mxgraph, mxgraphFactory } from "ts-mxgraph";

export default class ModelArea extends Vue {
  public mounted() {
    const { mxGraph, mxGraphModel } = mxgraphFactory({
      mxLoadResources: false,
      mxLoadStylesheets: false,
    });

    const container = document.getElementById("mxgraph-container");
    if (container) {
      const model: mxgraph.mxGraphModel = new mxGraphModel();
      const graph: mxgraph.mxGraph = new mxGraph(container, model);
      let parent = graph.getDefaultParent();
      let vertex = graph.insertVertex(parent, null, 'Hello, World!', 20, 20, 180, 60,'boxstyle');
    }
  }
}
</script>