import React, {useState, useEffect} from 'react';
import {Button, Form, Container, ListGroup} from 'react-bootstrap';
import {Helmet} from "react-helmet";
import {v4} from 'uuid';

import { IUser, IMessage } from '../../types/types';

import './userPage.sass';

interface UserPageProps {
    user: IUser;
};


const UserPage: React.FC<UserPageProps> = ({user}) => {
    const [selectedUser, setSelectedUser] = useState<IUser>({id: '', name: ''});
    const [message, setMessage] = useState<IMessage>({} as IMessage);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [text, setText] = useState<string>('');
    const [toggle, setToggle] = useState<boolean>(false);

    const localUsers = localStorage.getItem('users');
    const receivedUsers: IUser[] = (localUsers ? 
        JSON.parse(localUsers).filter((item: IUser) => item.name !== user.name)
    : []);

    const localMessages = localStorage.getItem('messages');
    const [receivedMessages, setReceivedMessages] = useState<IMessage[]>(localMessages ? JSON.parse(localMessages) : []);
    // const receivedMessages: IMessage[] = (localMessages ? JSON.parse(localMessages) : []);

    // const receivedUsers: IUser[] = [
    //     {id: '01', name: 'wqer'},
    //     {id: '02', name: 'adsgabg'},
    //     {id: '03', name: '16yhf'},
    //     {id: '04', name: 'onds3'},
    // ];

    // const receivedMessages: IMessage[] = [
    //     {id: '01', senderId: '01', receiverId: '02', text: 'wqer'},
    //     {id: '02', senderId: '01', receiverId: '02', text: 'adsgabg'},
    //     {id: '03', senderId: '02', receiverId: '01', text: '16yhf'},
    //     {id: '04', senderId: '01', receiverId: '03', text: 'onds3'},
    // ];
      
    // useEffect(() => {
    //     localStorage.setItem('message', JSON.stringify(message));
    // }, [toggle]);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
        setReceivedMessages(messages);
    }, [toggle]);

    useEffect(() => {
        if (message.text) {
            setMessages(messages => [...messages, message]);
            setToggle(!toggle); 
        }        
    }, [message]);   

    const selectHandler = (item: IUser) => {
        setSelectedUser(item);
    };

    const createMessage = () => {
        if (!text.trim()) {               
            return alert('Необходимо ввести текст');
        } else if (!selectedUser.name.trim()) {
            return alert('Необходимо выбрать собеседника');
        }

        setMessage({id: v4(), senderId: user.id, receiverId: selectedUser.id, text: text});
        setText('');
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
                        <Button variant={"outline-dark"} className="profile__btn" onClick={createMessage}>Отправить</Button>                 
                    </Form> 


                    {selectedUser.name && <h4 className="chat__title">Чат с {selectedUser.name}</h4>}                    
                    <ListGroup className="chat__list">
                        {/* {receivedMessages && receivedMessages.map(item => */}
                        {receivedMessages && 
                            receivedMessages.filter(item => (item.senderId === user.id && item.receiverId === selectedUser.id) ||
                            (item.senderId === selectedUser.id && item.receiverId === user.id))
                            .map(item =>
                                <ListGroup.Item 
                                    key={item.id} 
                                    className="chat__list_item" 
                                    >
                                    {item.text}
                                </ListGroup.Item>
                        )}
                    </ListGroup>
                </div>


                <div className="users">
                    <h4 className="users__title">Доступные пользователи</h4>
                    <ListGroup className="users__list shadow">
                        {receivedUsers && receivedUsers.map(item =>
                            <ListGroup.Item 
                                key={item.id} 
                                className="users__list_item" 
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