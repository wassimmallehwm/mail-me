import Axios from 'axios';

const API_URL = "http://localhost:4000/"; //"https://limitless-meadow-15715.herokuapp.com/"; //"https://f5cc679aee1c.ngrok.io/";


export const interceptToken = (callback, logout) => {
  Axios.interceptors.response.use(null, (error) => {
    if (
      error.config &&
      error.response?.status === 401 &&
      error.response?.data?.msg === "token_expired" &&
      !error.config.__isRetry
    ) {
      return new Promise((resolve, reject) => {
        refreshToken(error.config, callback, logout)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
    return Promise.reject(error);
  });
}

const refreshToken = (config, callback, logout) => {
  return new Promise((resolve, reject) => {
    refresh(config.headers["x-auth-token"]) // Endpoint to request new token
      .then((res) => {
        config.headers["x-auth-token"] = callback(res.data);
        Axios
          .request(config) // Repeat the initial request
          .then((result) => {
            return resolve(result);
          })
          .catch((err) => {
            console.log(err);
            return reject(err);
          });
      })
      .catch((err) => {
        console.log(err);
        logout();
      });
  });
};

export const createOrUpdateAccount = (token, mode, data) => {
  const URL = mode == "add" ? API_URL + "accounts/create" : API_URL + "accounts/update";
  return Axios.post(URL, data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const accountsList = (token) => {
  return Axios.post(API_URL + "accounts/", null, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const deleteUserAccount = (token, data) => {
  return Axios.post(API_URL + "accounts/remove", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const sendMail = (data) => {
  return Axios.post(API_URL + "mails/send", data);
}

export const mailsList = (token) => {
  return Axios.post(API_URL + "mails/", null, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const mailById = (mailId, token) => {
  return Axios.post(API_URL + "mails/" + mailId, null, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const uploadUserImage = (token, data) => {
  return Axios.post(API_URL + "users/upload", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const updateUser = (token, data) => {
  return Axios.post(API_URL + "users/update", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const changeUserPassword = (token, data) => {
  return Axios.post(API_URL + "users/change-password", data, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const register = (data) => {
  return Axios.post(API_URL + "users/register", data);
}

export const login = (data) => {
  return Axios.post(API_URL + "users/login", data);
}

export const refresh = (token) => {
  return Axios.post(API_URL + "users/refresh", null, {
    headers: {
      "x-auth-token": token
    }
  });
}

export const formSubmit = (token, {submitConfigMethod, submitConfigUrl}, data) => {
  return Axios({
    method: submitConfigMethod,
    url: submitConfigUrl,
    data,
    headers: {'x-auth-token': token}
  });
}