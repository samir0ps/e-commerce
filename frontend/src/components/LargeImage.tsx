import { Dispatch, FC, SetStateAction , useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { Swiper, SwiperSlide  } from "swiper/react";
import "./styles/largeImage.css"
import 'swiper/css/zoom';

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Zoom } from "swiper/modules";
type PropsType = {
    images : {
        url:string ; 
        id:string ; 
    }[] | undefined, 
    setOpenLarge:Dispatch<SetStateAction<boolean>> ; 
    openLarge: boolean ; 
    imageNumber : number
}

const LargeImage:FC<PropsType> = ({images , openLarge , setOpenLarge , imageNumber})=>{
    const handleClose = ()=>{
        setOpenLarge(false)
    }
    const ref = useRef<any>(null)
    const handleSlideLeft = (i : number)=>{
        if(i === 0){
            ref.current.slideTo(typeof images?.length=== "number" && images?.length-1)
        }
        else{
            ref.current.slideTo(i-1)

        }
    }
    useEffect(()=>{
            ref.current.slideTo(imageNumber)
    } , [imageNumber])
    const handleSlideRight = (i:number)=>{
        if(i === (typeof images?.length === "number" && images?.length-1)){
            ref.current.slideTo(0)
        }else{
            ref.current.slideTo(i+1)
        }
    }
    return (
        <div className="large-image-container">
            <Swiper breakpoints={{
                720:{
                    allowTouchMove:false
                }
            } }
            modules={[Zoom]}
            allowTouchMove={true}
            loop={true}
            zoom={true}
            onSwiper={(swiper)=>ref.current = swiper}
            slidesPerView={1} slidesPerGroup={1}  className={`${openLarge ? "open-large": "close-large"} large-image-wrapper`}>

                <button className="close-large-image-button" onClick={handleClose}><MdClose/></button>
                {images&& Array.isArray(images) && images.map((image , i)=><SwiperSlide key={i} className="slide-large-image">
                    <button onClick={()=>handleSlideRight(i)} className="large-image-arrow image-right"><BsChevronRight/></button>
                    <img src={image.url} alt={`image_${i}`}></img> 
                    <button onClick={()=>handleSlideLeft(i)} className="large-image-arrow image-left">
                        <BsChevronLeft/>
                    </button>
                </SwiperSlide>)}
            </Swiper>

        </div>
    )
}

export default LargeImage