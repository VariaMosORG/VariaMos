<template>
<div class="btn-group flex-wrap show" role="group">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" aria-haspopup="true" id="btnGroupActions1">Model Actions</button>
    <div id="divDropdownActions" class="dropdown-menu" aria-labelledby="btnGroupActions1">
        <a class="dropdown-item dropdown-pointer" v-on:click="hideFragmentRelations">Hide all fragment alter relations</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="showFragmentRelations">Show all fragment alter relations</a>
        <a class="dropdown-item dropdown-pointer" v-on:click="showFragmentRelationsSelected">Show alter relations for current fragments</a>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
  props: ['variaMosGraph']
})
export default class ComponentModelActions extends Vue {
    public variaMosGraph:any; //VariaMosGraph object

    public hideFragmentRelations(){
        const graph = this.variaMosGraph.getGraph();
        let componentRoot = graph.getModel().getCell("component");
        let childs = graph.getModel().getChildEdges(componentRoot);

        for(let i = 0; i < childs.length; i++){
            if(childs[i].getValue().nodeName == "rel_fragment_file"){
                childs[i].setVisible(false);
            }
        }
        graph.refresh();
    }

    public showFragmentRelations(){
        const graph = this.variaMosGraph.getGraph();
        let componentRoot = graph.getModel().getCell("component");
        let childs = graph.getModel().getChildEdges(componentRoot);

        for(let i = 0; i < childs.length; i++){
            if(childs[i].getValue().nodeName == "rel_fragment_file"){
                childs[i].setVisible(true);
            }
        }
        graph.refresh();
    }

    public showFragmentRelationsSelected(){
        const graph = this.variaMosGraph.getGraph();
        const modal = this.variaMosGraph.getModal();
        let cell = graph.getSelectionCell();
        if(cell == null) {
            modal.setData("error", "Error", "Please select a valid Fragment");
            modal.click();
        }else{
            if (!(cell.getAttribute("type") == "fragment")){
                modal.setData("error", "Error", "Please select a valid Fragment");
                modal.click();
            }else{
                let componentRoot = graph.getModel().getCell("component");
                let childs = graph.getModel().getChildEdges(componentRoot);

                for(let i = 0; i < childs.length; i++) {
                    if (childs[i].getValue().nodeName == "rel_fragment_file"){
                        childs[i].setVisible(false);
                    }
                }

                let childsCurrent = graph.getModel().getOutgoingEdges(cell);
                for(let i = 0; i < childsCurrent.length; i++) {
                    if(childsCurrent[i].getValue().nodeName == "rel_fragment_file"){
                        childsCurrent[i].setVisible(true);
                    }
                }
                graph.refresh();
            }
        }
    }
}
</script>

<style>
</style>