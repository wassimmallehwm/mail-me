const socketEvents = {
    connect : "connect",
    disconnect : "disconnect",
    connectionError : "connect_error",
    connectionFailed : "connect_failed",
    addUser : "add_user",
    usersList : "users_list",
    sendMessage : "send_message",
    receiveMessage : "receive_message",
}

module.exports = socketEvents;