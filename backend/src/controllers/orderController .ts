import { Request, Response } from "express";
import { findProductById } from "../productPrisma";
import { createOrder, createOrderItem, setPaymentSucceeded } from "../orderPrisma";
import _ from "lodash";

interface Product {
    id: string;
    quantity: number;
}
function durationStringToTimestamp(durationString: string): number {
    const numericPart = parseInt(durationString);
    const unit = durationString.slice(-1); 
    
        const secondsInMinute = 60;
        const secondsInHour = 3600;
        const secondsInDay = 86400;
    
        let durationInSeconds;
        switch (unit) {
        case 'm': 
            durationInSeconds = numericPart * secondsInMinute;
            break;
        case 'h': 
            durationInSeconds = numericPart * secondsInHour;
            break;
        case 'd': 
            durationInSeconds = numericPart * secondsInDay;
            break;
        default:
            throw new Error('Invalid duration unit');
        }
    
        const currentTimestampMs = Date.now();
    
        const futureTimestampMs = currentTimestampMs + durationInSeconds * 1000; 
        return futureTimestampMs;
    }
    


export const AddOrderToSystem = async (req: any, res: Response) => {
    try {
        const { products, address  , paymentMethod} = req.body;
        const user: any = req.user;

        if (!user) {
            return res.status(401).json({ error: "You should login first" });
        }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Cannot find any product to create an order" });
        }

        const productsInfo = await Promise.all(products.map(async (product: Product) => {
            const productInfo = await findProductById(product.id);
            return { product: productInfo, quantity: product.quantity };
        }));
        
        const totalPrice = _.sumBy(productsInfo, (p: any) => {
            return Number((Number(p.product.price) - (Number(p.product.discount) / 100)*Number(p.product.price)) * Number(p.quantity));
        });
        if(Number.isNaN(totalPrice)){
            throw new Error(typeof totalPrice)
        }
        const totalQuantity = _.sumBy(productsInfo, (q)=>{
            return Number(q.quantity)
        });
        const orderTimestamp = durationStringToTimestamp('4d');
        const orderDate = new Date(orderTimestamp);

        const order = await createOrder(user.id, totalPrice, Number(totalQuantity), address, paymentMethod, 'pending...',orderDate);
        if (!order) {
            throw new Error("An error occurred while creating a new order");
        }
        for (const product of productsInfo){
            if(product.product){
                const price = Number(product.product.price - ((product.product.discount/100)*product.product.price)) * Number(product.quantity)
            const orderItem = await createOrderItem(order.id , product.product.id , Number(product.quantity) , price)
            if(!orderItem){
                throw new Error("an error occured while creating orderItem")
            }
            }else{
                throw new Error ("cannot find this product")

            }
            
        }


        return res.status(201).json({ message: "Order created successfully", orderId: order.id });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateOrderStatus = async(req:Request , res:Response)=>{
    try{
        const {orderId} = req.query ; 
        if(!orderId){
            throw new Error("cannot find the orderId") ; 
        }
        const order= setPaymentSucceeded(orderId.toString())
        if(!order){
            throw new Error('an error occured while setting the order succeeded')
        }
        return res.status(201).json({message:"succeeded"})
    }catch(err:any){
        console.log(err.message)
        return res.status(501).json({error:err.message})
    }
}
