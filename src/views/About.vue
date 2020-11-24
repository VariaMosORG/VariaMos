<template>

    <Breadcrumb :navigationList="navigationList" />

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">About</h6>
        </div>
        <div class="card-body">
            <p>- Info</p>
        </div>
    </div>

    <GlobalModalPlugin />

    <button v-on:click="openModal">
        Launch
    </button>

</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Breadcrumb from '@/components/Breadcrumb.vue';

@Options({
  components: {
    Breadcrumb
  }
})
export default class About extends Vue {
    public $modal:any;
    public navigationList:any = [
        {
            "title":"Home", "route":"/"
        },
        {
            "title":"About", "route":""
        },
    ];

    public openModal(){
        console.log(this.$modal);
        let modal = document.getElementById("globalModalButton");
        if(modal){
            modal.click();
        }
    }
}
</script>
