import VueRouter from "vue-router";
import Calendar from "./views/Calendar.vue";
import Auth from "./views/Auth.vue";
import store from "./store";

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: Calendar,
      name: "calendar",
      meta: {
        requiresAuth: true,
      },
    },
    { path: "/auth", name: "auth", component: Auth },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta?.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
    } else {
      next("/auth");
    }
  } else {
    next();
  }
});

export default router;
