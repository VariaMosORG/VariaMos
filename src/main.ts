import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import ModalPlugin from '@/plugins/ModalPlugin.ts';

createApp(App).use(router).use(store).use(ModalPlugin).mount('.app');
