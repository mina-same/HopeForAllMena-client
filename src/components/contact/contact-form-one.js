import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import BlockTitle from "../block-title";
import contactMessageService from "../../services/contactMessageService";

const ContactFormOne = () => {
  const { t } = useTranslation('Contact');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // Get client IP and user agent for tracking
      const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => null);
      const ipData = ipResponse ? await ipResponse.json() : null;

      const messageData = {
        ...formData,
        type: 'general',
        preferredContactMethod: 'email',
        source: 'website',
        ipAddress: ipData?.ip || 'unknown',
        userAgent: navigator.userAgent
      };

      await contactMessageService.createContactMessage(messageData);

      setSubmitStatus('success');
      setErrorMessage('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .form-one input[type="text"], 
          .form-one input[type="email"], 
          .form-one input[type="tel"], 
          .form-one textarea {
            padding-left: 0 !important;
            padding-right: 30px !important;
            text-align: right;
          }
          .form-one .thm-btn {
            direction: rtl;
          }
        `}</style>
      )}
      <section className="contact-page pt-120 pb-80" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
        <Row>
          <Col lg={5}>
            <div className="contact-page__content mb-40">
              <BlockTitle
                title={t('form.title')}
                tagLine={t('form.tagLine')}
              />
              <p className="block-text mb-30 pr-10">
                {t('form.description')}
              </p>
              <div className="footer-social black-hover">
                <a href="https://www.facebook.com/profile.php?id=61556019641884" aria-label="facebook">
                  <i className="fab fa-facebook-square"></i>
                </a>
                <a href="https://www.facebook.com/profile.php?id=100083974131611" aria-label="facebook">
                  <i className="fab fa-facebook-square"></i>
                </a>
              </div>
            </div>
          </Col>
          <Col lg={7}>
            <form className="contact-form-validated contact-page__form form-one mb-40" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="form-control">
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={t('form.namePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="email" className="sr-only">
                    email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t('form.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="phone" className="sr-only">
                    phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder={t('form.phonePlaceholder')}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="subject" className="sr-only">
                    subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder={t('form.subjectPlaceholder')}
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    minLength="5"
                  />
                </div>
                <div className="form-control form-control-full">
                  <label htmlFor="message" className="sr-only">
                    message
                  </label>
                  <textarea
                    name="message"
                    placeholder={t('form.messagePlaceholder')}
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    minLength="10"
                  ></textarea>
                </div>
                <div className="form-control form-control-full">
                  <button
                    type="submit"
                    className="thm-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('form.submitting') : t('form.submitButton')}
                  </button>
                </div>
              </div>
            </form>
            <div className="result">
              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <p>{t('form.successMessage')}</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="alert alert-danger">
                  {errorMessage ? (
                    <div>
                      <p><strong>{t('form.errorTitle')}</strong></p>
                      <div style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
                        {errorMessage}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p>{t('form.requirementsTitle')}</p>
                      <ul style={{ marginTop: '10px', paddingLeft: currentLanguage === 'ar' ? '0' : '20px', paddingRight: currentLanguage === 'ar' ? '20px' : '0' }}>
                        <li>{t('form.requirements.name')}</li>
                        <li>{t('form.requirements.email')}</li>
                        <li>{t('form.requirements.subject')}</li>
                        <li>{t('form.requirements.message')}</li>
                        <li>{t('form.requirements.phone')}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    </>
  );
};

export default ContactFormOne;
