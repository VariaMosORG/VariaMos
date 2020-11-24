<template>

<!-- Modal -->
<div class="modal fade" id="globalModal" tabindex="-1" role="dialog" aria-labelledby="globalModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="globalModalLabel">{{ title }}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        {{ content }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" @click="confirm" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>

  <!-- Button trigger modal -->
  <button id="globalModalButton" style="display:none" data-toggle="modal" data-target="#globalModal">B</button>
</div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class AppModal extends Vue {
  public visible:boolean = true;
  public title:string = "Important";
  public content:string = "Are you sure?";

  public show(visible:boolean, title:string, content:string){
    this.visible = visible;
    this.title = title;
    this.content = content;
  }

  public confirm(){
    let modal = document.getElementById("globalModalButton");
    if(modal){
        modal.click();
    }
  }
}
</script>

<style>
.modal-content{
  border: 0px !important;
}
</style>