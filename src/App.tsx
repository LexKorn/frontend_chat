import React, {useState, useEffect} from 'react';
import {Helmet} from "react-helmet";
import {Button, Form, Container} from 'react-bootstrap';
import {v4} from 'uuid';

import UserPage from './components/UserPage/UserPage';
import { IUser } from './types/types';

import './app.sass';


function App() {
    const [user, setUser] = useState<IUser>({} as IUser);   
    const local = localStorage.getItem('users');
    const [users, setUsers] = useState<IUser[]>(local ? JSON.parse(local) : []);
    const [value, setValue] = useState<string>('');
    const [toggle, setToggle] = useState<boolean>(false);

    useEffect(() => {
        sessionStorage.setItem('user', JSON.stringify(user));
        if (user.name) {
            setUsers(users => [...users, user]);
        }  
    }, [user]);
    
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    const createUser = () => {
        if (!value.trim()) {               
            return alert('Имя необходимо заполнить');
        }
        setUser({id: v4(), name: value});   
        setToggle(true);   
    };

    const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            createUser();
        }
    };

    return (
        <Container>
            <Helmet>
                <title>{toggle ? user.name : 'Chat for lonely people'}</title>
                <meta name="username" content="Имя пользователя" />
            </Helmet>

            {toggle ? <UserPage user={user} /> : 
                <div className='entrance'>
                    <h1 className='entrance__title'>Добро пожаловать в чат для одиноких людей</h1>
                    <Form className="entrance__form">
                        <Form.Control
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className='entrance__input'
                            // @ts-ignore
                            onKeyPress={e => keyPress(e)}
                            placeholder={"Введите ваше имя"}
                        />
                        <Button variant={"outline-success"} onClick={createUser}>Присоединиться</Button>
                    </Form> 
                </div>
            }
        </Container>
    );
}

export default App;