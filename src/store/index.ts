/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */

import { createStore } from 'vuex';
import { Project } from './Project';
import { ConfigApp } from './ConfigApp';

//Begin Project Module
const moduleProject = {
  state: { 
    projects:[] as any,
  },

  getters: { 
    initializeProjects: (state:any) => {
      const localProjectsJSON = localStorage.getItem('variamosProjects');
      if(typeof localProjectsJSON === 'string') {
        let genericProjects = JSON.parse(localProjectsJSON);
        let projects = Project.objectToThisClass(genericProjects);
        state.projects = state.projects.concat(state.projects, projects);
      }
      return state.projects;
    },
    getProjects: (state:any) => {
      return state.projects;
    },
    getProjectJson: (state:any) => (index:any) => {
      return JSON.stringify(state.projects[index]);
    },
    getAllProjects: (state:any) => {
      return JSON.stringify(state.projects);
    },
  },

  mutations: {
    addProject (state:any, project:Project) {
      state.projects.push(project);
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
    removeProject (state:any, index:any) {
      state.projects.splice(index,1);
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
    removeAllProjects (state:any) {
      state.projects = [];
      localStorage.setItem('variamosProjects', "[]");
    },
    updateProject (state:any, {project, index}:any) {
      state.projects[index] = project;
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
  },
}
//End Project Module

//Begin ConfigApp Module
const moduleConfigApp = {
  state: { 
    configApp: new ConfigApp(
      "400px",
      "navy",
      "flex",
      ["feature","component","binding_feature_component"],
      "{}"),
  },

  getters: { 
    initializeConfigApp: (state:any) => {
      const localConfigAppJSON = localStorage.getItem('variamosConfigApp');
      if(typeof localConfigAppJSON === 'string') {
        let genericProjects = JSON.parse(localConfigAppJSON);
        let configAppNew = ConfigApp.objectToThisClass(genericProjects);
        state.configApp = configAppNew;
      }
      return state.configApp;
    },
    getConfigApp: (state:any) => {
      return state.configApp;
    },
  },

  mutations: {
    setConfigApp (state:any, configApp:ConfigApp) {
      state.configApp = configApp;
      localStorage.setItem('variamosConfigApp', JSON.stringify(state.configApp));
    },
  },
}
//End ConfigApp Module

export default createStore({
  modules: {
    project: moduleProject,
    configApp: moduleConfigApp
  }
});