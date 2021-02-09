import Axios from 'axios';
import config from '../config';

const API_URL = config.apiUrl + "roles";


export const findAll = (token) => {
  return Axios.post(API_URL + "/findAll", null, {
    headers: {
      "x-auth-token": token
    }
  });
}