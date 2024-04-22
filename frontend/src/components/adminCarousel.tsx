import { BsPlus, BsTrash } from "react-icons/bs"
import "./styles/createCarousel.css"
import {AnimatePresence, motion} from "framer-motion"
import { FormEvent, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useOutsideClick } from "./outsideClick"
import { FaX } from "react-icons/fa6"
const CreateCarousel =()=>{
    const [openForm , setForm] = useState(false)
    const [products , setProducts] = useState<any[]>([])
    const [productsId , setIds] = useState<string[]>([])
    const [title , setTitle] = useState('')
    const [addedProducts , setAddedProducts] = useState<any[]>([])
    const [error , setError] =useState<string|null>("")
    const handleOpenFrom = ()=>{
        setForm(true)
    }
    
    const result :any= useQuery({
        queryKey : ["user"] , 
        queryFn :async()=>{
            axios.defaults.withCredentials =true
            const response = await axios.get("http://localhost:3000/api/user/get-user")
            
            return response.data
        },
        
    })
    useQuery({
        queryKey:['admin_products'] , 
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/product/get-all-products")
            setProducts(response.data)
            return response.data
        } , 
        enabled:result?.data?.user?.info?.role === "ADMIN"
    })
    const handleAdding=(product:any)=>{
        setIds(prev=>([...(prev || []) ,product.id ]))
        setAddedProducts(prev=>([...(prev || []) ,product ]))
    }
    const handleRemoving = (product:any)=>{
        const filtered = addedProducts.filter(p=> p !== product)
        setAddedProducts(filtered)
    }
    const ref  = useOutsideClick(()=>{
        setForm(false)
    })
    const handleClose = ()=>{
        setForm(false)
    }
    const mutation = useMutation({
        mutationFn:async()=>{
            const response = await axios.post("http://localhost:3000/api/product/create-carousel" , {products : productsId , title})
            return response.data
        } ,
        onSuccess:()=>{
            handleClose()
            setAddedProducts([])
            setIds([])
        }
    })
    const handleSubmit = ()=>{
        if(!title){
            return setError('title cannot be empty')
        }else{
            mutation.mutateAsync()
        }
    }
    const handleTitle = (e:FormEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value ; 

        setTitle(value)
    }
    return (
        <AnimatePresence>
            {result?.data?.user?.info?.role === "ADMIN" && <div className="create-carousel-container">
                <h3>create carousel of products</h3>
                <button onClick={handleOpenFrom}><BsPlus/>Create</button>
                <motion.div initial={{visibility:"hidden"}} animate={openForm ? {visibility:"visible" }:{visibility:"hidden" , transition:{delay:0.1}}} className="create-carousel-form">
                    <motion.div ref={ref} animate={openForm ? {scale:1}:{scale:0 }} transition={{duration:0.3}} className="form-container">
                        <button onClick={handleClose} className="close-form-btn"><FaX/></button>
                        <div className="added-products">
                            <h3>Added Products</h3>
                            <input style={error ? {borderColor:"#d90429"}:{}} value={title} onChange={handleTitle} type="text" className="carousel-title" placeholder="Write the carousel title..."/>
                            {error&& <p style={{color:"#d90429"}}>{error}</p>}
                            <div className="add-products-container">
                                {addedProducts.map(product=>(
                                    <div key={product.id} className="product-ad-container">
                                        <img src={product.images[0].url} alt={product.name + "image"}/>
                                        <p>{product.name}</p>
                                    <button onClick={()=>handleRemoving(product)}><BsTrash/>remove</button>
                                </div>
                                ))

                                }

                            </div>
                        </div>
                        <h3>All Products</h3>
                        <div className="all-products">
                            {products.map(product=>(
                                <div key={product.id} className="product-ad-container">
                                    <img src={product.images[0].url} alt={product.name + "image"}/>
                                    <p>{product.name}</p>
                                    <button onClick={()=>handleAdding(product)}>Add <BsPlus/></button>
                                </div>
                            ))

                            }
                            

                        </div>
                        <button onClick={handleSubmit}>Submit</button>
                    </motion.div>
                </motion.div>
            </div>}
        </AnimatePresence>
    )
}
export default CreateCarousel