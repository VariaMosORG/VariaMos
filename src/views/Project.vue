<template>
  <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Project</h6>
      </div>
      <div class="card-body">
        <ModelArea />
      </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import ModelArea from '@/components/ModelArea.vue';

@Options({
  components: {
    ModelArea
  }
})
export default class Project extends Vue {}
</script>