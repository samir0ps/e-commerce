import { useQueryClient } from "@tanstack/react-query"
import "../components/styles/hero.css"
import AddReview from "./addReview"
import AdvancedRating from "./advancedRating"
import ReadingReviews from "./readingReviews"
import { useParams } from "react-router-dom"
type productProps = {
    product:{
        rating:number, 
        reviews : {
            rating : number ,
            content:string
        }[]
    }
}
const Reviews = ({tab}:{tab:string})=>{
    const queryClient = useQueryClient()
    const{id} = useParams()
    const query = queryClient.getQueryData<productProps>(['product'  , id])
    const rating = query?.product.rating
    const length = query?.product.reviews.length
    return (
        <div className={`${tab==="reviews" ? "enabled" : "disabled"} reviews-wrapper`}>
            <div className="reviews-1st">
                <AdvancedRating length={length} rating={rating}/>
                <AddReview/>
            </div>
            <ReadingReviews/>
        </div>
    )
}

export default Reviews