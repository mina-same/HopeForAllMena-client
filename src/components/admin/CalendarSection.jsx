import React from 'react';
import { Helmet } from 'react-helmet';
import BigCalendar from '../../pages/Calendar/Calendar';
import Breadcrumb from '../Calendar/Breadcrumb';
import { useTranslation } from 'gatsby-plugin-react-i18next';

const CalendarSection = () => {
    const { t } = useTranslation('Calendar');
    return (
        <div className=''>
            <Helmet>
                <title>{`${t('page.title')} - Hope For All Mena`}</title>
                <meta name="description" content={t('page.description')} />
            </Helmet>
            <Breadcrumb title={t('page.title')} subtitle={t('page.breadcrumb')} />
            <BigCalendar />
        </div>
    );
};

export default CalendarSection;