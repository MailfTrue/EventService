import apiService from "./index";

async function list() {
  const resp = await apiService.get("events/");
  return resp.data;
}

async function create(data) {
  const resp = await apiService.post("events/", data);
  return resp.data;
}

async function del(idx) {
  const resp = await apiService.delete(`events/${idx}/`);
  return resp.data;
}

async function update(idx, data) {
  const resp = await apiService.patch(`events/${idx}/`, data);
  return resp.data;
}

export default {
  list,
  create,
  del,
  update,
};
