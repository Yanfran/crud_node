import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    imageUrl: { 
        type: String,
        required: false
    },
    // fcmToken: { 
    //     type: String,
    //     required: false
    // },

})

export default mongoose.model("users", userSchema);