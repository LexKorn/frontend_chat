import React, {useState, useEffect} from 'react';
import {Button, Form, Container, ListGroup, Card} from 'react-bootstrap';
import {Helmet} from "react-helmet";
import {v4} from 'uuid';
import {Fade} from 'react-awesome-reveal';

import { IUser, IMessage } from '../../types/types';

import './userPage.sass';

interface UserPageProps {
    user: IUser;
};


const UserPage: React.FC<UserPageProps> = ({user}) => {
    const [selectedUser, setSelectedUser] = useState<IUser>({id: '', name: ''});
    const [message, setMessage] = useState<IMessage>({} as IMessage);    
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [receivedMessages, setReceivedMessages] = useState<IMessage[]>([]);
    const [text, setText] = useState<string>('');

    const localMessages = localStorage.getItem('messages');
    const localUsers = localStorage.getItem('users');
    const receivedUsers: IUser[] = (localUsers ? 
        JSON.parse(localUsers).filter((item: IUser) => item.name !== user.name)
    : []);

    useEffect(() => {
        if (message.text) {
            setMessages([...receivedMessages, message]);
        }          
    }, [message]); 

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('messages', JSON.stringify(messages));
        }         
    }, [messages]);

    const createMessage = () => {
        if (!text.trim()) {               
            return alert('Необходимо ввести текст');
        } else if (!selectedUser.name.trim()) {
            return alert('Необходимо выбрать собеседника');
        }

        setMessage({id: v4(), senderId: user.id, receiverId: selectedUser.id, text: text});
        setText('');      
        setReceivedMessages(localMessages ? JSON.parse(localMessages) : []);
    };

    const selectHandler = (item: IUser) => {
        setSelectedUser(item);
    };

    
    return (
        <Container>
            <Helmet>
                <title>{user.name}</title>
                <meta name="username" content="Имя пользователя" />
            </Helmet>

            <main>
                <div className="profile">
                    <h2 className="profile__title">Ваш профиль: <b>{user.name}</b></h2>

                    <Form className="profile__form">
                        <Form.Control as='textarea'
                            className="profile__input"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder={"Набирите сообщение"}
                        />       
                        <Button variant={"outline-success"} className="profile__btn" onClick={createMessage}>Отправить</Button>                 
                    </Form> 


                    {selectedUser.name && <h4 className="chat__title">Чат с {selectedUser.name}</h4>}                    
                    <ListGroup className="chat__list">
                        <Fade cascade duration={300} triggerOnce={true} direction={'down'}>
                            {messages && 
                                messages.filter(item => (item.senderId === user.id && item.receiverId === selectedUser.id) ||
                                (item.senderId === selectedUser.id && item.receiverId === user.id))
                                .map(item =>
                                    <Card 
                                        key={item.id} 
                                        className={item.receiverId !== selectedUser.id ? "chat__list_item shadow receiver" : "chat__list_item shadow"}
                                        >
                                        {item.text}
                                    </Card>
                            )}
                        </Fade>
                    </ListGroup>
                </div>


                <div className="users">
                    <h4 className="users__title">Доступные пользователи</h4>
                    <ListGroup className="users__list shadow">                        
                        {receivedUsers && receivedUsers.map(item =>
                            <ListGroup.Item 
                                key={item.id} 
                                className={item.id === selectedUser.id ? "users__list_item active" : "users__list_item"} 
                                onClick={() => selectHandler(item)}
                                >
                                {item.name}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </div>
            </main>
            
        </Container>
    );
};

export default UserPage;