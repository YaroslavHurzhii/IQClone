const Right = document.getElementById('Right');
const Left = document.getElementById("Left");
const Middle = document.getElementById("Middle");
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





const handleSubmit = (id) => {
    fetch('https://localhost:7098/room/'+id, {
        method: 'GET',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            messages = data[0].messages;
            users = data[0].users;
            while (Left.firstChild) {
                Left.removeChild(Left.firstChild);
            }
            console.log(messages);
            for (let i = 0; i < messages.length; i++) {
                let div = document.createElement('div');
                div.id = messages[i].id;
                div.textContent = messages[i].sender + "(" + messages[i].timestamp + "): " + messages[i].content;
                Left.appendChild(div);
            }
            while(Middle.firstChild) {
                Middle.removeChild(Middle.firstChild);
            }
            for (let i = 0; i < users.length; i++) {
                let div = document.createElement('div');
                div.id = users[i].id;
                div.textContent = users[i].name;
                Middle.appendChild(div);
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
};