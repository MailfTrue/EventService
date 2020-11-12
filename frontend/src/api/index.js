import axios from "axios";

const apiService = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  transformRequest: [
    (data, headers) => {
      const jwtAccess = localStorage.getItem("jwt_access");
      if (jwtAccess) headers["Authorization"] = `Bearer ${jwtAccess}`;
      headers["Content-Type"] = "application/json";
      return JSON.stringify(data);
    },
  ],
});

export default apiService;
