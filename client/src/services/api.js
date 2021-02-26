import Axios from 'axios';
import config from '../config';

const API_URL = config.apiUrl; 


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



export const formSubmit = (token, {submitConfigMethod, submitConfigUrl}, data) => {
  return Axios({
    method: submitConfigMethod,
    url: submitConfigUrl,
    data,
    headers: {'x-auth-token': token}
  });
}