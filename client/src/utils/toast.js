import { toast } from 'react-toastify';

const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const Toast = (type, message) => {
    switch(type){
        case "SUCCESS" : 
            toast.success(message, toastConfig)
            break;
        case "INFO" : 
            toast.info(message, toastConfig)
            break;
        case "ERROR" : 
            toast.error(message, toastConfig)
            break;
        default : 
            console.log("TOAST undefined !");
    }
}