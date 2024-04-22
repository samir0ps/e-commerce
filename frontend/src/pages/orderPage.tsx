import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {  useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import './styles/order.css'
import {loadStripe , Stripe} from '@stripe/stripe-js';
import { AnimatePresence , motion } from "framer-motion"
import LoadingComponent from "../components/Loading"
import CreateOrder from "../components/createOrder"
const OrderOneProduct = ()=>{
    const [loading , setIsLoading] = useState(false)
    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('quantity')
    const [product , setProduct] = useState<any>(null)
    const {isPending}  =useQuery({
        queryKey:['productToOrder'] , 
        queryFn:async()=>{
            const response = await axios.post(`http://localhost:3000/api/product/product-to-order?productId=${id?.toString()}` , {quantity:q})
            setProduct(response.data)
            return response.data

        }
    })
    const userQuery= useQuery({
        queryKey : ["user"] , 
        queryFn :async()=>{
            axios.defaults.withCredentials =true
            const response = await axios.get("http://localhost:3000/api/user/get-user")
            
            return response.data
        },
        
    })
    const user = userQuery.data
    const navigate = useNavigate()
    const [openCreateOrder , setOpenCreateOrder] = useState(false)
    const handlePayment = async(orderId:string)=>{
        try {
            if(!user?.user?.info && !isPending){
                navigate("/login")
            }else{

                setIsLoading(true)
                const stripe: Stripe | null = await loadStripe("pk_test_51NjrAqEknAr4wUcJRssuXk1UsdFXGoQFqz3hywN49GgLhoWF7uTpgGpqmALgXMTAdEMIi1kGQacOAjCulE0VnvLO00uBo5hSv0");
                if (!stripe) {
                    throw new Error('Failed to load Stripe');
                }
        
                const response = await axios.post(`http://localhost:3000/api/product/check-out-payment?productId=${id}`, { quantity: q  , orderId});
                const sessionId = response.data.id;
        
                if (!sessionId) {
                    throw new Error('Failed to retrieve session ID');
                }
        
                const result = await stripe.redirectToCheckout({
                    sessionId: sessionId ,
                    
                });
        
                if (result.error) {
                    throw new Error(result.error.message);
                }

            }

            
        } catch (err:any) {
            console.error(err.message);
        }finally{
            setIsLoading(false)
        }
    }
    const handleCreateOrder = ()=>{
        if(user.user.info){
            setOpenCreateOrder(true)
        }else{
            navigate('/login')
        }
    }
return (
        <AnimatePresence >
            {isPending ? <div className='loading-suspense-container'><LoadingComponent/></div> :<div>ت{product && <div className="order-wrapper">
            <div className="products-review">
                    <h1>Check Out This Product</h1>
                        <motion.div initial={{scale:0}} animate={{scale:1}} className="product-data-container">
                            <img src={product.product.images[0].url} alt={"product_image"} />
                            <div className="product-to-order-details">
                                <p>{product.product.name}</p>
                                <p><span>Price:</span>${product.product.price}</p>
                                <p><span>Quantity:</span>{product.quantity}</p>
                                <p><span>Discount:</span>{product.product.discount}%</p>
                                <p><span>Total Price:</span>${(product.product.price-(product.product.discount * product.product.price))*product.quantity}</p>

                            </div>
                        </motion.div>
                </div>
                <motion.div initial={{scale:0}} animate={{scale:1}} className="checkout-container">
                    <div className="checkout-card">
                        <p><span className="float-left">Subtotal Price</span><span className="float-right">${(product?.product?.price-((product?.product?.discount/100) * product?.product?.price))*product?.quantity}</span></p>
                        <hr />
                        <p><span className="float-left">Total Quantity</span><span className="float-right">{product?.quantity}</span></p>
                        <hr />
                        <p><span className="float-left">Shipping Fee</span><span className="float-right free">Free</span></p>
                        <p className="total-price"><span className=" float-left">Total Price</span><span className="float-right">${(product?.product?.price-((product?.product?.discount/100) * product?.product?.price))*product?.quantity}</span></p>

                        <button disabled={loading} onClick={handleCreateOrder}>{loading ? <LoadingComponent/> :"Check Out"}</button>
                    </div>
            </motion.div>
            </div>}</div>}
            <CreateOrder ActionType="product" Fn={handlePayment} openCreateOrder={openCreateOrder} setOpenCreateOrder={setOpenCreateOrder}/>
        </AnimatePresence>
    )
}
export default OrderOneProduct