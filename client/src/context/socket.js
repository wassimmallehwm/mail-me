import React from 'react';
import { io } from 'socket.io-client';
import config from '../config';

export const socket = io(
    config.socketUrl, {
    transports: ['websocket'],
    secure: true,
    reconnection: true,
    rejectUnauthorized: false,
    reconnectionDelay: 500,
    reconnectionAttempts: 10
})

export const SocketContext = React.createContext();

export const SocketProvider = ({children}) => {

    return ( 
        <SocketContext.Provider value={socket} >
            { children }
        </SocketContext.Provider>
     );
}