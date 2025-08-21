import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

const app = express();

//scocket io
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"]
  }
});


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

// stop the server running on port 8000
//sudo lsof -i :8000
//sudo kill -9 <PID>
//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

// github variables: username = junaidameer93 , password = V4bXy.F*=nh/R!_

//digital ocean 
// user = ssh root@134.209.100.144
// password: junaid@123Ameer

// Hostname : ubuntu-s-1vcpu-512mb-10gb-sgp1-01

app.use(express.json({limit :'5mb'}));
app.use(express.urlencoded({extended:true, limit:'5mb'}));
app.use(cookieParser())
app.use(express.static("public"));

//routes
import userRouter from './routes/user.routes.js';
import groupRouter from './routes/group.routes.js';
import expenseRouter from './routes/expense.routes.js';

app.get("/api/v1/test", (req, res) => {
  console.log("Hello World from docker 222 ");
  res.send("Hello World from docker 2223");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/expenses", expenseRouter);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      errors: err.errors || [],
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("message", "welcome to myApp");

  // Listen for incoming message
 socket.on("message", (userMessage) => {
    let botReply = "Sorry, I don't understand.";

    if (userMessage.toLowerCase().includes("hello")) {
      botReply = "Hi there! How can I help you?";
    } else if (userMessage.toLowerCase().includes("time")) {
      botReply = "Current time is " + new Date().toLocaleTimeString();
    }

    socket.emit("message", botReply);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
server.listen(4000, () => console.log("Server running on port 5000"));
  

export { app }