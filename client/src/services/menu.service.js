import Axios from 'axios';

const API_URL = "http://localhost:4000/menus";


export const createOrUpdate = (token, mode, data) => {
  const URL = mode == "add" ? "/create" : "/update";
  return Axios.post(API_URL + URL, data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const submitConfig = (token, data) => {
  return Axios.post(API_URL + "/submitConfig", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const update = (token, data) => {
  return Axios.post(API_URL + "/update", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const findAllByRole = (token, data) => {
  return Axios.post(API_URL + "/findAllByRole", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const findAllGuest = (token) => {
  return Axios.post(API_URL + "/findAllGuest", null, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const findAllArtificial = (token) => {
  return Axios.post(API_URL + "/findAllArtificial", null, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const setMenuForm = (token, data) => {
  return Axios.post(API_URL + "/setForm", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const getMenuForm = (token, data) => {
  return Axios.post(API_URL + "/getForm", data, {
    headers: {
      "x-auth-token": token
    }
  });
}