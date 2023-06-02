import React, { useEffect, useState,useRef } from 'react';
import "./Main.scss"

const Main = ({ Title,setMessages, setUsers, messages, users, CurrentUser, connection }) => {
    const [Message, setMessage] = useState("")
    const scrollRef = useRef()
    const SendMessage = async () => {
        if (Message.length > 0) {
            await connection.invoke("SendMessage", { RoomName: Title, Message, UserName: CurrentUser });
            setMessage('');
        }
    }
    useEffect(() => {
        if (connection) {
            connection.on("ReciveMessage", (mesdata) => {
                setMessages(messages=>[...messages, JSON.parse(mesdata)]);
            });
            connection.on("NewUser", (UserName) => {
                setUsers(users => [...users, JSON.parse(UserName)]);
            });
        }
    }, [connection])
    useEffect(() => { console.log(users) }, [users])
    useEffect(() => { scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [Message])
    function ConvertTme(a) {
        const dateTime = new Date(a);
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return (
        <div className="ChatWrapper">
            <div className="ChatLeft">
                <p className="ChatTitle">{Title}</p>
                <div className="MessageBox" ref={scrollRef}>
                    {messages.length > 0
                        ? messages.map((item) => {
                            if (item.sender === CurrentUser) {
                                return (<div key={item.Id} className="MessegeItemUser">
                                    <p className="MessegeSender">{item.sender}</p>
                                    <p className="MessegeContent">{item.content}</p>
                                    <p className="MessegeTime">{ConvertTme(item.time)}</p>
                                </div>)
                            }
                            else {
                                return (<div key={item.Id} className="MessegeItem">
                                    <p className="MessegeSender">{item.sender}</p>
                                    <p className="MessegeContent">{item.content}</p>
                                    <p className="MessegeTime">{ConvertTme(item.time)}</p>
                                </div>)
                            }
                        })
                        : <div></div>}
                </div>
                <div className="SendBox">
                    <input className="InputBox" onChange={(e) => { setMessage(e.target.value) }} value={Message}></input>
                    <button className="SendButton" onClick={() => { SendMessage() } }>Send</button >
                </div>
            </div>
            <div className="ChatRight">
                <div className="You">
                    <div>
                        <p>{CurrentUser}</p>
                        <button className="ExitBtn" onClick={() => {window.location.reload() } }>Exit </button>
                    </div>
                </div>
                <p className="UsersLabel">Users:</p>
                <div className="UserList">
                    {users.length>0
                        ? users.map((item) =>
                            <div key={item.Id} className="UserInList">
                                {item.Name}
                            </div>)
                        : <div></div>}
                </div>
            </div >
        </div>

    )
}

export default Main