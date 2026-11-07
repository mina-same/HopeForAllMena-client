import React from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import GalleryCard from "./gallery-card";
import { useI18next } from "gatsby-plugin-react-i18next";

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

// Alt text for the magazine giveaway photos (01-14.jpeg): [English, Arabic]
const captions = [
  ["A volunteer hands Magazines of Hope to women and children at a street market", "متطوع يوزع مجلات الرجاء على السيدات والأطفال في سوق شعبي"],
  ["A volunteer gives a magazine to a young boy on a busy street", "متطوع يقدم مجلة لطفل صغير في شارع مزدحم"],
  ["Volunteers share magazines with families at an outdoor market", "متطوعون يوزعون المجلات على العائلات في سوق مفتوح"],
  ["A volunteer offers a magazine at a market stall", "متطوع يقدم مجلة عند أحد أكشاك السوق"],
  ["Children read the magazines a volunteer handed them", "أطفال يقرؤون المجلات التي قدمها لهم أحد المتطوعين"],
  ["A volunteer gives a magazine to a child in a stroller", "متطوع يقدم مجلة لطفل في عربة أطفال"],
  ["A volunteer hands magazines to passengers in a microbus", "متطوع يوزع المجلات على ركاب ميكروباص"],
  ["A volunteer gives a magazine to a girl walking home from school", "متطوع يقدم مجلة لطفلة في طريق عودتها من المدرسة"],
  ["A volunteer hands magazines to passengers in a tuk-tuk", "متطوع يوزع المجلات على ركاب توك توك"],
  ["Children reading their new magazines on the street", "أطفال يقرؤون مجلاتهم الجديدة في الشارع"],
  ["Volunteers give magazines to children on a crowded street", "متطوعون يوزعون المجلات على الأطفال في شارع مزدحم"],
  ["Children receive magazines from a volunteer", "أطفال يستلمون المجلات من أحد المتطوعين"],
  ["Families and children receive magazines on the street", "عائلات وأطفال يستلمون المجلات في الشارع"],
  ["Children holding their magazines at the giveaway", "أطفال يحملون مجلاتهم أثناء التوزيع"],
];

const GalleryHome = () => {
  const { language } = useI18next();
  const isAr = language === "ar";
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
            <GalleryCard image={magazineImage1} alt={captions[0][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage2} alt={captions[1][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage3} alt={captions[2][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage4} alt={captions[3][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage5} alt={captions[4][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage6} alt={captions[5][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage7} alt={captions[6][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage8} alt={captions[7][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage9} alt={captions[8][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage10} alt={captions[9][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage11} alt={captions[10][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage12} alt={captions[11][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage13} alt={captions[12][isAr ? 1 : 0]} />
          </SwiperSlide>
          <SwiperSlide>
            <GalleryCard image={magazineImage14} alt={captions[13][isAr ? 1 : 0]} />
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
