import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { connectToMongoDB } from "./db/connectToMongoDB.js";
import rootRouter from "./routes/index.routes.js"

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1",rootRouter);


app.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`Server is running on ${PORT}`);
})