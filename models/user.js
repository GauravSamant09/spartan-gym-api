import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {type: String, requied:true},
    email: {type: String, requied:true},
    password: {type: String, requied:true},
    id: {type: String, requied:true},
})

export default mongoose.model('User', userSchema);