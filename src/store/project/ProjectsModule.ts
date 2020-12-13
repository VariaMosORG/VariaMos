/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
import { Project } from './Project';

const module = {
  namespaced: true,

  state: {
    projects: [] as any,
  },

  getters: {
    initializeProjects: (state:any) => {
      const localProjectsJSON = localStorage.getItem('variamosProjects');
      if (typeof localProjectsJSON === 'string') {
        const genericProjects = JSON.parse(localProjectsJSON);
        const projects = Project.objectToThisClass(genericProjects);
        state.projects = state.projects.concat(state.projects, projects);
      }
      return state.projects;
    },
    getProjects: (state:any) => state.projects,
    getProjectJson: (state:any) => (index:any) => JSON.stringify(state.projects[index]),
    getAllProjects: (state:any) => JSON.stringify(state.projects),
  },

  mutations: {
    addProject(state:any, project:Project) {
      state.projects.push(project);
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
    removeProject(state:any, index:any) {
      state.projects.splice(index, 1);
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
    removeAllProjects(state:any) {
      state.projects = [];
      localStorage.setItem('variamosProjects', '[]');
    },
    updateProject(state:any, { project, index }:any) {
      state.projects[index] = project;
      localStorage.setItem('variamosProjects', JSON.stringify(state.projects));
    },
  },
};

export default module;
