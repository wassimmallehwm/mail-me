import Axios from 'axios';


Axios.interceptors.response.use(null, (error) => {
	if (
		error.config &&
		error.response?.status === 401 && // Use the status code your server returns when token has expired
		!error.config.__isRetry
	) {
    // return new Promise((resolve, reject) => {
    //   refreshToken(axios, error.config)
    //     .then((result) => {
    //       resolve(result);
    //     })
    //     .catch((err) => {
    //       reject(err);
    //     });
    // });
	}
	return Promise.reject(error);
});

export const sendMail = (data) => {
    return Axios.post("http://localhost:4000/mails/send", data);
}

export const mailsList = (token) => {
    return Axios.post("http://localhost:4000/mails/", null,{
        headers: {
        "x-auth-token" : token
      }
    });
}

export const mailById = (mailId, token) => {
    return Axios.post("http://localhost:4000/mails/" + mailId, null,{
        headers: {
        "x-auth-token" : token
      }
    });
}

export const register = (data) => {
    return Axios.post("http://localhost:4000/users/register", data);
}

export const login = (data) => {
    return Axios.post("http://localhost:4000/users/login", data);
}

export const refresh = (token) => {
    return Axios.post("http://localhost:4000/users/refresh", null,{
        headers: {
        "x-auth-token" : token
      }
    });
}