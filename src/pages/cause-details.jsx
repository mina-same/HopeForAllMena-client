import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import CauseContent from "../components/causes/cause-content";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const CauseDetails = () => {
  return (
    <Layout pageTitle="Cause Details || Azino || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Cause Details" crumbTitle="Cause Details" />
      <CauseContent />
      <Footer />
    </Layout>
  );
};

export default CauseDetails;
