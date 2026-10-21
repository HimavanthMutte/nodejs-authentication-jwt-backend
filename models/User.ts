import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: [true,"Email already exists"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true,"Password is required"]
    }
},{timestamps: true})

export default mongoose.model("User",userSchema)