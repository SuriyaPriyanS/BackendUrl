import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MongoDb = process.env.MONGO_URL;

  const connectDB = async (req,res, next) => {
    try {
      const coonection = await mongoose.connect(MongoDb);
      console.log('MongoDb Connected');
      return connectDB;
    }
    
    
  
 catch (error) {
  console.log(error);
  process.exit(1);
  
}

  };


export default connectDB;
