import { FaStar } from "react-icons/fa6";
import {motion} from  "framer-motion"
import '../pages/styles/searchPage.css'
import { FC } from "react";
type propsTypes ={
    readonly : boolean ; 
    rating :number ; 
}
const  Stars:FC<propsTypes> = ({readonly , rating})=>{
    return (
        <div className="stars-container">
            {Array(5).fill(undefined).map((_ , index)=>(
                <motion.div key={index} whileHover={readonly ? {} :{scale:1.1}} className={`${readonly ? "readonly-star" : "action-star"} ${index+1 <= Math.round(rating) ? "star-covered" : "star-uncovered"} star-container`}>
                    <FaStar />
                </motion.div>
            ))}
        </div>
    )
}
export default Stars