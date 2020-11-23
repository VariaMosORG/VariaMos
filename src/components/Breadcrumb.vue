<template>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item" v-for="navigation in navigationList" :key="navigation" aria-current="page">
            <template v-if="navigation.route != ''">
                <router-link :to="navigation.route">
                    {{ navigation.title }}
                </router-link>
            </template>
            <template v-else>
                {{ navigation.title }}
            </template>
        </li>
    </ol>
</nav>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
  props: ['navigationList']
})
export default class Breadcrumb extends Vue {
    public navigationList:any;

    public mounted(){
        //console.log(this.navigationList);
    }
}
</script>