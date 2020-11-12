<template>
  <calendar />
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import Calendar from "./Calendar.vue";

export default {
  components: { Calendar },
  methods: {
    ...mapMutations(["showAuthModal", "hideAuthModal"]),
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  watch: {
    isAuthenticated() {
      if (this.isAuthenticated) {
        this.hideAuthModal();
        this.$router.push({ name: "calendar" });
      } else {
        this.showAuthModal();
      }
    },
  },
  mounted() {
    if (!this.isAuthenticated) this.showAuthModal();
  },
};
</script>