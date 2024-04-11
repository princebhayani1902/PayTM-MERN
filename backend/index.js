import express from "express";
import { connectToMongoDB } from "./db/connectToMongoDB.js";
import dotenv from "dotenv"
dotenv.config();

const app = express();

app.listen(3000,()=>{
    connectToMongoDB();
    console.log("Server is running");
})