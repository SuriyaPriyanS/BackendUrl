import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRouter from "./Routers/url.js"; // Correct import path
import  useRouter from "./Routers/auth.js";
import usedashboard from "./Routers/dashboard.js";
import connectDB from './Databases/config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EmAIL_USER,
//     pass: process.env
//   }
// })

app.use(express.json());
app.use(cors());


connectDB();
app.get("/", (req,res)=> {
  res.send("API is running");
})

app.use('/api', urlRouter);
app.use('/api', useRouter);
app.use('/api', usedashboard)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
