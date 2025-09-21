import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import factCounterService from "../services/factCounterService";

// Default fallback data
const DEFAULT_FACT_COUNTER_DATA = [
  {
    count: 8860,
    textKey: "factCounter.members"
  },
  {
    count: 456,
    textKey: "factCounter.leadersTraining"
  },
  {
    count: 55,
    textKey: "factCounter.publishedBooks"
  },
  {
    count: 10000,
    textKey: "factCounter.givenMagazines"
  }
];
const FactCounter = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
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
            textKey: "factCounter.members"
          },
          {
            count: stats.leadersTraining,
            textKey: "factCounter.leadersTraining"
          },
          {
            count: stats.publishedBooks,
            textKey: "factCounter.publishedBooks"
          },
          {
            count: stats.givenMagazines,
            textKey: "factCounter.givenMagazines"
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
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .fact-counter h3,
          .fact-counter p {
            text-align: center;
          }
        `}</style>
      )}
      <section className="fact-counter" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
          <Row>
            {factCounterData.map(({ count, textKey }, index) => (
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
                <p>{t(textKey)}</p>
                <a href="#none">+</a>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default FactCounter;
