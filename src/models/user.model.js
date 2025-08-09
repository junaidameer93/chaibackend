import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
  username :{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
    trim: true,
  },
  email:{
    type: String,
    required: true,
    unique : true,
    trim : true,
    lowercase : true,
  },
  fullname:{
    type: String,
    required: true,
    trim : true,
  },
  password:{
    type: String,
    required: [true,'Password is required'],
  },
  refreshToken: {
    type: String,
    default: "",
},
},{
  timestamps: true
});

userSchema.pre('save', async function (next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });
}


export const User = model('User', userSchema);
