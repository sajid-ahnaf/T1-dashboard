import CancelOrderTable from "@/components/cancel-order/CancelOrderTable";
import ContentWrapper from "@/layout/sidebar/ContentWrapper";
import React from "react";

const OrderCancelPage = () => {
  return (
    <>
      <ContentWrapper breadCampTitle="Cancelled Order List">
        <CancelOrderTable />
      </ContentWrapper>
    </>
  );
};

export default OrderCancelPage;
