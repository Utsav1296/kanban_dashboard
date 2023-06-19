import express from "express";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import { authRoute, boardRoute, sectionRoute, taskRoute } from "./routes/index.js";

const app = express()
dotenv.config();
mongoose.set('strictQuery', true)

const connection = async () => {
   try {
      await mongoose.connect(process.env.MONGO)
      console.log("connected to mongodb")
   } catch (error) {
      console.log(error);
   }
}

// For sending files in JSON format...
app.use(express.json())
//for cross origin request
var corsOptions = {
   origin: 'http://localhost:5173',
   credentials: true,//as passing cookies from client to backend server
   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(cookieParser())


app.use("/api/auth", authRoute)
app.use("/api/boards", boardRoute)
app.use("/api/boards/:boardId/sections", sectionRoute)
app.use("/api/boards/:boardId/tasks", taskRoute)



app.use((err, req, res, next) => {
   const errorStatus = err.status || 500
   const errorMessage = err.message || "Something went wrong at your server!"

   return res.status(errorStatus).send(errorMessage)
})

app.listen(8080, () => {
   connection();
   console.log("Backend on port: http://localhost:8080")
})