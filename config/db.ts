import mongoose from "mongoose";

const connectDB = async() => {
    try {
    await mongoose.connect(process.env.MONGO_URI!)
    console.log("Connected to MongoDatabse")
    }
    catch(err) {
        if (err instanceof Error)console.log(`Server connecting error: ${err.message}`)
    }
}

export default connectDB