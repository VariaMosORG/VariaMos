<template>
  <div class="card shadow mb-4">
      <div class="card-header py-3 nopad">
        <!--<h6 class="m-0 font-weight-bold text-primary">Project 1 - {{ modelType }}</h6>-->
          <ul class="tab">
            <li v-for="availableModel in availableModels" :key="availableModel">
              <router-link v-if="availableModel.link == this.$route.params.modelType" :to="'/project/'+availableModel.link" class="tablinks active">{{ availableModel.name }}</router-link>
              <router-link v-else :to="'/project/'+availableModel.link" class="tablinks">{{ availableModel.name }}</router-link>
            </li>
          </ul>
      </div>
      <div class="card-body">
        <ModelArea :key="$route.params.modelType" />
      </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import ModelArea from '@/components/ModelArea.vue';

Vue.registerHooks(['beforeRouteUpdate']);

@Options({
  components: {
    ModelArea
  }
})
export default class ProjectModels extends Vue {
  public modelType:any = "";
  public availableModels:any = [{"name":"FeatureModel","link":"feature"},{"name":"ComponentModel","link":"component"}];

  public mounted(){
    this.modelType = String(this.$route.params.modelType);
    this.modelType = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1) + "Model";
  }

  public beforeRouteUpdate(to:any, from:any, next:any) {
    console.log('beforeRouteUpdate');
    next();
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
    background-color: #ddd;
}

ul.tab li a:focus, .active {
    background-color: #ddd;
}
</style>