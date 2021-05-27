/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */

import GlobalModal from '../components/GlobalModal.vue';

const ModalPlugin = {
  install(app:any, options:any) {
    app.component('GlobalModalPlugin', GlobalModal);
  },
};

export default ModalPlugin;
