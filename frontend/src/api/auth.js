import apiService from "./index";
import store from "../store";

async function login(username, password) {
  const data = { username, password };
  try {
    const res = await apiService.post("token/", data);
    store.dispatch("login", res.data);
    return res;
  } catch (error) {
    return error.response;
  }
}

async function refreshToken() {
  const refresh = localStorage.getItem("jwt_refresh");
  console.log("refresh", refresh, !!refresh);
  if (refresh !== undefined && refresh) {
    const res = await apiService.post("token/refresh/", {
      refresh,
    });
    store.dispatch("login", res.data);
  }
}

async function getCurrentUser() {
  const resp = await apiService.get("current-user/");
  return resp.data?.username ? resp.data : null;
}

async function register(email, username, password) {
  const data = { username, password, email };
  try {
    await apiService.post("register/", data);
    await login(username, password);
    return true;
  } catch (error) {
    return error.response.data;
  }
}

apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status !== 401) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    console.log("handle unauth error");
    if (
      error.config.url === "token/refresh/" &&
      error.response.data.code === "token_not_valid"
    ) {
      console.log("logout");
      store.dispatch("logout");
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    console.log("skip logout");

    return await refreshToken();
  }
);

export default {
  login,
  register,
  getCurrentUser,
};
