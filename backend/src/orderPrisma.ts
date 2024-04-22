import { PrismaClient } from "@prisma/client";
import { generateUniqueId } from "./userPrisma";
const prisma =new PrismaClient()

export const createOrder = async(userId :string , totalPrice:number ,quantity:number , address:string , paymentMethod:string , paymentStatus:string ,TimeArrival:Date)=>{
    try{
        const order= await prisma.order.create({data:{
            id:generateUniqueId("new_order") , 
            userId , 
            totalPrice , 
            quantity , 
            address , 
            paymentMethod ,
            paymentStatus , 
            TimeArrival

        }})
        if(!order){
            throw new Error("an error occured while creating an order")
        }
        return order
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const setPaymentSucceeded = async(orderId:string)=>{
    try{
        return await prisma.order.update({where:{id:orderId} , data:{
            paymentStatus:'succeeded'
        }})
    }catch(err:any){
        console.log(err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const createOrderItem = async(orderId:string , productId:string ,quantity:number , price:number)=>{
    try{
        return await prisma.orderItem.create({data:{
            id:generateUniqueId("orderItem"),
            productId ,
            orderId ,
            quantity , 
            price
        }})
    }catch(err:any){
        console.log("error:" ,err.message)
    }finally{
        await prisma.$disconnect()
    }
}

export const findAllOrders = async(userId:string)=>{
    try{
        return await prisma.order.findMany({where:{
            userId
        }})
    }catch(err:any){
        console.log("error:" ,err.message)
    }finally{
        await prisma.$disconnect()
    }
}

