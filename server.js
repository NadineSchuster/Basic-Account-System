"use strict";

let express = require("express");
let server = express();
const socketIo = require("socket.io");
const bodyParser = require('body-parser');
const http = require("http");
const cors = require('cors');
require("dotenv").config();

// Middleware
server.use(express.static("public"));
server.use(cors());
// const verify = require('./routes/verifyToken');
server.use(bodyParser.json());

const authenticateToken = require('./routes/verifyToken');

let port = 3000;

let httpServer = http.createServer(server);
let io = socketIo(httpServer);
const authRoute = require("./routes/auth");
const { nextTick } = require("process");
server.use('/users', authRoute);


let posts = [{
    name: "Sascha",
    post: "This post is from Sascha"
}, {
    name: "Julia",
    post: "This is Julias post"
},{
    name: "Coleen",
    post: "This post is from Coleen"
}]

// server.get("/posts", verify, (req, res) => {
//     res.json({
//         posts: {
//             title: "my first post",
//             description: "random data you shouldnt accesss"
//         }
//     });
// });

server.get("/posts", authenticateToken, (req, res) => {
    // filter posts by name
    res.json(posts[0]);
});

let newConnection = function (socket) {
    console.log("new connection " + socket.id);

    // let useDishwasher = function (RoomMates, adjustments) {
    //     addToDataBase(RoomMates);
    //     io.sockets.emit("createHistory", adjustments);
    //     io.sockets.emit("updateHighscore", RoomMates);
    // }

    // socket.on("dishwasher", useDishwasher);
}
// Open for cennections
io.on("connect", newConnection);

httpServer.listen(port, err => console.log(err || "Server is up and running..."));