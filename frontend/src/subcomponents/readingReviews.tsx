import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"
import LoadingComponent from "../components/Loading"
import Stars from "./stars"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "./rateStyles.css"
import { useRef, useState } from "react"
import Pagination from "./pagination"
import Avatar from "../components/Avatar";
import { useParams } from "react-router-dom";
const ReadingReviews = ()=>{
    const ref = useRef<HTMLDivElement>(null)
    const [page ,setPage] = useState<number>(0)
    const {id} = useParams()
    const query = useQuery({
        queryKey:['reviews' , page] ,
        queryFn:async()=>{
            const response = await axios.get(`http://localhost:3000/api/product/get-all-review?page=${page}&productId=${id}`)
            return response.data
        } , 
        placeholderData:keepPreviousData
    })
    const reviews = query?.data?.reviews
    const length = Math.ceil(query?.data?.length/5)
    const TimeReview =(timeStamp:string)=>{
        const date = new Date(timeStamp) 
        const day = date.getDate() ; 
        const month = date.toLocaleString("default" , {month:"long"})
        return `${month} ${day}`
    }
    
    return (
        <div className="reading-reviews-container" ref={ref}>
            {!query.isFetching ? 
            <div className="reading-reviews-wrapper">
                {Array.isArray(reviews) && reviews.length>0? reviews.map(review=>
                (<div key={review.id} className="review-container">
                    <div className="review-user">
                        {review.user.images[0]?<div className="user-image-container-review">
                            <LazyLoadImage effect="blur" src={review.user.images[0].url}></LazyLoadImage>
                        </div>:<Avatar openOptions={false} setOpenOptions={()=>null} classSpecific="nav-bar-avatar"/>}
                        <div className="user-name-container">
                            <p>{review.user.firstName} {review.user.lastName}</p>
                        </div>
                        <p className="Date">{TimeReview(review.createdAt)}</p>
                    </div>
                    <Stars readonly={true} rating={review.rating}/>
                    <p className="review-content">
                        {review.content}
                    </p>
                </div>)):<p>No reviews Yet!</p>}
            </div> : <LoadingComponent/> }
                    {length>0 &&<Pagination ref={ref} length={length} page={page} setPage={setPage}/>}
        </div>
    )
}

export default ReadingReviews