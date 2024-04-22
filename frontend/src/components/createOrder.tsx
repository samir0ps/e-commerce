import { FormEvent, useState } from "react"
import { useOutsideClick } from "./outsideClick"
import { HiOutlineChevronDown } from "react-icons/hi2"
import {motion} from "framer-motion"
import "./styles/createOrder.css"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useParams, useSearchParams } from "react-router-dom"
const CreateOrder = ({openCreateOrder , setOpenCreateOrder ,Fn , ActionType}:{openCreateOrder:boolean , setOpenCreateOrder:(value:boolean)=>void , Fn:(value:string)=>void , ActionType:string})=>{
    const [openSelection ,setOpenSelection]= useState(false)
    const [error , setError] =useState('')
    const [address , setAddress] = useState('')
    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const quantity = searchParams.get('quantity')
    const [paymentMethod , setPaymentMethod] = useState("Card")
    const queryClient  = useQueryClient()
    const products:any = queryClient.getQueryData(['cart_items'])
    const ids= products?.cart_items && Array.isArray(products.cart_items) && products?.cart_items?.map((product:any)=>({
        id:product.product.id , 
        quantity:product.quantity
    }))
    const mutation = useMutation({
        mutationFn:async()=>{
            const response = await axios.post(`http://localhost:3000/api/create-order` , {paymentMethod , address , products:[{id , quantity}]})
            return response.data
        } , 
        onSuccess:(data)=>{
            if(paymentMethod==="Card"){
                Fn(data.orderId)
                setOpenCreateOrder(false)
            }else{
                setOpenCreateOrder(false)
            }
        }
    })

    const productsMutations = useMutation({
        mutationFn:async()=>{
                const response = await axios.post(`http://localhost:3000/api/create-order` , {paymentMethod , address , products:ids})
                return response.data
        } , 
        onSuccess:(data)=>{
            if(paymentMethod==="Card"){
                Fn(data.orderId)
                setOpenCreateOrder(false)
            }else{
                setOpenCreateOrder(false)
            }
        }
    })
    const handleOpenSelection =()=>{
        setOpenSelection(!openSelection)
    }
    const ref = useOutsideClick(()=>{
        setOpenSelection(false)
    })
    const handleSettingMethod = (method:string)=>{
        setPaymentMethod(method)
        setOpenSelection(false)
    }
    const formRef=useOutsideClick(()=>{
        setOpenCreateOrder(false)
    })
    const onSubmit = ()=>{
        try{
            if(address === "" || address === null){
                throw new Error("address cannot be empty")
            }
            if(ActionType === "product"){
                mutation.mutateAsync()
            }else{
                
                productsMutations.mutateAsync()
            }
        }catch(err:any){
            setError(err.message)
        }

        
    }
    const handleSettingAddress = (e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value ; 
        setAddress(value)
        setError('')
    }
    return (
        <motion.div initial={{visibility:'hidden'}} animate={openCreateOrder ? {visibility:'visible'}:{visibility:'hidden' , transition:{delay:0.2}}} className="create-order-container">
            <div className="hidden-container">
                <motion.div ref={formRef} initial={{scale:0}} animate={openCreateOrder?{scale:1}:{scale:0}} className="order-form">
                    <h1>Order Products</h1>
                    <label>Your Address</label>
                    <input value={address} onChange={handleSettingAddress} style={error?{borderColor:"#9e2a2b"}:{}} type="text" placeholder="Address where you would like to receive the products..." />
                    {error&&<p>{error}</p>}
                    <label >Choose Your Payment Method</label>
                    <div ref={ref} className="payment-select-container">
                                    <div   onClick={handleOpenSelection} className="payment-select">
                                        {paymentMethod}
                                        <HiOutlineChevronDown className="select-down-icon"/>
                                    </div>
                                    <motion.div animate={openSelection ? {scale:1}:{scale:0}} className="payment-options">
                                        <div className="payment-option" onClick={()=>handleSettingMethod("Card")}>Card</div>
                                        <div className="payment-option" onClick={()=>handleSettingMethod("Cash")}>Cash</div>
                                    </motion.div>
                                    
                            </div>
                            <button onClick={onSubmit}>Submit</button>
                </motion.div>
            </div>

        </motion.div>
    )
}

export default CreateOrder