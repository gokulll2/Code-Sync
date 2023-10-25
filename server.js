const express = require("express");
const app = express();
const pathh = require('path');
const http = require('http');
const {Server} = require('socket.io');
const ACTIONS = require("./src/Actions");
// const path = require("path");

const server = http.createServer(app);
const io = new Server(server);
    
app.use(express.static('build'));

app.use((req,res,next) =>{
   res.sendFile(pathh.join(__dirname , 'build' , 'index.html'))
})
const userSocketMap = {};

function getAllClients(roomId)
{
   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) =>{
            // console.log(io);
        return {
            socketId,
            username:userSocketMap[socketId],
        };
    });
}

io.on('connection' , (socket)=>{
    console.log('socket connected',socket.id);

    //Logic of joining
    
    socket.on(ACTIONS.JOIN , ({roomId , username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllClients(roomId);
        clients.forEach(({ socketId }) =>{
            io.to(socketId).emit(ACTIONS.JOINED , {
                clients,
                username,
                socketId:socket.id,
            }); 
        });
    });

    socket.on(ACTIONS.CODE_CHANGE,({ roomId , code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE , { code });
    });

    socket.on(ACTIONS.SYNC_CODE,({ socketId , code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE , { code });
    });

    socket.on('disconnecting' , ()=>{
        const rooms  = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId:socket.id,
                username : userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })
});

const PORT = process.env.PORT || 8000;
server.listen(PORT , () =>{
    console.log(`Listening on port${PORT}`);
})