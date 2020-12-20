import { toast } from 'react-toastify';

export const Toast = (type, message) => {
    switch(type){
        case "SUCCESS" : 
            toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            break;
        case "ERROR" : 
            toast.error(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            break;
        default : 
            console.log("TOAST undefined !");

    }

    
}