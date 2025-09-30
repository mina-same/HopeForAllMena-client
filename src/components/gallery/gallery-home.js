import React from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import GalleryCard from "./gallery-card";

// Import magazine giveaway images
import magazineImage1 from "../../assets/images/magazines/give away/01.jpeg";
import magazineImage2 from "../../assets/images/magazines/give away/02.jpeg";
import magazineImage3 from "../../assets/images/magazines/give away/03.jpeg";
import magazineImage4 from "../../assets/images/magazines/give away/04.jpeg";
import magazineImage5 from "../../assets/images/magazines/give away/05.jpeg";
import magazineImage6 from "../../assets/images/magazines/give away/06.jpeg";
import magazineImage7 from "../../assets/images/magazines/give away/07.jpeg";
import magazineImage8 from "../../assets/images/magazines/give away/08.jpeg";
import magazineImage9 from "../../assets/images/magazines/give away/09.jpeg";
import magazineImage10 from "../../assets/images/magazines/give away/10.jpeg";
import magazineImage11 from "../../assets/images/magazines/give away/11.jpeg";
import magazineImage12 from "../../assets/images/magazines/give away/12.jpeg";
import magazineImage13 from "../../assets/images/magazines/give away/13.jpeg";
import magazineImage14 from "../../assets/images/magazines/give away/14.jpeg";

// Import resources images
import resourceImage1 from "../../assets/images/resources/about-1-1.jpg";
import resourceImage2 from "../../assets/images/resources/about-1-2.jpg";

// Swiper v11 uses modules via props

const GalleryHome = () => {
  const galleryOptions = {
    spaceBetween: 100,
    slidesPerView: 4,
    autoplay: { delay: 5000 },
    breakpoints: {
      0: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      425: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      575: {
        spaceBetween: 30,
        slidesPerView: 2
      },
      767: {
        spaceBetween: 30,
        slidesPerView: 2
      },
      991: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      1289: {
        spaceBetween: 20,
        slidesPerView: 4
      },
      1440: {
        spaceBetween: 20,
        slidesPerView: 5
      }
    }
  };
  return (
    <section className="gallery-home-one">
      <Container fluid>
        <Swiper modules={[Autoplay]} {...galleryOptions}>
          {/* Magazine Giveaway Images */}
          <SwiperSlide>
            <GalleryCard image={magazineImage1} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage2} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage3} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage4} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage5} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage6} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage7} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage8} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage9} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage10} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage11} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage12} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage13} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage14} />
          </SwiperSlide>
          
          {/* Resource Images */}
          <SwiperSlide>
            <GalleryCard image={resourceImage1} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={resourceImage2} />
          </SwiperSlide>
        </Swiper>
      </Container>
    </section>
  );
};

export default GalleryHome;
