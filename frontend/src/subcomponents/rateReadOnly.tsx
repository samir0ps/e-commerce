import { useState } from "react"
import "./rateStyles.css"
const RateRead : React.FC= ()=>{
    const [check_1 , setCheck_1] = useState<boolean>(false)
    const [check_2 , setCheck_2] = useState<boolean>(false)
    const [check_3, setCheck_3] = useState<boolean>(false)
    const [check_4 , setCheck_4] = useState<boolean>(false)
    const [check_5 , setCheck_5] = useState<boolean>(false)

    return(
        <div className="rating-readonly">
                <input type="radio" id="star5" className="star-readonly" name="rating" value="5" checked={check_5} readOnly/>
            <label htmlFor="star5"></label>
                <input type="radio" id="star4" className="star-readonly" name="rating" value="4" checked={true} readOnly/>
            <label htmlFor="star4"></label> 
                <input type="radio" id="star3" className="star-readonly" name="rating" value="3" checked={check_3} readOnly/>
            <label htmlFor="star3"></label>
                <input type="radio" id="star2" className="star-readonly" name="rating" value="2" checked={check_2} readOnly/>
            <label htmlFor="star2"></label>
                <input type="radio" id="star1" className="star-readonly" name="rating" value="1" checked={check_1} readOnly/>
            <label htmlFor="star1"></label>
        </div>

    )
}

export default RateRead