/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */

import { createStore } from 'vuex';
import ProjectsModule from './project/ProjectsModule';
import ConfigAppModule from './config_app/ConfigAppModule';

export default createStore({
    modules: {
        projects: ProjectsModule,
        configApp: ConfigAppModule
    }
});