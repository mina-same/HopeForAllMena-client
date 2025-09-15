import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import { Container, Row, Col } from "react-bootstrap";
import factCounterService from "../services/factCounterService";

// Default fallback data
const DEFAULT_FACT_COUNTER_DATA = [
  {
    count: 8860,
    text: "Members"
  },
  {
    count: 456,
    text: "Leaders Training"
  },
  {
    count: 55,
    text: "Published books"
  },
  {
    count: 10000,
    text: "given Magazines"
  }
];
const FactCounter = () => {
  const [counter, setCounter] = useState({
    startCounter: false
  });
  const [factCounterData, setFactCounterData] = useState(DEFAULT_FACT_COUNTER_DATA);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchFactCounterData = async () => {
      try {
        const response = await factCounterService.getStats();
        const stats = response.data;
        
        // Transform backend data to component format
        const transformedData = [
          {
            count: stats.members,
            text: "Members"
          },
          {
            count: stats.leadersTraining,
            text: "Leaders Training"
          },
          {
            count: stats.publishedBooks,
            text: "Published books"
          },
          {
            count: stats.givenMagazines,
            text: "given Magazines"
          }
        ];
        
        setFactCounterData(transformedData);
      } catch (error) {
        console.error('Failed to fetch fact counter data:', error);
        // Keep default data on error
      } finally {
        setLoading(false);
      }
    };

    fetchFactCounterData();
  }, []);

  const onVisibilityChange = (isVisible) => {
    if (isVisible) {
      setCounter({ startCounter: true });
    }
  };
  return (
    <section className="fact-counter">
      <Container>
        <Row>
          {factCounterData.map(({ count, text }, index) => (
            <Col
              md={6}
              lg={3}
              className="text-center"
              key={`fact-counter-key-${index}`}
            >
              <h3>
                <VisibilitySensor
                  onChange={onVisibilityChange}
                  offset={{ top: 10 }}
                  delayedCall
                >
                  <CountUp 
                    end={counter.startCounter ? count : 0} 
                    duration={2.5}
                    separator=","
                  />
                </VisibilitySensor>
              </h3>
              <p>{text}</p>
              <a href="#none">+</a>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FactCounter;
