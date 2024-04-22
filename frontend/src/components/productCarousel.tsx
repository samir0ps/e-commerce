import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/carousel.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQuery } from '@tanstack/react-query';
import 'react-lazy-load-image-component/src/effects/blur.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';



const ProductCarousel = () => {
    const query = useQuery({
        queryKey:['carousels'] , 
        queryFn:async()=>{
            const response = await axios.get("http://localhost:3000/api/product/get-carousels")
            return response.data
        }
    })
    const breakpoints = {
            100: {
                slidesPerView: 1.3,
                spaceBetween: 10,
                slidesPerGroup:1
                },
            420: {
            slidesPerView: 2.3,
            spaceBetween: 20,
            slidesPerGroup:2
            },
            500: {
            slidesPerView: 2.3,
            spaceBetween: 30,
            slidesPerGroup:2
            },
            1024: {
            slidesPerView: 3.3,
            spaceBetween: 40,
            slidesPerGroup:3
            },
        };
        const navigate = useNavigate()
        const handleNavigating = (id:string)=>{
            navigate(`/product/${id}`)
        }
return (
    <div className="carousels-container">
            {query && Array.isArray(query.data) && query.data.map((carousel)=><Swiper
            className='swiper-products'
            modules={[Navigation]}
            spaceBetween={10} 
            slidesPerView={2}
            slidesPerGroup={3}
            speed={500}
            navigation= {{
                prevEl:".prev-arrow",
                nextEl:".next-arrow"

            }}    
            breakpoints={breakpoints}
            key={carousel.productSwiperId}
            >
            {carousel.products && Array.isArray(carousel.products) && carousel.products.map((product:any) => (
                <SwiperSlide className='swiper-slide-products' key={product.id} onClick={()=>handleNavigating(product.product.id)}>
                    <LazyLoadImage effect='blur' src={product.product.images[0].url} />
                </SwiperSlide>
            ))}
            <div style={{background:"var(--primary)", color:"var(--third)"}} className="next-arrow arrow">
                <FaChevronRight/>
            </div>
            <div style={{background:"var(--primary)", color:"var(--third)"}} className="prev-arrow arrow">
                <FaChevronLeft/>
            </div>
            </Swiper>)
}
    </div>
);
};

export default ProductCarousel;
