import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Icon, Input } from 'semantic-ui-react'
import { AuthContext } from '../../../context/auth'
import { createAndFindConversation, createConversation, findConversations } from '../../../services/conversation.service'
import { createMessage, findMessages } from '../../../services/message.service';
import { Toast } from '../../../utils/toast';
import socketEvents from '../../../utils/socketEvents';
import Conversation from './conversations/Conversation'
import Message from './message/Message'
import './messenger.css'
import notifAudio from '../../../assets/notif.mp3';
import Tooltip from '../../Tooltip';
import { SocketContext } from '../../../context/socket';
import { searchUser } from '../../../services/users.service';
import UserItem from './userItem/UserItem';

const Messenger = ({ location }) => {
    const { user } = useContext(AuthContext)
    const socket = useContext(SocketContext)

    const scrollRef = useRef();

    let audio = new Audio(notifAudio)

    const initPAgination = {
        limit: 0,
        page: 1,
        pages: 0,
        total: 0,
    };

    const [conversations, setConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesPaginate, setMessagesPaginate] = useState(initPAgination);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [scrollToBottom, setScrollToBottom] = useState(true);
    const [visibleFriendsList, setVisibleFriendsList] = useState(true);
    const [usersSearchQuery, setUsersSearchQuery] = useState("");
    const [usersList, setUsersList] = useState(null);

    const findConvs = () => {
        user && findConversations(user.token, user._id).then(
            res => {
                setConversations(res.data)
            },
            error => {
                Toast('ERROR', 'Could not load conversations');
            }
        )
    }

    const findUsers = (e) => {
        setUsersSearchQuery(e.target.value)
        if(e.target.value.trim() != ""){
            searchUser(user.token, e.target.value).then(
                res => {
                    setUsersList(res.data)
                },
                error => {
                    console.log(error)
                    Toast('ERROR', 'Could not load users');
                }
            )
        } else {
            setUsersList(null)
        }
    }

    const createChat = (data) => {
        createAndFindConversation(user.token, {
            senderId: user._id,
            receiverId: data
        }).then(
            res => {
                if(res.data.created){
                    setConversations(prev => [...prev, res.data.conversation])
                    setCurrentChat(res.data.conversation)
                } else {
                    setCurrentChat(res.data.conversation)
                }
                setUsersSearchQuery("")
                setUsersList(null)
            },
            error => {
                console.log(error)
                Toast('ERROR', 'Could not load users');
            }
        )
    }

    const findCurrentChatMessages = (page, newConversation) => {
        user && currentChat &&
            findMessages(user.token, currentChat._id, page).then(
                res => {
                    newConversation ?
                        setMessages(res.data.docs.reverse()) 
                        : setMessages(prev => res.data.docs.reverse().concat(prev))
                    const { limit, page, pages, total } = res.data;
                    setMessagesPaginate({ limit, page, pages, total })
                },
                error => {
                    Toast('ERROR', 'Could not load messages');
                }
            )
    }

    const createNewMeesage = (message) => {
        user && currentChat &&
            createMessage(user.token, message).then(
                res => {
                    setNewMessage("");
                    setMessages(prev => [...prev, res.data])
                },
                error => {
                    Toast('ERROR', 'Could not load messages');
                }
            )
    }

    useEffect(() => {
        findConvs()
        socket.connect()
        socket.on(socketEvents.connect, () => {
            socket.emit(socketEvents.addUser, user._id);
        })
        socket.on(socketEvents.receiveMessage, ({ sender, text }) => {
            audio.play().then(
                () => {
                }, error => {
                    console.warn("AUDIO ERROR : ", error)
                }
            )
            setArrivalMessage({
                sender,
                text,
                createdAt: Date.now()
            })
        })
        return () => {
            socket.off(socketEvents.connect);
            socket.off(socketEvents.receiveMessage);
            socket.disconnect();
        };
    }, [])

    useEffect(() => {
        const senderId = currentChat?.members.find(member => member._id != user._id)._id
        arrivalMessage && arrivalMessage.sender._id == senderId
            && setMessages(prev => [...prev, arrivalMessage]) && scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.on(socketEvents.connectionError, (error) => {
            console.log("Connection error : ", error.message)
            socket.connect();
        });
        socket.on(socketEvents.connectionFailed, (error) => {
            console.log("Connection failed : ", error.message)
            socket.connect();
        });
        socket.emit(socketEvents.addUser, user._id);
        socket.on(socketEvents.usersList, ({ users }) => {
            setOnlineUsers(users.filter(elem => elem.user._id != user._id))
        })

        return () => {
            socket.off(socketEvents.connectionError);
            socket.off(socketEvents.connectionFailed);
            socket.off(socketEvents.usersList);
            socket.disconnect();
        };
    }, [user, socket])

    useEffect(() => {
        setMessagesPaginate(initPAgination)
        findCurrentChatMessages(1, true)
        setVisibleFriendsList(false)
    }, [currentChat])

    useEffect(() => {
        if(scrollToBottom){
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        } else {
            setScrollToBottom(true)
        }
    }, [messages]) //arrivalMessage, currentChat

    const handleSubmit = (e) => {
        e.preventDefault();
        if(newMessage.trim() != "") {
            const message = {
                sender: user._id,
                text: newMessage,
                conversation: currentChat._id
            }
            const receiverId = currentChat.members.find(member => member._id != user._id)._id
            socket.emit(socketEvents.sendMessage, {
                senderId: user._id,
                receiverId,
                text: newMessage,
            })
            createNewMeesage(message)
        }
    }


    return (
        <>
            <div className="messenger">
                <div className="chatBox">
                    <div className="wrapper chatBoxWrapper">
                        {
                            currentChat ?
                                (
                                    <>
                                        <div className="chatBoxTop">
                                            {
                                                messagesPaginate.page < messagesPaginate.pages &&
                                                (
                                                    <Tooltip content="Load more">
                                                        <Button icon="redo" className="load-more" onClick={
                                                            () => { 
                                                                setScrollToBottom(false);
                                                                findCurrentChatMessages(messagesPaginate.page + 1, false) 
                                                            }
                                                        } />
                                                    </Tooltip>
                                                )
                                            }
                                            {
                                                messages.length > 0 ?
                                                messages.map((msg, i, array) => (
                                                    <div key={i} ref={scrollRef}>
                                                        <Message message={msg} nextMessage={array[i + 1]}
                                                            own={msg.sender._id == user._id} />
                                                    </div>
                                                )) :
                                                (
                                                    <span className="empty-msg">
                                                        Say hello.
                                                    </span>
                                                )
                                            }
                                        </div>
                                        <div className="chatBoxBottom">
                                            <Form style={{width: '95%', margin: 'auto'}} onSubmit={handleSubmit}>
                                            <Form.Group inline>
                                                <Form.Input
                                                    className="chatMessageInput"
                                                    placeholder="write something ..."
                                                    value={newMessage}
                                                    onChange={e => setNewMessage(e.target.value)}
                                                />
                                                <Form.Button content="Send" className="chatSubmitBtn"/>
                                            </Form.Group>
                                            </Form>
                                        </div>
                                    </>
                                ) :
                                (
                                    <span className="noConversationText">
                                        Open a conversation to start a chat.
                                    </span>
                                )
                        }

                    </div>
                </div>
                    <Button size="medium" className={visibleFriendsList ? "friends-btn right" : "friends-btn"} 
                    onClick={() => setVisibleFriendsList(prev => !prev)} >
                    <Icon style={{margin: 'auto'}} name={visibleFriendsList ? 'arrow right' : 'arrow left'}/>
                    </Button>

                        {/* {!visibleFriendsList == true && (<Icon name='angle left'/>)}
                        
                        {visibleFriendsList && (<Icon name='angle right'/>)}
                    </Button> */}
                <div className={visibleFriendsList ? "chatMenu" : "chatMenu invisible"}  >
                    <div className="wrapper chatMenuWrapper">
                        <Input placeholder="Search for friends" 
                        className="chatMenuInput" value={usersSearchQuery} onChange={findUsers}
                        />
                         
                        {
                            usersList ? 
                                usersList.length > 0 ?
                                    usersList.map(val =>
                                        <div onClick={() => { createChat(val._id) }} key={val._id}>
                                            <UserItem user={val} online={onlineUsers} />
                                        </div>
                                    ) : 
                                (<h1>User not found</h1>) 
                                :
                            conversations.length > 0 &&
                            conversations.map(conv =>
                                <div onClick={() => { setCurrentChat(conv) }} key={conv._id}>
                                    <Conversation conversation={conv} online={onlineUsers} currentUserId={user._id} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger
