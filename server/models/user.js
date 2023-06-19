import mongoose from 'mongoose';
import { schemaOptions } from './modelOptions.js';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, schemaOptions)

export default mongoose.model('User', userSchema)