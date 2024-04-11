import mongoose from "mongoose";

export const connectToMongoDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error in connect to MongoDB",error.message);
    }
    
}
