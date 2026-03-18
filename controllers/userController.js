import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  console.log(req.body.email)
  
  User.findOne(
    {
        email : req.body.email
    }
  ).then(
    (user)=>{

        if(user == null){
            res.json({
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
                    image : user.image,
                    isEmailVerified : user.isEmailVerified,

                } , "i-computers-54!");

                console.log(token)

                console.log({
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    image : user.image,
                    isEmailVerified : user.isEmailVerified,
            })



                res.json({
                    message : "Login successful",
                    token : token,
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
    res.status(500).res.json(
    {
        message : "Internal sever erroe"
    }
    )
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