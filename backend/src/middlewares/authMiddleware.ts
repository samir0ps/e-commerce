import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { findUserById, trader } from "../userPrisma"; 
declare global{
    namespace Express{
        interface Request{
            user?:object
        }
    }
}
export const loggedIn = (req:Request, res:Response , next:NextFunction)=>{
    try{
        const token = req.cookies.accessToken
        if(!process.env.SecretKey){
            throw new Error("cannot access the secret key")
        }
        if(token){
            jwt.verify(token , process.env.SecretKey , (err:any ,decode:any)=>{
                if(err){
                    return res.status(401).json({error:"your authentication is not valid!"})
                }else{
                    next()
                }
            })
        }else{
            res.status(401).json({error:"your are not logged in!"})
        }
    }catch (error){
        return console.log(error)
    }
}
export const checkUser = async(req:Request , res:Response , next:NextFunction)=>{
    const token = req.cookies.accessToken
    if(!process.env.SecretKey){
        throw new Error("cannot access the secret key")
    }
    if(token){
        jwt.verify(token , process.env.SecretKey , async(err:any ,decode:any)=>{
            if(err){
                return res.status(401).json({error:"error autherizing"})
            }else{
                const user = await findUserById(decode.id)
                if (user){
                    req.user = user
                }
                next()
            }
        })
    }else{
        next()
    }
}
export const requireAdmin = async(req : Request  , res:Response , next:NextFunction)=>{
    const token = req.cookies.accessToken
    if(!process.env.SecretKey){
        throw new Error("cannot access the secret key")
    }
    if(token){
        jwt.verify(token , process.env.SecretKey , async(err:any ,decode:any)=>{
            if(err){
                return res.status(401).json({error:"error autherizing"})
            }else{
                const user = await findUserById(decode.id)
                if (user){
                    const role = user.role
                    if(role === "ADMIN"){
                        next()
                    }
                }
            }
        })
    }else{
        return res.status(401).json({error:"not autherized"})
    }
}
export const requireTrader = async(req:any , res:Response , next:NextFunction)=>{
    const token = req.cookies.accessToken
    if(!process.env.SecretKey){
        throw new Error("cannot access the secret key")
    }
    if(token){
        jwt.verify(token , process.env.SecretKey , async(err:any ,decode:any)=>{
            if(err){
                return res.status(401).json({error:"error autherizing"})
            }else{
                const user = await findUserById(decode.id)
                if (user){
                    const trader_get = await trader(user.id)
                    if(!trader_get){
                        return res.status(501).json({error:"require trader"})
                    }
                    else{
                        req.trader = trader_get
                        next()
                    }
                }
            }
        })
    }else{
        return res.status(401).json({error:"not autherized"})
    }
}