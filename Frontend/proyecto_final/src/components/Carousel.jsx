import React, { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../assets/css/index.css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import Cerveceria from "../assets/img/polarcitas.jpg";
import Productos from "../assets/img/productos.jpg";
import PepsiCola from "../assets/img/pepsi_cola.jpg";

export const Carousel = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 500)}s`;
  };

  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper w-[90%] h-auto"
      >
        <SwiperSlide>
          <div className="w-72 mx-auto my-auto block">
            <img src={Productos} alt="Productos varios" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-72 mx-auto my-auto block">
            <img src={Cerveceria} alt="Cervezas"/>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-72 mx-auto my-auto block">
            <img src={PepsiCola} alt="Pepsi-Cola Venezuela" />
          </div>
        </SwiperSlide>
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
};
