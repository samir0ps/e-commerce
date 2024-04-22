import { FormEvent, useState } from "react"
import "../components/styles/hero.css"
import Rate from "./rate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
import ErrorMessage from "./errorMessage"
import SuccMessage from "../components/succMessage"
const AddReview = ()=>{
    const [content , setContent] = useState('')
    const [rating , setRating] = useState<number>(1)
    const [error , setError] = useState<string | null>(null)
    const [message , setMessage] = useState<string | null> (null)
    const {id} = useParams()
    const handleContent = (e:FormEvent<HTMLTextAreaElement>)=>{
        setContent(e.currentTarget.value)
    }
    const query = useQuery({
        queryKey:['user'] , 
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/user/get-user")
            return response.data
        }
    })
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn:async()=>{
            try{
                if(!query.data.user){
                    throw new Error("Login first to add your review")
                }else{
                    const response = await axios.post("http://localhost:3000/api/product/add-review" , {content , rating ,productId : id?.toString() ,userId:query.data.user.info.id  })
                    return response.data
                }
            }catch(err:any){
                setError(err.message)
            }
        } , 
        onSuccess:(data)=>{
            setMessage(data.message)
            queryClient.invalidateQueries({queryKey:['advanced_rating']})          
            queryClient.invalidateQueries({queryKey:['reviews']})      
            queryClient.invalidateQueries({queryKey:['product' , id]})
            queryClient.fetchQuery({queryKey:['product' , id]})
            setContent('')
            setRating(1)
        }
    })
    const handleSubmit = ()=>{
        try{
            if(content.length > 255){
                throw new Error("Review cannot exceed 255 char")
            }
            mutation.mutateAsync()
        }catch(err:any){
            setError(err.message)
        }
    }
    return(
        <div className="add-review-wrapper">
            <h3>Add your review</h3>
            <div className="rate-container">
                <h4>Rate the product</h4>
                <Rate rating={rating} setRating={setRating}/>
            </div>
            <textarea value={content} onChange={handleContent} placeholder="Write your own opinion about the product in only 255 char..." className="review-input"></textarea>
            <button onClick={handleSubmit} className="add-review-btn">Submit
            <svg className="submit-icon" viewBox="0 0 20 20">
							<path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
						</svg>
            </button>
            <ErrorMessage error={error} setError={setError} />
            <SuccMessage succMessage={message} setSuccMessage={setMessage}/>
        </div>
    )
}

export default AddReview