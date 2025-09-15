import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import heartImage from "../../assets/images/shapes/heart-2-1.png";
import bgImage from "../../assets/images/team/team-map-1-1.png";
import WorldVectorMap from "../map/WorldVectorMap";

const WorldMapImpact = () => {
  return (
    <>
      <section className="team-about pt-[200px]">
        <Container>
          <div className="team-about__top">
            <Row className=" align-items-center">
              <Col md={12} lg={7}>
                <div className="block-title">
                  <p>
                    <img src={heartImage} width="15" alt="" />
                    Our Global Impact
                  </p>
                  <h3>
                    Serving communities <br /> across the MENA region.
                  </h3>
                </div>
              </Col>
              <Col md={12} lg={5}>
                <p className="team-about__top-text">
                  Through our dedicated volunteers and ministry partners, Hope For All MENA
                  reaches communities across the Middle East, North Africa, and beyond with
                  hope, education, and transformational resources.
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section className="w-full">
          <div className="bg-transparent rounded-lg p-6 md:p-8 container">
            <div className="map-container">
              <WorldVectorMap
                value="world_mill"
                width="100%"
                color="#000"
              />
            </div>
          </div>
      </section>
    </>
  );
};

export default WorldMapImpact;
