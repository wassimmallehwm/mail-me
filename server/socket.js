
const { Server } = require("socket.io");
const User = require("./models/user.model");
const { 
    addUser,
    usersList,
    sendMessage,
    receiveMessage
} = require('./utils/socketEvents')

const ioConfig = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    let users = []; 

    const newUser = (user, socketId) => {
        console.log("USER ADDED ")
        !users.some(elem => elem.user._id == user._id)
            && users.push({user, socketId});
    }
    
    const removeUser = (socketId) => {
        console.log("USER REMOVED ")
        users = users.filter(elem => elem.socketId !== socketId)
    }
    
    const findUser = (userId) => {
        return users.find(elem => elem.user._id == userId)
    }


    io.on('connect', (socket) => {
        socket.on(addUser, (userId) => {
            User.findById(userId).select('username firstname lastname imagePath').lean()
            .then(data => {
                data._id = data._id.toString();
                newUser(data, socket.id)
                console.log("USERS : ", users)
                io.emit(usersList, {users})
            })
        })

        socket.on(sendMessage, ({senderId, receiverId, text}) => {
            const receiver = findUser(receiverId);
            const sender = findUser(senderId);
            receiver && sender && io.to(receiver.socketId).emit(receiveMessage, {
                sender: sender.user,
                text
            })
            
        })


        socket.on('disconnect', () => {
            removeUser(socket.id)
            io.emit(usersList, {users})
        })

        socket.on('connect_error', function(e){
            console.log("Socket connection error");
         });
    })
}

module.exports = ioConfig;