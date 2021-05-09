import Axios from 'axios';
import config from '../config';

const API_URL = config.apiUrl + "settings/";


export const findSettings = () => {
    return Axios.get(API_URL);
}

export const updateSettings = (token, data) => {
    return Axios.post(API_URL + 'update', data, {
        headers: {
            "x-auth-token": token
        }
    });
}
