const Right = document.getElementById('inRight');
const Left = document.getElementById("inLeft");
const Middle = document.getElementById("inMiddle");
let messages = [];
let users = [];
let chats = [];


fetch('https://localhost:7098/rooms', {
    method: 'GET',
    headers: { "Accept": "application/json", "Content-Type": "application/json" },

})
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].id;
            const title = data[i].title;
            chats.push({ id, title });
            console.log(chats[i]);
            let div = document.createElement('div');
            div.id = chats[i].id;
            div.className = "chatInList";
            div.textContent = chats[i].title;
            div.addEventListener("click", () => {
                handleSubmit(div.textContent);
            })
            Right.appendChild(div);
        }
    })
    .catch((error) => {
        console.log(error.message);
    });

function ConvertTme(a) {
    const dateTime = new Date(a);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const handleSubmit = (id) => {
    fetch('https://localhost:7098/room/'+id, {
        method: 'GET',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            messages = data.messages;
            users = data.users;
            while (Left.firstChild) {
                Left.removeChild(Left.firstChild);
            }
            console.log(messages);
            for (let i = 0; i < messages.length; i++) {
                let div = document.createElement('div');
                div.id = messages[i].Id;
                div.className = "messageInList";
                div.textContent = messages[i].sender + "(" + ConvertTme(messages[i].time) + "): " + messages[i].content;
                Left.appendChild(div);
            }
            while(Middle.firstChild) {
                Middle.removeChild(Middle.firstChild);
            }
            for (let i = 0; i < users.length; i++) {
                let div = document.createElement('div');
                div.id = users[i].Id;
                div.className = "userInList";
                div.textContent = users[i].Name;
                Middle.appendChild(div);
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
};