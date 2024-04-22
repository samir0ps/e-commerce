import { Swiper, SwiperSlide } from "swiper/react";
import {  useRef, useState } from "react";
import { Navigation, EffectFade, Thumbs, FreeMode  , Pagination} from "swiper/modules";


import "./swiper.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import 'swiper/css/pagination';

import { useQueryClient } from "@tanstack/react-query";
import LargeImage from "../components/LargeImage";
import { useParams } from "react-router-dom";

const ProductCarousel: React.FC<{colorSelected:string , colors:{name:string , id:string, image:{id:string , url:string}[]}[]}> = ({colorSelected , colors}) => {
const queryClient = useQueryClient()
const {id} = useParams()
const product = queryClient.getQueryData<{product:{images:{id:string ; url:string}[]}}>(['product' , id])
const thenum :number = colorSelected !== 'color-main' ? Number(colorSelected.replace(/^\D+/g, '')):0;
const images =colorSelected=== "color-main" ? product?.product.images : colors[thenum].image
const swiperRef = useRef<any>(null)
const thumbRef = useRef<any>(null)
const [selectedImages , setSelectedImage] =useState<number>(0)
const [openLarge , setOpenLarge] =useState<boolean>(false)
const [imageNumber , setImageNumber] = useState<number>(0)
const handleSlideChange = (i:number) => {
        swiperRef.current.slideTo(i)
        thumbRef.current.slideTo(i-1)
        setSelectedImage(i)
    };
    const handleOpenLarge = (index:number)=>{
        setOpenLarge(true)
        setImageNumber(index)
    }
return (
    <>
        <Swiper
            modules={[FreeMode, Navigation, Thumbs ]}
            freeMode={true}
            watchSlidesProgress={true}
            slidesPerView={4.5}
            spaceBetween={10}
            loop={false}
            direction="horizontal"
            onSwiper={swiper=>thumbRef.current = swiper}
            className="swiper-thumb"            
            breakpoints={{961:{
                direction:"vertical"
            }}}
        >
            {images && images.map((image , index)=>(
                <SwiperSlide onMouseEnter={()=>{handleSlideChange(index)}}  key={image.id} className={`${selectedImages === index ? "image-selected":"unSelected-image"} slide-product-thumb`}>
                    <img src={image.url} className="image-product-thumb" alt="Mac 1" />
                </SwiperSlide>
            ))}
            
        </Swiper>
        <Swiper
            modules={[Navigation, EffectFade, Thumbs,Pagination]}
            effect="fade"
            breakpoints={{720:{
                allowTouchMove:false , 
                
            } , 0 :{
                allowTouchMove:true,
                
            }}}
            className="swiper-product"
            pagination={{
                clickable:false , 
                type:"bullets"
                , 
            }}
            slidesPerView={1}
            loop={true}
            onSwiper={(swiper)=>swiperRef.current=swiper}
            noSwiping
            
        >
            
            {images && images.map((image , index)=>(
                <SwiperSlide key={image.id} className="slide-product">
                    <div className="image-carousel-container">
                        <img onClick={()=>handleOpenLarge(index)} src={image.url} className="image-product" alt="Mac 1" />

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <LargeImage imageNumber={imageNumber} openLarge={openLarge} setOpenLarge={setOpenLarge} images={images}></LargeImage>
    </>
);
};

export default ProductCarousel;
