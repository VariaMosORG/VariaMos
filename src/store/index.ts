import { createStore } from 'vuex';
import { Project } from './Project';
import { ConfigApp } from './ConfigApp';

export default createStore({
  state: {
    projects:[] as any,
    configApp: new ConfigApp("400px","navy","flex",["feature","component","binding_feature_component"])
  },

  getters: {
    /* begin project section*/
    initializeProjects: state => {
      const localProjectsJSON = localStorage.getItem('variamosProjects');
      if(typeof localProjectsJSON === 'string') {
        let genericProjects = JSON.parse(localProjectsJSON);
        let projects = Project.objectToThisClass(genericProjects);
        state.projects = state.projects.concat(state.projects, projects);
      }
      return state.projects;
    },
    getProjects: state => {
      return state.projects;
    },
    getProjectJson: (state) => (index:any) => {
      return JSON.stringify(state.projects[index]);
    },
    getAllProjects: state => {
      return JSON.stringify(state.projects);
    },
    /* end project section*/

    /* begin configApp section*/
    initializeConfigApp: state => {
      const localConfigAppJSON = localStorage.getItem('variamosConfigApp');
      if(typeof localConfigAppJSON === 'string') {
        let genericProjects = JSON.parse(localConfigAppJSON);
        let configAppNew = ConfigApp.objectToThisClass(genericProjects);
        state.configApp = configAppNew;
      }
      return state.configApp;
    },
    getConfigApp: state => {
      return state.configApp;
    },
    /* end configApp section*/
  },

  mutations: {
    /* begin project section*/
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
    updateProject (state:any, {project, index}) {
      state.projects[index] = project;
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
    /* end project section*/

    /* begin configApp section*/
    setConfigApp (state:any, configApp:ConfigApp) {
      state.configApp = configApp;
      localStorage.setItem('variamosConfigApp', JSON.stringify(state.configApp));
    },
    /* end configApp section*/
  },

  actions: {
  },

  modules: {
  },
});
