import Axios from 'axios';
import config from '../config';

const API_URL = config.apiUrl + "messages/";


export const findMessages = (token, conversationId, page) => {
    return Axios.get(API_URL + conversationId + "?page=" + page, {
        headers: {
            "x-auth-token": token
        }
    });
}

export const createMessage = (token, data) => {
    return Axios.post(API_URL, data, {
        headers: {
            "x-auth-token": token
        }
    });
}