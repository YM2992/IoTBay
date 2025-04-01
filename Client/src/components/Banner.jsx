import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import img1 from "/assets/Banner/Banner_5070.jpg";
// import img2 from "/assets/Banner/Banner_Raspberry_Pi.jpg";
// import img3 from "/assets/Banner/Banner_Router.jpg";

function Banner() {
  return (
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
      className="mySwiper"
    >
      <SwiperSlide>{/* <img src={img1}></img> */}</SwiperSlide>
      <SwiperSlide>{/* <img src={img2}></img> */}</SwiperSlide>
      <SwiperSlide>{/* <img src={img3}></img> */}</SwiperSlide>
    </Swiper>
  );
}

export default Banner;
