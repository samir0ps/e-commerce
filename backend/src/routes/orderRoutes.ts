import { Router } from "express";
import { checkUser } from "../middlewares/authMiddleware";
import {AddOrderToSystem, updateOrderStatus} from "../controllers/orderController "
const router = Router() ; 
router.post("/create-order" , checkUser , AddOrderToSystem)
router.post("/succeeded-payment" , checkUser , updateOrderStatus)

export {router as orderRouter}