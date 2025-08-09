import connectDB from './db/index.js';
import { app } from "./app.js";
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

// Connect to MongoDB
const PORT = process.env.PORT || 4000;
connectDB()
.then(async () => {
const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`⚙️ Server is running at port : ${PORT}`);
})
}).catch(async () => {
  console.log("MONGO db connection failed !!! ", err);
})
