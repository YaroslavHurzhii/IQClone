import React, { useEffect, useState } from 'react';
import "./PopupLogin.scss"
import { HubConnectionBuilder } from "@microsoft/signalr"
import Loading from './Loading';

function PopupLogin({ setConnection, setCurrentUser, setdisplaypopup, setChatData }) {
    const [modalData, setModalData] = useState({
        RoomName:"",Password:"",UserName:""
    })

    const [loading, setLoading] = useState(false)
    const [modalType, setModalType] = useState("Create")
    const [error, seterror] = useState(null)
    useEffect(() => {
        console.log(error)
    },[error])
    const JoinRoom = async () => {
        setLoading(true)
        const connec = new HubConnectionBuilder()
            .withUrl("https://localhost:7098/chat")
            .build();

        
        connec.on("JoinR", (userdata) => {
            setCurrentUser(modalData.UserName);
            setChatData(userdata[0]);
            setdisplaypopup(false);
        });
        connec.on("setupError", (er) => {
            setLoading(false)
            seterror(er);
        });
        await connec.start();
        await connec.invoke(modalType + "Room", modalData);
        setConnection(connec);
        setLoading(false)
    }


    
    function disbutton() {
        return (modalData.RoomName === "" || modalData.UserName === "")
    }
 
    return (
        <>{loading && <Loading></Loading>}
            <div className="modalWrapper">
                <div className="Buttons">
                    <button className={`btn ${modalType === "Create" ? "active" : ""}`} style={{ borderRadius: "15px 0px 0px 0px" }} onClick={() => { setModalType("Create") }}>Create</button>
                    <button className={`btn ${modalType === "Join" ? "active" : ""}`} style={{ borderRadius: "0px 15px 0px 0px" }} onClick={() => { setModalType("Join") }}>Sing in</button>
                </div>
                <div className="modalContainer">
                    {error ? <div className="ErrorMessage">{error}</div>:null }
                    <p>Room name:</p>
                    <input value={modalData.RoomName} onChange={(e) => { setModalData({ ...modalData, RoomName: e.target.value }) }} type="text"></input>
                    <p>Password:</p>
                    <input value={modalData.Password} onChange={(e) => { setModalData({ ...modalData, Password: e.target.value }) }} type="password"></input>
                    <p>Username:</p>
                    <input value={modalData.UserName} onChange={(e) => { setModalData({ ...modalData, UserName: e.target.value }) }} type="text"></input>
                    {disbutton()
                        ? <button className="readyButton" disabled onClick={() => { JoinRoom() }}>Ready</button>
                        : <button className="readyButton" onClick={() => { JoinRoom() }}>Ready</button>}
                </div>
            </div>
        </>
    );
}

export default PopupLogin;