import Axios from 'axios';
import config from '../config';

const API_URL = config.apiUrl + "requests/";


export const findAll = (token) => {
    return Axios.post(API_URL, null, {
        headers: {
            "x-auth-token": token
        }
    });
}

export const remove = (token, id) => {
    return Axios.post(API_URL + 'remove/' + id, null, {
        headers: {
            "x-auth-token": token
        }
    });
}

export const validate = (token, id) => {
    return Axios.post(API_URL + 'validate/' + id, null, {
        headers: {
            "x-auth-token": token
        }
    });
}

export const count = (token) => {
    return Axios.post(API_URL + 'count', null, {
        headers: {
            "x-auth-token": token
        }
    });
}