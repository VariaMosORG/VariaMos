import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Config from '@/views/Config.vue';
import Projects from '@/views/Projects.vue';
import ProjectModels from '@/views/ProjectModels.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/config',
    name: 'Config',
    component: Config,
  },
  {
    path: '/projects/:modelType',
    name: 'ProjectModel',
    component: ProjectModels,
  },
  {
    path: '/projects',
    name: 'Project',
    component: Projects,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
