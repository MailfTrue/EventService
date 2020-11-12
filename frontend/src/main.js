import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import store from "./store";
import Vuelidate from "vuelidate";

Vue.use(VueRouter);
Vue.use(BootstrapVue, IconsPlugin);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
