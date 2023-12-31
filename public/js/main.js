const chatForm=document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages')
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

// Get username and room from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true,
})
// console.log(username,room);

const socket=io();

//Join ChatRoom
socket.emit('joinroom',{
    username,
    room
})
//Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);   
})


//Message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit',e=>{
    e.preventDefault();

    // get message text
    const msg=e.target.elements.msg.value;


    // emitting msg to server
    socket.emit('chatMessage',msg);

    //Clear Input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus='';
})

// O/P message to DOM
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">
    ${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room
function outputRoomName(room){
roomName.innerText=room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}