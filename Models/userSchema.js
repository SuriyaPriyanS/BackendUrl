import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  
}, { timestamps: true });

// userSchema.pre('save', async function (next){
//   if(!this.isModified('password')) return next();
//   const salt = await bcryptjs.hashsalt(10);
//   this.password = await bcryptjs.hash(this.password, salt);
//   next();
// })

const User = mongoose.model('User', userSchema);

export default User;
