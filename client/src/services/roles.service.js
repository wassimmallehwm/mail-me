import Axios from 'axios';

const API_URL = "http://localhost:4000/roles";


export const findAll = (token) => {
  return Axios.post(API_URL + "/findAll", null, {
    headers: {
      "x-auth-token": token
    }
  });
}