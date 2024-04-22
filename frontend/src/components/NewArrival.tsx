import "./styles/newArrival.css"
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";
const NewArrival = ()=>{
    const [products , setProducts] = useState<any[]>([])
    useQuery({
        queryKey: ['new_arrival'],
        queryFn: async () => {
            const response = await axios.get("http://localhost:3000/api/product/new-arrival");
            if (response.data) {
                response.data.forEach((tag: any) => {
                    tag.product.forEach((p: any) => {
                        const exist = products.find(pp => pp.id === p.product.id);
                        if (!exist) {
                            setProducts(prev => [...(prev || []), p.product]);
                        }
                    });
                });
            }
            return response.data;
        }
    });
    
    
    return(
        <div className="new-arrival">
            {products &&products.length > 0&&<div className="new-products-wrapper">
                <h1 className="new-arrival-header">New Arrival</h1>
                <div className="new-products-container" >
                    {products.map((product )=>
                            <div  key={product.id} className="product-container">
                                <div className="product-image">
                                    <LazyLoadImage effect="blur" src={product.images[0].url} className="img" />
                                </div>
                                <p className="product-price">${product.price}</p>
                                <div className="hover-display">
                                    <h3 className="hover-display-h">
                                        Description
                                    </h3>
                                    <p className="description">
                                        {product.preview.content}
                                    </p>
                                </div>
                                <p className="tag"><span>Click me for more...</span></p>
                            </div>)}
                        </div>
                    
                    
                </div>}
            </div>
    )
}

export default NewArrival