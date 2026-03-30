import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()

//images

export function createUser(req,res){

    const hashedPassword = bcrypt.hashSync(req.body.password , 10)

    const user = new User(
        {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : hashedPassword,
        }
    )

    user.save().then(
        ()=>{
            res.json({
                message : "User created successfully",
            })
        }
    ).catch(
        ()=>{
            res.json(
                {
                    message : "User creation failed"
                }
            )
        }
    )
}

export function loginUser(req,res){

  User.findOne(
    {
        email : req.body.email
    }
  ).then(
    (user)=>{

        if(user == null){
            return res.status(404).json({
            message : "User with given email not found"
        })
        }else{

            const isPasswordValid = bcrypt.compareSync(req.body.password , user.password)

            if(isPasswordValid){

                const token = jwt.sign({

                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    images : user.images,
                    isEmailVerified : user.isEmailVerified,

                } , 
                process.env.JWT_SECRET,
                { expiresIn: req.body.rememberme ? "30d" : "48h"}
                );

                console.log({
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    images : user.images,
                    isEmailVerified : user.isEmailVerified,
            })



                res.json({
                    message : "Login successful",
                    token : token,
                    role : user.role,
                })
            }else{
                res.status(403).json(
                    {
                        message : "Invalid password"
                    }
                )
            }
        }
        
    }
  ).catch(() => {
    res.status(500).json({
    message : "Internal server error"
    })
})
    
}

export function isAdmin(req){
    if(req.user == null){
        return false
    }
    if(req.user.role == "admin"){
        return true
    }else{
        return false
    }
}