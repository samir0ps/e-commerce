import { useRef, useEffect, Dispatch, SetStateAction, RefObject , forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./rateStyles.css";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";

type PaginationTypes = {
  length: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  ref: ((instance: unknown) => void) | RefObject<HTMLDivElement>;
};

const Pagination = forwardRef((props: PaginationTypes, ref) => {
  const swiperRef = useRef<any>(null);
  const handleSettingPages = (i: number) => {
    props.setPage(i);
    setTimeout(() => {
      swiperRef.current.slideTo(i - 1);
      if (typeof ref === "function") {
        ref(swiperRef.current);
      } else {
        if(ref?.current){
          (ref.current as HTMLDivElement).scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  };
  
  const handleSlideLeft = () => {
    if (props.page > 0) {
      props.setPage(props.page - 1);
      setTimeout(() => {
        swiperRef.current.slideTo(props.page - 2);
        if (typeof ref === "function") {
          ref(swiperRef.current);
        } else {
          if(ref?.current){
            (ref.current as HTMLDivElement).scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    }
    
  };

  const handleSlideRight = () => {
    if (props.page < props.length - 1) {
      props.setPage(props.page + 1);
      setTimeout(() => {
        swiperRef.current.slideTo(props.page - 2 + 1);
      });
    }
    if (typeof ref === "function") {
      ref(swiperRef.current);
    } else {
      if(ref?.current){
        (ref.current as HTMLDivElement).scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(props.page);
    }
  }, [props.page]);

  return (
    <div className="pagination-wrapper">
      <div className="pagination-arrows page-number prev" onClick={handleSlideLeft}>
        <BsChevronDoubleLeft />
      </div>
      <Swiper
        slidesPerView={3}
        slidesPerGroup={1}
        spaceBetween={5}
        className="pagination-container"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        initialSlide={0}
        freeMode={true}
        navigation={false}
      >
        {props.length &&Array(props.length)
          .fill(undefined)
          .map((_, index) => (
            <SwiperSlide
              key={index}
              onClick={() => handleSettingPages(index)}
              className={`${index === props.page ? "current-page-number" : "pagination"} page-number `}
            >
              {index + 1}
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="pagination-arrows next page-number" onClick={handleSlideRight}>
        <BsChevronDoubleRight />
      </div>
    </div>
  );
});

export default Pagination;