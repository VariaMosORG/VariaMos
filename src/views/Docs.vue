<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>

    <Breadcrumb :navigationList="navigationList" />

    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Docs</h6>
        </div>
        <div class="card-body">
            <p>Get the latest documentation in the VariaMos wiki.</p>
            <a target="_blank" rel="nofollow" href="https://github.com/danielgara/VariaMos/wiki">VariaMos wiki</a>
        </div>
    </div>

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
    public navigationList:any = [
        {
            title:"Home", route:"/"
        },
        {
            title:"Docs", route:""
        },
    ];
}
</script>
