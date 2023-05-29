import React, { useState,useEffect } from 'react';
import PopupLogin from './Page/Components/PopupLogin'
import Main from './Page/Main'

const App = () => {
    const [displaypopup, setdisplaypopup] = useState(true);
    const [ChatData, setChatData] = useState({
        id: "",
        password: "",
        title: "",
        messages: [],
        users:[]
    });
    const [Currentuser, setCurrentUser] = useState("");
    const [connection, setConnection] = useState();
    useEffect(() => { console.log(ChatData) }, [ChatData])
    return (
        <>
            {displaypopup && <PopupLogin setConnection={setConnection} setCurrentUser={setCurrentUser} setdisplaypopup={setdisplaypopup} setChatData={setChatData} />}
            {!displaypopup && <Main ChatData={ChatData} setChatData={setChatData} CurrentUser={Currentuser} connection={connection} />}
        </>
    )
}
export default App
