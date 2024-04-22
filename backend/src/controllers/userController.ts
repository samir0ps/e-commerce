import { Request, Response } from "express";
import { BanUser, DeleteTrader, createTrader, createUser, deleteImage, findAllusersPreview, findUser, findUserByAdmin, findUserById, ownerRegister, searchUser, setUserRole, trader, updateUserById, uploadImage, userLength } from "../userPrisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

const createToken = (id:string)=>{
    if(!process.env.SecretKey){
        return;
    }
    return jwt.sign({id} ,process.env.SecretKey , {expiresIn:"3d"})
}

export const userRegister = async(req:Request , res:Response)=>{
    try{
        const {email , password , firstName , lastName} = req.body
        if(!email || !password || !firstName || !lastName){
            throw new Error("email or first name or last name or password cannot be null")
        }
        const usersCount = await userLength()
        let user ; 
        if(usersCount === 0){
            user = await ownerRegister(firstName , lastName , email  , bcrypt.hashSync(password))
        }else{
            user = await createUser(firstName ,lastName , email , password )
        }
        if(!user){
            return res.status(500).json({error:"There's error creating new account please try again later"})
        }else{
            const token = createToken(user.id)
            res.cookie("accessToken" , token , {httpOnly:true , maxAge:24*60*60*1000})        
            return res.status(201).json({user , token})
        }
    }catch(e:any){
        res.status(404).json({error : e.message})
    }
}
export const userLogin = async(req:Request , res:Response)=>{
    try{
        const {email , password} = req.body
        const user = await findUser(email)
        if(user){
            const ValidPassword = bcrypt.compareSync(password , user.password)
            if(!ValidPassword){
                return res.status(401).json({error : "Invalid email or password!"})
            }
            const token = createToken(user.id)
            res.cookie("accessToken" , token , {httpOnly:true  , maxAge:24*60*60*1000})
            res.status(201).json({message : "successfully loggedIn" , user })

        }else{
            return res.status(401).json({error : "Invalid email or password!"})
        }
        
        
    }catch(e:any){
        return res.status(404).json({error:e.message})
    }
}
export const logout = (req:Request , res:Response)=>{
    res.cookie("accessToken" , "" , {httpOnly:true , maxAge:1})
    res.status(201).json({message:"done!"})
}
interface UserTypes {
    id:string
}
export const editUserAccount = async (req: Request, res: Response) => {
    try {
        const userId = req.query.user ;
        const { firstName, lastName, email, password, newPassword } = req.body;
        
        const user = await findUserById(`${userId}`);
        
        const userInformations = req.user as UserTypes
        
        if (!user || !user.password || !userInformations) {
            throw new Error("User not found or invalid credentials");
        }
        if(user.id !== userInformations.id){
            throw new Error("invalid credentails")
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        const updatedUserData: any = {};
        if (firstName !== user.firstName) {
            updatedUserData.firstName = firstName;
        }
        if (lastName !== user.lastName) {
            updatedUserData.lastName = lastName;
        }
        if (email !== user.email) {
            updatedUserData.email = email;
        }
        if (newPassword && newPassword !== password && validPassword) {
            updatedUserData.password = bcrypt.hashSync(newPassword, 10); 
        }
        let imagePath : string | undefined ; 
        if(req.file){
            const image = req.file 
            imagePath = image.path
            const normalizeImage = path.normalize(imagePath)
            const url  = `${req.protocol}://${req.get("host")}/images/${normalizeImage}`
            await uploadImage(url , `${userId}`)
        }
        const updatedUser = await updateUserById(`${userId}`, updatedUserData);
        
        
        res.status(200).json(updatedUser);
    } catch (error:any) {
        console.error("Error editing user account:", error);
        return res.status(400).json({ error: error.message });
    }
}
export const get_user = async(req : Request , res:Response)=>{
    const user = req.user
}
export const deleteUserImage = async(req:Request , res:Response)=>{
    try{
        const imageId = req.query.imageId
        const imageUrl = req.query.imageUrl
        const imageDeleted = await deleteImage(`${imageId}`)
        const fileName = path.basename(`${imageUrl}`)
        const imagePath = path.resolve(__dirname , ".." , ".." , "server_images" , "user_images" ,fileName)
        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
            return res.status(201).json({message:"Done!"})
        }else{      
            return res.status(201).json({error:"Image not deleted on Server"})
        }
    }catch(error:any){
        console.log(error.message)
        return res.status(501).json({error:error.message})
    }
}
export const adminUserPreview = async(req:Request  , res:Response)=>{
    try{
        const {page} =req.query
        const users = await findAllusersPreview(Number(page))
        const usersLength = await userLength()
        return res.status(201).json({users , usersLength})
    }catch(error:any){
        return res.status(501).json({error:error.message})
    }
}

export const userPreview = async(req:Request , res:Response)=>{
    try{
        const userId = req.query.userId
        const user = await findUserByAdmin(`${userId}`)
        return res.status(201).json(user)
    }catch(error:any){
        return res.status(501).json({error:error.message})
    }
}

export const banUser = async(req:Request , res:Response)=>{
    try{
        const {userId} = req.query ; 
        const {reason} = req.body ; 
        if(!userId){
            throw new Error("cannot find the user's id")
        }
        const ban = await BanUser(userId.toString() , reason)
        if(!ban){
            throw new Error("cannot ban the user")
        }
        return res.status(201).json({message:"user is banned"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const changeUserRole = async(req:Request , res:Response)=>{
    try{
        const {userId} = req.query ; 
        const {role} = req.body ;
        const role_string  = role.toString() 
        if(!userId){
            throw new Error("cannot find user's id") ; 
        }
        if(!role){
            throw new Error("cannot find the role context") ; 
        }
        if(role_string !== "ADMIN" && role_string !== "USER" && role_string !== "MODERATOR"){
            throw new Error("cannot get the user role!")
        }
        const userRole = await setUserRole(userId.toString() , role_string)
        if(!userRole ){
            throw new Error("an error occured while setting user's role")
        }
        return res.status(201).json({message : "user's role changed successfully!"})
    }catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }
}

export const search_users = async(req:Request , res:Response)=>{
    try{
        const {query} = req.query ; 
        if(!query){
            throw new Error("cannot find query")
        }
        const results = await searchUser(query.toString())
        return res.status(201).json(results)
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const MakeUserTrader = async(req:Request , res:Response)=>{
    try{
        const {userId} = req.query ; 
        if(!userId ){
            throw new Error ("cannot find the user's id")
        }
        const trader = await createTrader(userId.toString())
        if(!trader){
            throw new Error("an error occured while making the user trader")
        }
        return res.status(201).json({message:"user became trader succesfuly"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}

export const removeUserFromTrader = async(req:Request , res:Response)=>{
    try{
        const {userId} = req.query ; 
        if(!userId ){
            throw new Error ("cannot find the user's id")
        }
        const trader = await DeleteTrader(userId.toString())
        if(!trader){
            throw new Error("an error occured while removing the user from trading")
        }
        return res.status(201).json({message:"user became a normal user without trading succesfuly"})
    }catch(err:any){
        return res.status(501).json({error:err.message})
    }
}