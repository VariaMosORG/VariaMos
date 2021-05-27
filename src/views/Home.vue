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
      <p>VariaMos a is modeling tool and a framework,
        that can be easily extended, and that allows you to define your
        own models. </p>

      <p><img alt="VariaMos logo" id="logo" src="@/assets/img/logo.png"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Breadcrumb from '@/components/Breadcrumb.vue';

@Options({
  components: {
    Breadcrumb,
  },
})
export default class Home extends Vue {
  public navigationList:any = [
    {
      title: 'Home', route: '',
    },
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
