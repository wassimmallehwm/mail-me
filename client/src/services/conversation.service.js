import Axios from 'axios';
import config from '../config';

const API_URL = config.apiUrl + "conversations/";


export const findConversations = (token, userId) => {
    return Axios.get(API_URL + userId, {
        headers: {
            "x-auth-token": token
        }
    });
}

export const createConversation = (token, data) => {
    return Axios.post(API_URL, data, {
        headers: {
            "x-auth-token": token
        }
    });
}