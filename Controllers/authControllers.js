
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../Models/userSchema.js';
import nodemailer from 'nodemailer';

export const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword, firstName, lastName });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully',result: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    res.status(200).json({ message: "User logged In Successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getuser = async(req, res)=>{
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    res.status(200).json ({message: "Authorized user", data: [user]})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: " Internal server error Failed to fetch to get user"});
    
  }
};

export const forgotPassword = async(req,res)=>{
  const {email} = req.body
  const user = await User.findOne({email})
  if(!user){
    return res.status(404).json({message:"User not found"})
  }
  const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
  var transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.PASSMAIL,
      pass:process.env.PASSKEY
    }
  })
  var mailOptions = {
    from: process.env.PASSMAIL,
    to: user.email,
    subject: "Password Reset",
    text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      `http://localhost:5173/reset-password/${user._id}/${token}`
  }
  transporter.sendMail(mailOptions,function(error,info){
    if(error){
      console.log(error);
      res.status(500).json({message:"Internal server error in sending the mail"})
    }else{
      res.status(200).json({message:"Email sent successfully"})
    }
  })
}

export const resetPassword = async(req,res)=>{
  const {id , token} = req.params
  const {password} = req.body
  jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
    if(err){
      return res.status(401).json({message:"Invalid token"})
    }
    else{
      bcryptjs.hash(password,10)
       .then(hash =>{
          User.findByIdAndUpdate({_id:id},{password:hash})
          .then(ele=>res.send({status:"Success"}))
          .catch(err=>res.send({status:err}))
       })
       .catch(err=>res.send({status:err}))
    }
    
  })
}
