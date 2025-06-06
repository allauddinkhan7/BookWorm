import mongoose from 'mongoose';
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        console.log("url", process.env.MONGODB_URI)
      const conntDbIsnt =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     

      console.log(`MongoDB Connected: ${conntDbIsnt.connection.host} ${DB_NAME}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
} 

export default connectDB;