/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */

import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Docs from '@/views/Docs.vue';
import Config from '@/views/Config.vue';
import Project from '@/views/Project.vue';
import Projects from '@/views/Projects.vue';
import ProjectModels from '@/views/ProjectModels.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/docs',
    name: 'Docs',
    component: Docs,
  },
  {
    path: '/config',
    name: 'Config',
    component: Config,
  },
  {
    path: '/projects/:projectName/:modelType',
    name: 'ProjectModel',
    component: ProjectModels,
  },
  {
    path: '/projects/:projectName',
    name: 'Project',
    component: Project,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
