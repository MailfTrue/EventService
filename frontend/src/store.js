import Vue from "vue";
import EventBus from "./event-bus";
import Vuex from "vuex";
import authApi from "./api/auth";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    showingAuthModal: false,
    currentUser: null,
    authChecked: false,

    showingEventModal: false,
    currentEvent: null,
  },
  mutations: {
    showAuthModal(state) {
      state.showingAuthModal = true;
    },
    hideAuthModal(state) {
      state.showingAuthModal = false;
    },
    setAuthChecked(state, val) {
      state.authChecked = val;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },

    showEventModal(state) {
      state.showingEventModal = true;
    },
    hideEventModal(state) {
      state.showingEventModal = false;
    },
    setCurrentEvent(state, event) {
      state.currentEvent = event;
    },
  },
  actions: {
    async login({ dispatch }, data) {
      localStorage.setItem("jwt_access", data.access);
      localStorage.setItem("jwt_refresh", data.refresh);
      dispatch("loadCurrentUser");

      EventBus.$emit("newEvent");
    },
    async loadCurrentUser({ commit }) {
      const user = await authApi.getCurrentUser();
      commit("setCurrentUser", user);
      commit("setAuthChecked", true);
    },
    async logout({ commit }) {
      localStorage.removeItem("jwt_access");
      localStorage.removeItem("jwt_refresh");
      commit("setCurrentUser", null);
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.authChecked && state.currentUser;
    },
  },
});

export default store;
