import React from 'react';
import { Helmet } from 'react-helmet';
import BigCalendar from '../../pages/Calendar/Calendar';
import Breadcrumb from '../Calendar/Breadcrumb';

const CalendarSection = () => {
    return (
        <div className=''>
            <Helmet>
                <title>Calendar - Hope For All Mena</title>
                <meta name="description" content="Manage your events and schedule with our interactive calendar" />
            </Helmet>
            <Breadcrumb title="Calendar" subtitle="Admin Dashboard" />
            <BigCalendar />
        </div>
    );
};

export default CalendarSection;