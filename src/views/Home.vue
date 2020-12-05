<!--
 @author Daniel Correa <dcorreab@eafit.edu.co>
-->
<template>

  <Breadcrumb :navigationList="navigationList" />

  <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">VariaMos</h6>
      </div>
      <div class="card-body">
          <p>A product line tool for variability modeling and reasoning.</p>

          <p>VariaMos Web was designed as a modeling tool which incorporates different modeling languages
                to specify and analyze families of systems, for instance (self) adaptive systems and (dynamic)
                product lines supporting several types of models and frameworks in a graphically-oriented application 
                available from any web browser.</p>
              
          <p>VariaMos is suppose to be a new way to model the life cycle of (dynamic) product
              lines and families of systems, through the use of a high level constraint language
              to represent and reason over different models by means of different solvers 
              (e.g., GNU and SWI Prolog). </p>

          <p><img alt="VariaMos logo" id="logo" src="@/assets/img/logo.png"></p>
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
export default class Home extends Vue {
  public navigationList:any = [
    {
        "title":"Home", "route":""
    }
  ];
}
</script>

<style>
#logo{
  max-width: 400px;
}
.card-body p{
  text-align: justify;
}
</style>