<template>
  <div id="app">
    <router-view></router-view>
    <auth-form />
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { mapActions } from "vuex";
import AuthForm from "./components/AuthForm.vue";

export default {
  name: "App",
  components: {
    AuthForm,
  },
  data: () => ({}),
  methods: {
    ...mapActions(["loadCurrentUser"]),
  },
  mounted() {
    this.loadCurrentUser();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
