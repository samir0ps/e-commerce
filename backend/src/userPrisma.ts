import { PrismaClient , Role } from "@prisma/client";
import * as CryptoJS from 'crypto-js'
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"
const prisma = new PrismaClient()

export function generateUniqueId (unique:string){
    const timeStamp = new Date().getTime.toString()
    const randomString = CryptoJS.lib.WordArray.random(30).toString(CryptoJS.enc.Hex)
    const CompinedString = timeStamp + randomString + unique
    const hash = CryptoJS.SHA256(CompinedString).toString(CryptoJS.enc.Hex)
    return hash

}
export const createUser = async(firstName:string , lastName:string , email:string , password:string ,)=>{
    try{
        const hashedPassword = bcrypt.hashSync(password , 10)
        return await prisma.user.create({data:{id:generateUniqueId(email) , firstName , lastName ,email ,password:hashedPassword}})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const findUser = async(email:string)=>{
        return await prisma.user.findFirst({where:{email}})
}
export const findUserById = async(id : string)=>{
    return await prisma.user.findFirst({where : {id},
        include:{
            images:true,
            trader:true ,
            favourites:true , 
            addresses:true
            
        }
    })
}

export const findOrCreateUser =async(googleId : string , firstName :string, lastName :string, email:string)=>{
    const user =await prisma.user.findFirst({where:{id : googleId}})
    if(!user){
        return await prisma.user.create({data:{id:googleId , firstName , lastName , email  , verified:true , password:""}})
        
    }else{
        return user
    }
}

export const updateUserById = async (id: string, userData: any) => {
    try {
        return await prisma.user.update({
            where: { id },
            data: userData
        });
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
    }finally{
        await prisma.$disconnect()
    }
}
export const uploadImage = async (image:string , userId:string)=>{
    try{
        const userImages = await prisma.userImage.findMany({where:{userId}})
        userImages.map(image=>{
            const imagePath =path.resolve(__dirname ,".." ,"server_images" , "user_images" , path.basename(image.url))
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath)
            }

        })
        const deleteRecentImages = await prisma.userImage.deleteMany({where:{userId}})
        if(deleteRecentImages || userImages.length === 0){
            return await prisma.userImage.create({data:{id:generateUniqueId(image) , url:image ,userId}})
        }else{
            throw new Error("error while deleting recent images")
        }
    }catch (error) {
        console.error("Error adding Image:", error);
        throw new Error("Failed to add image");
    }finally{
        await prisma.$disconnect()
    }
}
export const deleteImage = async (imageId:string)=>{
    try{
        return await prisma.userImage.delete({where:{id:imageId}})
    }
    catch(error){
        throw new Error("Failed to delete the image")
    }finally{
        await prisma.$disconnect()
    }
}
export const findAllusersPreview = async (page:number)=>{
    try{
        return await prisma.user.findMany({take:10,  skip:10*page ,orderBy:{role:"desc"}})
    }catch(error:any){
        console.log(error.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const findUserByAdmin = (userId:string)=>{
    return prisma.user.findFirst({where:{id:userId} , include:{
        images:true , 
        ban:true
    }})
}

export const userLength = async()=>{
    try{
        return await prisma.user.count()
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const BanUser = async(userId : string ,reason:string)=>{
    try{
        return await prisma.bannedUser.create({
            data:{
                id:generateUniqueId(userId) , 
                userId , 
                reason
            }
        })
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}


export const setUserRole =async(userId :string , role:Role)=>{
    try{
        return await prisma.user.update({
            where:{
                id:userId
            } , 
            data:{
                role
            }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const trader =async(userId :string )=>{
    try{
        return await prisma.trader.findFirst({where:{
            traderId :userId
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const searchUser = async(query:string)=>{
    try{
        return await prisma.user.findMany({
            where:{
                OR:[
                    {
                        firstName:{
                            contains:query , 
                            mode:"insensitive"
                        } , 
                    },
                    {
                        lastName:{
                            contains:query , 
                            mode:"insensitive"
                        }
                    } , 
                    {
                        email:{
                            contains:query , 
                            mode:"default"
                        }
                    } , 
                    {
                        id:{
                            contains:query
                        }
                    }
                    
                ]
            }
        })
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
export const createTrader =async(userId :string )=>{
    try{
        return await prisma.trader.create({data:{
            traderId:userId , 
            id:generateUniqueId(userId)
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}


export const ownerRegister = async(firstName:string , lastName :string , email:string , password:string , )=>{
    try{
        const owner = await prisma.user.create({data:{
            id:generateUniqueId(firstName) , 
            lastName , 
            firstName , 
            email , 
            password , 
            role:"ADMIN" , 
        }})
        if(!owner){
            throw new Error("an error occured while creating the user")
        }
        return await createTrader(owner.id)
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const DeleteTrader =async(userId :string )=>{
    try{
        return await prisma.trader.delete({where:{
            traderId:userId , 
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}
