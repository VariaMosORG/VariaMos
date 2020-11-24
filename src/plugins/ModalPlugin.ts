import GlobalModal from '../components/GlobalModal.vue';

const ModalPlugin = {
  install(app:any, options:any) {
    app.component('GlobalModalPlugin', GlobalModal);
    app.config.globalProperties.$modal = "Modallllll";
    /*app.mixin({
      testing() {
        console.log("testing");
      }
    });*/
  }
}
  
export default ModalPlugin;