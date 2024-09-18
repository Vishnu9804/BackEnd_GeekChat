const express = require("express");
const port = 3000;
const port1 = 3001;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./db");
require("./models/User");
require("./models/Message");
const authRoutes = require("./routes/authRoutes");
const uploadMediaRoutes = require("./routes/uploadMediaRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpSrver = createServer(app);
const io = new Server(httpSrver, {});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(uploadMediaRoutes);
app.use(messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User Connected :- ", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected :- ", socket.id);
  });

  socket.on("join_room", (data) => {
    console.log("User With Id :- ", socket.id, "Join Room :- ", data.roomid);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("Message Recived :- ", data);
    io.emit("receive_message", data);
  });
});

httpSrver.listen(port1, () => {
  console.log("Socketio Server is running on post " + port1);
});

app.listen(port, () => {
  console.log("Server is running on post " + port);
});
