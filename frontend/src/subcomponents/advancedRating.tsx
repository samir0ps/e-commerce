import { FC, useRef } from "react"
import "../components/styles/hero.css"
import {useInView , motion} from "framer-motion"
import Stars from "./stars"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
import LoadingComponent from "../components/Loading"
type propsType = {
    rating:number | undefined , 
    length: number | undefined
}
const AdvancedRating:FC<propsType> = ({rating , length})=>{
    const ref = useRef(null)
    const {id} = useParams()
    const isInView = useInView(ref ,{once:true})
    const query = useQuery({
        queryKey:['advanced_rating'] , 
        queryFn:async()=>{
            const response =await axios.get(`http://localhost:3000/api/product/advanced-rating?productId=${id}`)
            return response.data
        }
    })
    return(
        <div className="advanced-rating-wrapper" ref={ref}>
            {!query.isPending ?<div className="adv-rating-container">
                {query?.data?.message ? null:<div className="perc-container" >
                    <div className="intro-ad-rating">
                        <div className="rate-stars-container">
                            {rating !== undefined && <Stars readonly={true} rating={rating}/>}
                            <p className="numbers-rating"><span>{Math.ceil(Number(rating))}</span> out of <span>5</span></p>
                        </div>
                        <p className="total-reviews">{length} Total reviews</p>
                    </div>
                    {query?.data?.five>=0 &&<div className="5star-container indicator-wrapper" >
                        <p>5 Star</p>
                        <div className="5star-indicator indicator-container" ><motion.div initial={{width:0}} animate={{width: isInView ? `${query?.data?.five || 0}%`:"0%" }} transition={{duration:0.3,delay:.3}} className={`indicator-color`}></motion.div></div>
                        <p>{query.data.five? (query?.data?.five).toFixed(2) : 0 }%</p>
                    </div>}
                    {query?.data?.four>=0&& <div className="4star-container indicator-wrapper">
                        <p>4 Star</p>
                        <div className="4star-indicator indicator-container" ><motion.div initial={{width:0}} animate={{width: isInView ? `${query?.data?.four || 0}%`:"0%" }} transition={{duration:0.3,delay:.3}} className={`indicator-color`}></motion.div></div>
                        <p>{query.data.four? (query?.data?.four).toFixed(2) : 0 }%</p>
                    </div>}
                    {query?.data?.three>=0 && <div className="3star-container indicator-wrapper">
                        <p>3 Star</p>
                        <div className="3star-indicator indicator-container" ><motion.div initial={{width:0}} animate={{width: isInView ? `${query?.data?.three || 0}%`:"0%" }} transition={{duration:0.3,delay:.3}} className={`indicator-color`}></motion.div></div>
                        <p>{query.data.three? (query?.data?.three).toFixed(2) : 0 }%</p>
                    </div>}
                    {query?.data?.two>=0&& <div className="2star-container indicator-wrapper">
                        <p>2 Star</p>
                        <div className="2star-indicator indicator-container" ><motion.div initial={{width:0}} animate={{width: isInView ? `${query?.data?.two || 0}%`:"0%" }} transition={{duration:0.3,delay:.3}} className={`indicator-color`}></motion.div></div>
                        <p>{query.data.two? (query?.data?.two).toFixed(2) : 0 }%</p>
                    </div>}
                    {query?.data?.one>=0&& <div className="1star-container indicator-wrapper">
                        <p>1 Star</p>
                        <div className="1star-indicator indicator-container" ><motion.div initial={{width:0}} animate={{width: isInView ? `${query?.data?.one || 0}%`:"0%" }} transition={{duration:0.3,delay:.3}} className={`indicator-color`}></motion.div></div>
                        <p>{query.data.one? (query?.data?.one).toFixed(2) : 0 }%</p>
                    </div>}
            </div>}
                </div> : <LoadingComponent/>}
            
        </div>
    )
}

export default AdvancedRating