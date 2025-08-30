import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import TeamPage from "../components/team/team-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Volunteers = () => {
  return (
    <Layout pageTitle="Our Volunteers || Azino || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Our Volunteers" crumbTitle="Our Volunteers" />
      <TeamPage />
      <Footer />
    </Layout>
  );
};

export default Volunteers;
