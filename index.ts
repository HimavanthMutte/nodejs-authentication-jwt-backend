import express from "express"

import dotenv from "dotenv"

import connectDB from "./config/db.js"

dotenv.config()

await connectDB()

const app = express()

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000")
})