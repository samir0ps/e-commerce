import { Response , Request , NextFunction } from "express"
import { findUser } from "../userPrisma"
import * as Validator from "validator"
export const IsEmailDuplicated = async(req:Request, res:Response , next : NextFunction)=>{
    try{
        const {email}  = req.body
        const user  = await findUser(email)
        if(user){
            return res.status(500).json({error : "This Email is already registered"})
        }
        next()
    }catch(e:any){
        return res.status(404).json({error : e.message})
    }
    
}

export const validateUser = async(req:Request, res:Response , next:NextFunction)=>{
    const {email , password} = req.body
    if(!Validator.isEmail(email)){
        return res.status(500).json({error:"that doesn't look like an email"})
    }
    if(!Validator.isStrongPassword(password)){
        return res.status(500).json({error:"To keep your account safe you need STRONG password!"})
    }
    next()
}