import React, { useState } from "react";
import { Link } from "gatsby";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import image1 from "../../assets/images/resources/service-1-1.jpg";
import image2 from "../../assets/images/resources/service-1-2.jpg";
import image3 from "../../assets/images/resources/service-1-3.jpg";
import hoverImage1 from "../../assets/images/gallery/gallery-2-1.jpg";
import hoverImage2 from "../../assets/images/gallery/gallery-2-2.jpg";
import hoverImage3 from "../../assets/images/gallery/gallery-2-3.jpg";

const SERVICE_TWO_DATA = [
  {
    extraClassName: "background-primary",
    image: image1,
    hoverImage: hoverImage1,
    title: "Teaching",
    text: "Start Donating",
    link: "#"
  },
  {
    extraClassName: "background-secondary",
    image: image2,
    hoverImage: hoverImage2,
    title: "Preaching",
    text: "Let's Join",
    link: "#"
  },
  {
    extraClassName: "background-base",
    image: image3,
    hoverImage: hoverImage3,
    title: "Healing",
    text: "Quick Funding",
    link: "#"
  }
];

const ServiceTwo = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sliderOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      375: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      575: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1199: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };
  return (
    <section className="service-two">
      <Container>
        <Swiper {...sliderOptions}>
          {SERVICE_TWO_DATA.map(
            ({ extraClassName, image, hoverImage, title, text, link }, index) => (
              <SwiperSlide key={`service-two-key-${index}`}>
                <div
                  className={`service-two__box ${extraClassName}`}
                  style={{ backgroundImage: `url(${hoveredIndex === index ? hoverImage : image})` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  role="button"
                  tabIndex="0"
                >
                  <div className="service-two__box-inner">
                    <i className="fas fa-heart" style={{color: "#FFD701"}}></i>
                    <p>{text}</p>
                    <h3>
                      <Link to={link} style={{ ':hover': { color: '#ffffff' } }}>{title}</Link>
                    </h3>
                    <Link className="service-two__box-link" to={link}>
                      <i className="far fa-angle-right"></i>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </Container>
    </section>
  );
};

export default ServiceTwo;
