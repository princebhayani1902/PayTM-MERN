import express from "express";
import { connectToMongoDB } from "./db/connectToMongoDB.js";
import dotenv from "dotenv"
dotenv.config();

import rootRouter from "./routes/index.routes.js"


const app = express();
app.use(express.json());


app.use("/api/v1", rootRouter);


app.listen(3000,()=>{
    connectToMongoDB();
    console.log("Server is running");
})