<template>
  <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Project 1</h6>
      </div>
      <div class="card-body">
        <router-link to="/project/feature" class="btn btn-info marr20">
          FeatureModel
        </router-link>
        <router-link to="/project/component" class="btn btn-info">
          ComponentModel
        </router-link>
       </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Project extends Vue {}
</script>

<style>
.marr20{
  margin-right: 10px;
}
</style>