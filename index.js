import express from 'express'
import mongoose from "mongoose"
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import authorizeUser from './lib/jwtMiddleware.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()


const mongoURI = process.env.MONGO_URI
//"mongodb+srv://admin:1234@cluster0.04oxvps.mongodb.net/?appName=Cluster0"
//process.env.MONGO_URI

mongoose.connect(mongoURI).then(
    ()=>{
        console.log("Connected to MongoDB")
    }
).catch(
    ()=>{
        console.log("error connecting to MongoDB")
    }
)

const app = express()

//middleware
app.use(authorizeUser)


app.use(express.json())
app.use( cors() )
app.use("/api/users", userRouter)
app.use("/api/products", productRouter) 






app.listen(3000 , 
    ()=>{
        console.log("Server is running on part 3000")
    }
)




