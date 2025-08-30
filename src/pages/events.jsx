import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import EventPage from "../components/event/event-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Events = () => {
  return (
    <Layout pageTitle="Events Page || Azino || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Events" crumbTitle="Events" />
      <EventPage />
      <Footer />
    </Layout>
  );
};

export default Events;
