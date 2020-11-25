import { createStore } from 'vuex';
import { Project } from './Project';

export default createStore({
  state: {
    projects:[] as any,
  },

  getters: {
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
    updateProject (state:any, {project, index}) {
      state.projects[index] = project;
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
  },

  actions: {
  },

  modules: {
  },
});
