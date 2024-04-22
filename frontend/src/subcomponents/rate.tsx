import { FC, useState } from "react";
import "./rateStyles.css"
import { FaStar } from "react-icons/fa6";
import {motion} from "framer-motion"
type ratingProps = {
    rating:number ; 
    setRating : (vlaue:number)=>void ;
}

const Rate:FC<ratingProps> = ({rating , setRating})=>{
    const [i , setI] = useState<number>(0)
    const handleSettingRating = (i:number)=>{
        setRating(i)
    }
    const handleSettingI = (index:number)=>{
        setI(index)
    }
    const handleUnSettingI= ()=>{
        setI(-1)
    }
    return(
        <div className="rating">
                {Array(5).fill(undefined).map((_ , index)=>(
                    <label key={index}>
                        <input type="radio" name="rating-star" className="star-radio" onChange={()=>{handleSettingRating(index+1)}} value={index+1}/>
                        <motion.div onMouseEnter={()=>handleSettingI(index)} onMouseLeave={()=>handleUnSettingI()} whileHover={{y:-5}} className={`${index <= i ? "checked-rating":index <= rating-1 && i === -1 && i < rating-1 ? "checked-rating" : "unChecked-rating"}`}>
                            <FaStar/>
                        </motion.div>
                    </label>
                ))}
        </div>

    )
}

export default Rate