<template>
  <b-modal
    v-model="showingAuthModal"
    v-if="authChecked"
    :title="title"
    hide-footer
  >
    <b-form @submit.stop.prevent="handleSubmit()">
      <b-form-group label="Username:" label-for="username">
        <b-form-input
          id="username"
          v-model.trim="$v.username.$model"
          type="text"
          required
          placeholder="Введите имя пользователя"
        ></b-form-input>
        <b-form-invalid-feedback
          force-show
          v-if="!$v.username.required && $v.username.$error"
        >
          Это поле обязательно
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          force-show
          v-if="!$v.username.minLength && $v.username.$error"
        >
          Имя пользователя должно содержать не менее 5 символов
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          force-show
          v-if="
            !$v.username.serverError &&
            serverErrors.username &&
            $v.username.$error
          "
        >
          {{ serverErrors.username.join(", ") }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Email:" label-for="email" v-if="mode === 1">
        <b-form-input
          id="email"
          v-model.trim="$v.email.$model"
          type="email"
          required
          placeholder="Введите email"
        ></b-form-input>
        <b-form-invalid-feedback
          force-show
          v-if="!$v.email.required && $v.email.$error"
        >
          Это поле обязательно
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          force-show
          v-if="!$v.email.email && $v.email.$error"
        >
          Неправильный формат
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Пароль:" label-for="password">
        <b-form-input
          type="password"
          v-model.trim="$v.password.$model"
          id="password"
          required
        ></b-form-input>
        <b-form-invalid-feedback
          force-show
          v-if="!$v.password.required && $v.password.$error"
        >
          Это поле обязательно
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          force-show
          v-if="
            (!$v.password.minLength || !$v.password.maxLength) &&
            $v.password.$error
          "
        >
          Пароль должен быть длиной от 8 до 20 символов
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          force-show
          v-if="
            !$v.password.serverError &&
            serverErrors.password &&
            $v.password.$error
          "
        >
          {{ serverErrors.password.join(", ") }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        label="Повторите пароль:"
        label-for="password2"
        v-if="mode === 1"
      >
        <b-form-input
          type="password"
          v-model.trim="$v.password2.$model"
          id="password2"
          required
        ></b-form-input>
        <b-form-invalid-feedback
          force-show
          v-if="!$v.password2.sameAsPassword && $v.password2.$error"
        >
          Пароли не совпадают
        </b-form-invalid-feedback>
      </b-form-group>
      <div>
        <b-btn variant="primary" type="submit" class="mr-3">{{
          submitBtnText
        }}</b-btn>
        <b-btn variant="link" @click="mode = mode === 1 ? 2 : 1">
          {{ changeModeBtnText }}
        </b-btn>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";
import authApi from "../api/auth";

export default {
  data: () => ({
    username: null,
    email: null,
    password: null,
    password2: null,
    mode: 1, // 1 - регистрация, 2 - вход
    serverErrors: {},
  }),
  computed: {
    ...mapState(["authChecked"]),
    showingAuthModal: {
      get() {
        return this.$store.state.showingAuthModal;
      },
      set() {
        this.hideAuthModal();
      },
    },
    title() {
      let title;
      if (this.mode === 1) title = "Регистрация";
      else if (this.mode === 2) title = "Вход";
      return title;
    },
    submitBtnText() {
      let text;
      if (this.mode === 1) text = "Зарегистрироваться";
      else if (this.mode === 2) text = "Войти";
      return text;
    },
    changeModeBtnText() {
      let text;
      if (this.mode === 1) text = "У меня уже есть аккаунт";
      else if (this.mode === 2) text = "Создать аккаунт";
      return text;
    },
  },
  methods: {
    ...mapMutations(["hideAuthModal"]),
    async handleSubmit() {
      this.serverErrors = {};
      this.$v.$touch();
      if (!this.$v.$error) {
        let res;
        if (this.mode === 1) {
          res = await authApi.register(
            this.email,
            this.username,
            this.password
          );

          if (res != true) this.serverErrors = res;
          else this.hideAuthModal();
        } else if (this.mode === 2) {
          res = await authApi.login(this.username, this.password);
          console.log(res);
          if (res.status !== 200) {
            this.serverErrors = {
              password: ["Аккаунт с такими данными не найден"],
            };
          } else this.hideAuthModal();
        }
      }
    },
    hasServerError(field) {
      return field && this.serverErrors[field];
    },
  },
  validations: {
    username: {
      required,
      minLength: minLength(5),
      serverFailed: function () {
        return !this.hasServerError("username");
      },
    },
    email: {
      async required() {
        return this.mode === 1 ? this.email : true;
      },
      email,
      serverFailed: function () {
        return !this.hasServerError("email");
      },
    },
    password: {
      required,
      minLength: 8,
      maxLength: 20,
      serverFailed: function () {
        return !this.hasServerError("password");
      },
    },
    password2: {
      async sameAsPassword() {
        return this.mode === 1 ? this.password === this.password2 : true;
      },
    },
  },
};
</script>