import { createApp } from 'vue';
import ModalPlugin from '@/plugins/ModalPlugin';
import App from './App.vue';
import store from './store';
import router from './router';

createApp(App).use(router).use(store).use(ModalPlugin)
  .mount('.app');
