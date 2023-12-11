const express=require('express');
const PORT=3000||process.env.PORT;
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users')



const app=express();
const server=http.createServer(app);
const io=socketio(server);


// Setting static folder
app.use(express.static(path.join(__dirname,'public')));


const botname='chitchat Bot';


// Run when a client connects
io.on('connection',socket=>{
    socket.on('joinroom',({username,room})=>{
        const user=userJoin(socket.id,username,room)
        socket.join(user.room);


// welcome new user
socket.emit('message',formatMessage(botname,'welcome to chitchat!'))

// Brodcast when user connects
socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joined chat`));
// send user and info
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
})

    });
// console.log('New web socket connection');



// listen chat message
socket.on('chatMessage',msg=>{

    const user=getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,msg));
});

// Runs when client disconnect
socket.on('disconnect',()=>{
    const user=userLeave(socket.id)
    if(user){

        io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`));
        io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
})
    }

});

});


server.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})



