import mongoose from "mongoose";

export const connectDB = async()=>{
    const uri=process.env.MONGO_URI;

    if(!uri){
        throw new Error("Unable to connect to the server")
    }

    mongoose.set("strictQuery",true);

    const conn= await mongoose.connect(uri,{serverSelectionTimeoutMS:10000,});

    console.log(`MONGODB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
}