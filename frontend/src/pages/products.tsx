import { useQuery, useQueryClient } from "@tanstack/react-query"
import Hero from "../components/ProductHero"
import SecondPage from "../components/SecondPage"
import axios from "axios"
import {useParams } from "react-router-dom"
import "./styles/productPage.css"
import { useEffect } from "react"


const Product = ()=>{
    const {id} = useParams()
    const query = useQuery({
        queryKey: ['product' , id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/product/get-product?productId=${id?.toString()}`)
            return response.data
        },
    })
    const queryClient = useQueryClient()
    const fetchUser = async()=>{
        axios.defaults.withCredentials =true
        const response = await axios.get("http://localhost:3000/api/user/get-user")
        return response.data
    }
    const user =  queryClient.getQueryData<{user:{info:{id:string , firstName:string , lastName:string , email:string , role:string} ,status:string }}>(['user'])
    useQuery({
        queryKey:['user'] , 
        queryFn:fetchUser , 
        enabled:user?.user.status === "logged out" ? true : false
    })
    useEffect(()=>{
        window.scrollTo(0 , 0)
    },[])
    return(
        <div className="product-page-wrapper">
            
            {query.isPending ? null : <div className="wrapper">
                <Hero isAdmin={user?.user.info?.role === "ADMIN" || false}/>
                <SecondPage/>
                </div>}
        </div>
    )
}


export default Product