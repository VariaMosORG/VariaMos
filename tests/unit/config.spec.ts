import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import ConfigView from '@/views/Config.vue';
import { createStore } from 'vuex';
import { ConfigApp } from '@/store/config_app/ConfigApp';
import ModalPlugin from '@/plugins/ModalPlugin';

const store = createStore({
  modules:{
    configApp:{
      namespaced: true,
      state: {
        configApp: new ConfigApp(
          '400px',
          'navy',
          'flex',
          ['feature', 'component', 'binding_feature_component'],
          '{}',
        )
      },
      getters:{
        getConfigApp: (state:any) => state.configApp,
      },
      mutations: {
        setConfigApp(state:any, configApp:ConfigApp) {
          state.configApp = configApp;
        }
      },
    }
  }
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: {
        template: 'Mocked route'
      }
    }
  ]
});

test('Check access to Config and Vuex', async () => {
  router.push('/');
  await router.isReady();
  const wrapper = mount(ConfigView, {
    global: {
      plugins: [router, store, ModalPlugin],
    }
  });
  // config route should contain a 'General Config' text
  expect(wrapper.html()).toContain('General Config');
  const inputModelArea = wrapper.get('#input-model-area') as any;

  //default input-model-area value is 400px
  expect(inputModelArea.element.value).toBe("400px");

  //modify value to 600px
  await inputModelArea.setValue('600px');
  const buttonSaveConfig = wrapper.get('#save-config') as any;
  //save new value
  await buttonSaveConfig.trigger('click');

  //obtain saved value from vuex
  const newModelArea = store.getters['configApp/getConfigApp'].getModelAreaHeight();
  expect(newModelArea).toBe("600px");
});