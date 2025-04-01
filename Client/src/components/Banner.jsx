import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import img1 from "/assets/Banner/Banner_5070.jpg";
import img2 from "/assets/Banner/Banner_Raspberry_Pi.jpg";
import img3 from "/assets/Banner/Banner_Router.jpg";

const SwiperSlideStyle = {
  textAlign: "center",
  fontSize: "18px",
  //   background: "#00285B",
  background: "rgba(0, 40, 91, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const imgStyle = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const banners = [img1, img2, img3];

function Banner() {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      style={{ width: "90%", height: "90%" }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index} style={SwiperSlideStyle}>
          <div style={{ margin: "2rem" }}>
            <img style={imgStyle} src={banner}></img>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Banner;
