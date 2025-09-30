import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import CausesPage from "../components/causes/causes-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Causes = () => {
  return (
    <Layout pageTitle="Causes Page || Hope for All Mena || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Causes Page" crumbTitle="Causes" />
      <CausesPage />
      <Footer />
    </Layout>
  );
};

export default Causes;
