// package imports
require("dotenv").config();
const Sequelize = require("sequelize");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./database/db");
const socket = require("socket.io");
const { AddChat } = require("./controllers/conversation");

const apiRoute = require("./routes/apiRoute");
const urlRoute = require("./routes/urlRoute");

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const dbMergeScript = require("./db_merge_scripts/merge_dbs");
const dbMigrationScript = require("./db_merge_scripts/migrate_dbs");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Elfrique Api",
      version: "1.0.0",
      description: "Elfrique's server",
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

/*const parse = require('url-parse')
const baseUrl = process.env.BASEURL;

var addr = new parse(baseUrl);
console.(addr.host);*/

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// routes includes

// imports initalization

const server = http.createServer(app);
let users = [];

// middlewares

app.use("/images", express.static("images"));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(morgan("tiny"));
// routes

app.get("/api/v1/merge", dbMergeScript.merge);
app.get("/api/v1/merge/:id", dbMergeScript.merge_one);
app.get("/api/v1/migrate", dbMigrationScript);
app.use("/api/v1", apiRoute);
app.use("/", urlRoute);

/* app.get("/", (req, res, next) => {
  res.render("signup2");
}); */
/*app.use(function (req, res) {
  res.status(404).render("base/404");
});*/

db.authenticate()
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => console.log("Unable to connect to Database ", err));

db.sync();

// 404 not found

// server
//
//
//

const io = socket(server, {
  cors: {
    origin: "process.env.FRONT_URL", //URL to the front-end
  },
});

// const addUser = ( userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({userId, socketId});
// };

io.on("connection", (socket) => {
  console.log("a user connected.");

  //frontend
  //socket.current.emit("addUser", user.id);

  // useEffect(() => {
  //   socket.current.emit("addUser", user.id);
  // }, [user])

  // socket.on("addUser", (userId) => {
  //   addUser(userId, socket.id);
  // })

  //socket.current.emit("joined", user.id )

  socket.on("joined", (id) => {
    console.log(`the user id is ${id}`);
    users[id] = socket.id;
    console.log(users);
  });

  // socket.current.emit("chatMessage", content)

  // const content ={
  //   senderId: "",
  //   receiverId: "",
  //   msg: "",
  // }

  socket.on("chatMessage", (content) => {
    console.log(content);
    AddChat(content.senderId, content.receiverId, content.msg).then((data) => {
      //console.log(`the return value is ${data}`);
      let senderSocketId = users[content.senderId];
      let receiverSocketId = users[content.receiverId];

      // send back the messages to myself
      io.to(senderSocketId).emit("my_message", data);

      // send the message to the receiver
      console.log(`i am sending from ${senderSocketId} to ${receiverSocketId}`);
      io.to(receiverSocketId).emit("incoming_message", data);
    });
  });

  socket.on("disconnect", () => {
    console.log(
      `A user has disconnected from the socket with id of ${socket.id}`
    );
    //io.emit("message", socketHelpers.formatMessage("admin", "User has left the site"));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
