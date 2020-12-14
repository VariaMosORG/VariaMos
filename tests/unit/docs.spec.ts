import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import DocsView from '@/views/Docs.vue';

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

test('Access to Docs', async () => {
  router.push('/');
  await router.isReady();
  const wrapper = mount(DocsView, {
    global: {
      plugins: [router]
    }
  });
  // docs route should contain a 'VariaMos wiki' text
  expect(wrapper.html()).toContain('VariaMos wiki');
});