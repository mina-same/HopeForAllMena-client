import React from 'react';
import { graphql } from 'gatsby';
import { Link, useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { Home, Mail, ArrowLeft, ArrowRight, Users, GraduationCap, BookOpen, Heart } from 'lucide-react';
import Layout from '../components/layout';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';
import '../assets/css/not-found.css';

const quickLinks = [
  { key: 'about', to: '/about', Icon: Users },
  { key: 'training', to: '/training', Icon: GraduationCap },
  { key: 'books', to: '/books', Icon: BookOpen },
  { key: 'donate', to: '/donate', Icon: Heart },
];

// "0" of the 404, drawn as a compass whose needle searches for the way home
const CompassZero = () => (
  <svg className="nf-compass" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="54" className="nf-compass__ring" />
    <circle cx="60" cy="60" r="42" className="nf-compass__inner" />
    {[0, 90, 180, 270].map((deg) => (
      <line key={deg} x1="60" y1="10" x2="60" y2="20" className="nf-compass__tick" transform={`rotate(${deg} 60 60)`} />
    ))}
    {[45, 135, 225, 315].map((deg) => (
      <line key={deg} x1="60" y1="12" x2="60" y2="17" className="nf-compass__tick nf-compass__tick--minor" transform={`rotate(${deg} 60 60)`} />
    ))}
    <g className="nf-compass__needle">
      <path d="M60 24 L68 60 L52 60 Z" className="nf-compass__needle-north" />
      <path d="M60 96 L68 60 L52 60 Z" className="nf-compass__needle-south" />
    </g>
    <circle cx="60" cy="60" r="5" className="nf-compass__pin" />
  </svg>
);

const NotFoundPage = () => {
  const { t } = useTranslation('NotFound');
  const { language } = useI18next();
  const isRTL = language === 'ar';
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <Layout pageTitle={`${t('pageTitle')} || Hope For All Mena`}>
      <HeaderTwo />
      <StickyHeader />

      <main className={`nf-page ${isRTL ? 'nf-page--rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <section className="nf-hero">
          <div className="nf-container nf-hero__grid">
            <div className="nf-hero__art">
              <div className="nf-code" dir="ltr" aria-label={t('errorCode')} role="img">
                <span className="nf-code__digit">4</span>
                <CompassZero />
                <span className="nf-code__digit">4</span>
              </div>
              <svg className="nf-path" viewBox="0 0 320 60" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 40 C 60 4, 110 58, 160 30 S 260 6, 316 34" />
              </svg>
            </div>

            <div className="nf-hero__content">
              <span className="nf-eyebrow">{t('eyebrow')}</span>
              <h1 className="nf-title">{t('title')}</h1>
              <p className="nf-lead">{t('description')}</p>

              <blockquote className="nf-verse">
                <p>{t('verse')}</p>
                <cite>{t('verseRef')}</cite>
              </blockquote>

              <div className="nf-actions">
                <Link to="/" className="nf-btn nf-btn--primary">
                  <Home size={18} aria-hidden="true" />
                  {t('homeButton')}
                </Link>
                <Link to="/contact" className="nf-btn nf-btn--outline">
                  <Mail size={18} aria-hidden="true" />
                  {t('contactButton')}
                </Link>
                <button type="button" onClick={goBack} className="nf-btn nf-btn--ghost">
                  <BackArrow size={18} aria-hidden="true" />
                  {t('backButton')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="nf-explore">
          <div className="nf-container">
            <h2 className="nf-explore__title">{t('exploreTitle')}</h2>
            <ul className="nf-cards">
              {quickLinks.map(({ key, to, Icon }) => (
                <li key={key}>
                  <Link to={to} className="nf-card">
                    <span className="nf-card__icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="nf-card__text">
                      <span className="nf-card__title">{t(`cards.${key}.title`)}</span>
                      <span className="nf-card__desc">{t(`cards.${key}.desc`)}</span>
                    </span>
                    <ForwardArrow size={18} className="nf-card__arrow" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </Layout>
  );
};

export default NotFoundPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export const Head = () => (
  <>
    <title>404 - Page Not Found || Hope for All Mena</title>
    <meta name="description" content="The page you're looking for could not be found. Navigate back to our homepage or explore our other pages." />
    <meta name="robots" content="noindex, nofollow" />
  </>
);
