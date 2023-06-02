import React, { useState } from 'react';
import PopupLogin from './Page/Components/PopupLogin'
import Main from './Page/Main'

const App = () => {
    const [displaypopup, setdisplaypopup] = useState(true);
    let [messages, setMessages] = useState("");
    let [users, setUsers] = useState("");
    const [Title, setTitle] = useState("");
    const [Currentuser, setCurrentUser] = useState("");
    const [connection, setConnection] = useState();
    return (
        <>
            {displaypopup && <PopupLogin setConnection={setConnection} setCurrentUser={setCurrentUser} setdisplaypopup={setdisplaypopup} setMessages={setMessages} setUsers={setUsers} setTitle={setTitle} />}
            {!displaypopup && <Main Title={Title} setMessages={setMessages} setUsers={setUsers} messages={messages} users={users} CurrentUser={Currentuser} connection={connection} />}
        </>
    )
}
export default App
