import CancelHistory from "@/components/cancel-history/CancelHistory";
import ContentWrapper from "@/layout/sidebar/ContentWrapper";
import React from "react";

const CancelOrderHistoryPage = () => {
  return (
    <>
      <ContentWrapper breadCampTitle="Approved Cancel Orders History">
        <CancelHistory />
      </ContentWrapper>
    </>
  );
};

export default CancelOrderHistoryPage;
