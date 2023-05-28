import React, { useEffect, useState,useRef } from 'react';
import "./Main.scss"

const Main = ({ ChatData, setChatData, CurrentUser, connection }) => {
    const [Message, setMessage] = useState("")
    const scrollRef = useRef()
    const SendMessage = async () => {
        if (Message.length > 0) {
            await connection.invoke("SendMessage", { RoomName: ChatData.title, Message, UserName: CurrentUser });
            setMessage('');
        }
    }
    useEffect(() => {
        if (connection) {
            connection.on("ReciveMessage", (mesdata) => {
                console.log(mesdata);
                console.log(ChatData);
                setChatData({ ...ChatData, messages: [...ChatData.messages, mesdata] });
            });
            connection.on("NewUser", (UserName) => {
                console.log(UserName);
                setChatData({ ...ChatData, users: [...ChatData.users, UserName] });
            });
        }
    }, [connection])
    
    useEffect(() => { scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [Message])
    useEffect(() => { console.log(ChatData.users) }, [ChatData.users])
    function ConvertTme(a) {
        const dateTime = new Date(a);
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return (
        <div className="ChatWrapper">
            <div className="ChatLeft">
            <p></p>
                <div className="MessageBox" ref={scrollRef}>

                    {ChatData.messages.length > 0
                        ? ChatData.messages.map((item) => {
                            if (item.sender === CurrentUser) {
                                return (<div key={item.id} className="MessegeItemUser">
                                    <p className="MessegeSender">{item.sender}</p>
                                    <p className="MessegeContent">{item.content}</p>
                                    <p className="MessegeTime">{ConvertTme(item.timestamp)}</p>
                                </div>)
                            }
                            else {
                                return (<div key={item.id} className="MessegeItem">
                                    <p className="MessegeSender">{item.sender}</p>
                                    <p className="MessegeContent">{item.content}</p>
                                    <p className="MessegeTime">{ConvertTme(item.timestamp)}</p>
                                </div>)
                            }
                        })
                        : <div></div>}
                </div>
                <div className="SendBox">
                    <input className="InputBox" onChange={(e) => { setMessage(e.target.value) }} value={Message }></input>
                    <button className="SendButton" onClick={() => { SendMessage() } }>Send</button >
                </div>
            </div>
            <div className="ChatRight">
                <div className="You">
                    <div>
                        <p>{CurrentUser}</p>
                        <button className="ExitBtn">Exit </button>
                    </div>
                </div>
                <div className="UserList">
                    {ChatData.users.length > 0
                        ? ChatData.users.map((item) =>
                            <div key={item.id} className="UserInList">
                                {item.name }
                            </div>)
                        : <div></div>}
                </div>
            </div >
        </div>

    )
}

export default Main