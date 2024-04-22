import {  useRef, useState } from "react"
import "./styles/categories.css"
import {motion } from "framer-motion"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const HomeCategories = ()=>{
    const ref  = useRef(null)
    const [categories , setCategories] = useState<any[]>([])
    useQuery({
        queryKey:['suggested_categories'] ,
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/product/get-suggested")
            setCategories(response.data)
            return response.data
        }
    })

    return(
        <div className="categories-wrapper">
            <h1 className="categories-header">Categories</h1>
            <div className="categories-container" ref={ref}>
                {categories.length > 0 && categories.map((category)=>(
                    <motion.div whileHover={{scale:1.1 ,transition:{delay:0}}}  key={category.category.id} className="category-container">
                        <div className="category-image">
                            <LazyLoadImage effect="blur" src={category.category.image[0].url} className="new-arrival-img"/>
                        </div>
                        <div className="category-name">
                            <p>
                                {category.category.name}
                            </p>
                        </div>
                        
                    </motion.div>
                ))
                }
            </div>
        </div>
    )
}

export default HomeCategories