import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import LoadingComponent from "../components/Loading"
import {motion} from "framer-motion"
import "./styles/cartpage.css"
import {  useState } from "react"
import Menu from "../subcomponents/dropdown"
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom"
import {loadStripe , Stripe} from '@stripe/stripe-js';
import CreateOrder from "../components/createOrder"
const Cart = () => {
    const user = useQuery({
        queryKey:['user'] , 
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/user/get-user")
            return response.data
        }
    })
    const query = useQuery({
        queryKey: ['cart_items'],
        queryFn: async () => {
            const response = await axios.get("http://localhost:3000/api/product/get-items")
            return response.data
        } , 
        enabled:user?.data?.user?.info ? true :false
    })
    const queryClient = useQueryClient()
    let items  = query.data?.cart_items ?  query.data?.cart_items : null
    const [quantity , setQuantity] = useState(1)
    const mutation = useMutation({
        mutationFn:async(id:string)=>{
            if(items && Array.isArray(items)){
                const item = items.find(item=> item.product.id ===id)
                item.quantity = quantity
                item.price = (quantity * item.product.price).toFixed(2)
            }
            const reponse = await axios.put(`http://localhost:3000/api/product/update-quantity?productId=${id}` , {quantity})

            return reponse
        },
        onSuccess:()=>{
            query.refetch()
        }
    })
    const handleQuantity = (id:string)=>{
        mutation.mutateAsync(id)
    }
    const deleteMutation = useMutation({
        mutationFn:async(id:string)=>{
            const response = await axios.delete(`http://localhost:3000/api/product/delete-item?productId=${id}`)
            return response.data
        } , 
        
        onSuccess:()=>{
            query.refetch()
            queryClient.invalidateQueries({queryKey:['items']})
            queryClient.invalidateQueries({queryKey:['cart_items']})
        }
    })
    const handleDelete =(id:string)=>{
        deleteMutation.mutateAsync(id)
    }
    
    const user_info = user.data
    const navigate = useNavigate()
    const [loading , setIsLoading] = useState(false)
    const [openCreateOrder , setOpenCreateOrder] = useState(false)
    const handlePayment = async(orderId:string)=>{
        try {
            if(!user_info?.user?.info ){
                navigate("/login")
            }else{

                setIsLoading(true)
                const stripe: Stripe | null = await loadStripe("pk_test_51NjrAqEknAr4wUcJRssuXk1UsdFXGoQFqz3hywN49GgLhoWF7uTpgGpqmALgXMTAdEMIi1kGQacOAjCulE0VnvLO00uBo5hSv0");
                if (!stripe) {
                    throw new Error('Failed to load Stripe');
                }
        
                const response = await axios.post(`http://localhost:3000/api/product/check-cart-items` , {orderId});
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
        if(user_info?.user?.info){
            setOpenCreateOrder(true)
        }else{
            navigate('/login')
        }
    }
    return (
    <div >
        {query.isPending ? <LoadingComponent/> : query.data?.cart_items && <div className="cart-wrapper"><div className="items-container">
            <h1 className="cart-h">Cart</h1>
            {Array.isArray(items)&&items.map((item , index)=>(
                <motion.div key={item.id} initial={{scale:0.8 , opacity:0}} animate={{scale:1 , opacity:1}} transition={{duration:0.3 ,delay:index*0.2}}  className="item-container">
                    <div className="item-img-container">
                        <img src={
                            item.product.images[0].url
                        } alt={"item_image"} />
                    </div>
                    <div className="item-details">
                        <p className="item-name">{item.product.name}</p>
                        <p className="item-p"><span className="item-text">Price per item:</span> ${item.product.price}</p>
                        <div className="item-div"><span className="item-text">Quantity:</span> <div><Menu fn={()=>{handleQuantity(item.product.id)}}  quantity={item.quantity} setQuantity={setQuantity}/></div></div>
                        <p className="item-p"><span className="item-text">Total price:</span> ${item.price}</p>

                    </div>
                    <button onClick={()=>{handleDelete(item.product.id)}} disabled={deleteMutation.isPending } className="delete-item-btn">
                        <AiOutlineDelete  className="delete-item-icon"/>
                    </button>
                </motion.div>
            ))}
        </div>
        <div className="checkout-container">
            <div className="checkout-card">
                <p><span className="float-left">Subtotal Price</span><span className="float-right">${query?.data?.totalPrice}</span></p>
                <hr />
                <p><span className="float-left">Total Quantity</span><span className="float-right">{query?.data?.totalQuantities}</span></p>
                <hr />
                <p><span className="float-left">Shipping Fee</span><span className="float-right free">Free</span></p>
                <p className="total-price"><span className=" float-left">Total Price</span><span className="float-right">${query?.data?.totalPrice}</span></p>

                <button disabled={loading} onClick={handleCreateOrder}>Check Out</button>
            </div>
        </div></div>}
        <CreateOrder openCreateOrder={openCreateOrder} ActionType="products" setOpenCreateOrder={setOpenCreateOrder} Fn={handlePayment}/>
    </div>  
    )
}

export default Cart