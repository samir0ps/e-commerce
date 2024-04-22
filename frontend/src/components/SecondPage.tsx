import { useQueryClient } from "@tanstack/react-query"
import Reviews from "../subcomponents/reviews"
import "./styles/hero.css"
import { useState} from "react"
import Description from "./description"
import { useParams } from "react-router-dom"
import {motion} from "framer-motion"
const SecondPage = ()=>{
    const [tab , setTab] = useState<string>("reviews")
    const handleSettingTabDescription = ()=>{
        setTab("Description")
    }
    const handleSettingTabReviews = ()=>{
        setTab("reviews")
    }
    const queryClient = useQueryClient()
    const {id} = useParams()
    const query = queryClient.getQueryData<{product : {description:{content:string}[]}}>(['product' ,id])
    const product = query?.product
    return (
        <div className="about-product">
    <div className="tabs-headers-second">
        <input type="radio" id="tab-reviews" name="tabs-headers-second" onChange={handleSettingTabReviews} className="tabCheck" />
        <input type="radio" id="tab-description" name="tabs-headers-second" onChange={handleSettingTabDescription} className="tabCheck" />
        <label htmlFor="tab-reviews" className="tab categories-h">
            <motion.div animate={tab==="reviews" ? {color:"#dbd3c9"} : {}} transition={{type:"just" , duration:0}} className="tab-header" >Reviews</motion.div>
        </label>
        <label htmlFor="tab-description" className="tab description-h">
            <motion.div animate={tab==="Description" ? {color:"#dbd3c9"} : {}} className="tab-header">Description</motion.div>
        </label>
        <motion.span transition={{type:"spring" , stiffness:300 , damping:10 , duration:0.1}} animate={tab==="reviews" ? {translateX:0} : {translateX:"100%"}} style={{borderRadius:".5rem"}} className="glider"></motion.span>
    </div>
    <hr />
    <div className="aboutProduct-content">
        <Reviews tab={tab}/>
        <Description tab={tab} description={product ? product.description : null}/>
    </div>
</div>

    )
}

export default SecondPage