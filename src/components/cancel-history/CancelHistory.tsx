"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import PaginationComponent from "../all-products/PaginationComponent ";
import { CanceOrderDataType } from "@/interFace/apiInterFace";
import ChartPreloader from "@/preloaders/ChartPreloader";
import NiceSelectThree from "@/utils/NiceSelectThree";
import CustomDateFormatter from "@/hooks/CustomDateFormatter ";
const CancelHistory = () => {
  const [cancelOrderData, setCancelOrderData] = useState<CanceOrderDataType[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setotalPages] = useState<number>(0);
  const [currentPage, setcurrentPage] = useState<number>(0);

  //  open dropdown menu

  const selectHandler = () => {};
  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value);
    setLoading(true);
    axios
      .get(
        `${process.env.BASE_URL}success/search-cancel-orders?search=${searchValue}`
      )
      .then((res) => {
        setCancelOrderData(res.data.data)
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.BASE_URL}success/cancel-orders-history?page=${page}&limit=${limit}`
      )
      .then((res) => {
        setCancelOrderData(res.data.products);
        setotalPages(res.data.totalPages);
        setcurrentPage(res.data.currentPage);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  }, [page, limit]);
  // get search products

  const pageLimitArray = [
    {
      id: 1,
      value: 5,
    },
    {
      id: 2,
      value: 10,
    },
    {
      id: 3,
      value: 15,
    },
    {
      id: 4,
      value: 20,
    },
  ];

 

  return (
    <>
      <div className="cashier-content-area mt-[30px] px-7">
        <div className="cashier-salereturns-area bg-white p-7 custom-shadow rounded-lg pt-5 mb-5">
          <div className="cashier-table-header-search-area">
            <div className="grid grid-cols-12 gap-x-5 mb-7 pb-0.5">
              <div className="md:col-span-6 col-span-12">
                <div className="cashier-table-header-search relative maxSm:mb-4">
                  <input
                    type="text"
                    placeholder="Search by phone , email, Shipment Status, etc."
                    value={searchValue}
                    onChange={handleInputChange}
                  />
                  <span>
                    <i className="fa-light fa-magnifying-glass"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          {cancelOrderData?.length ? (
            <>
              <div className="cashier-salereturns-table-area relative">
                <div className="cashier-salereturns-table-innerD">
                  <div className="cashier-salereturns-table-inner-wrapperD border border-solid border-grayBorder border-b-0 mb-7">
                    <div className="cashier-salereturns-table-list flex border-b border-solid border-grayBorder h-12">
                      <div className="cashier-salereturns-table-dateF ml-5">
                        <h5>Email</h5>
                      </div>
                      <div className="cashier-salereturns-table-referenceF">
                        <h5>Product Name</h5>
                      </div>
                      <div className="cashier-salereturns-table-customerF">
                        <h5>Cancel Date</h5>
                      </div>
                      <div className="cashier-salereturns-table-companyF">
                        <h5>Status</h5>
                      </div>
                      <div className="cashier-salereturns-table-warehouseF">
                        <h5>Order Id</h5>
                      </div>
                      <div className="cashier-salereturns-table-actionF">
                        <h5>Return Amount</h5>
                      </div>
                    </div>

                    {cancelOrderData.length ? (
                      cancelOrderData.map((item) => (
                        <div
                          key={item._id}
                          className="cashier-salereturns-table-list flex border-b border-solid border-grayBorder h-12"
                        >
                          <div className="cashier-salereturns-table-dateF ml-5">
                            <span> {item.buyerEmail} </span>
                          </div>
                          <div className="cashier-salereturns-table-referenceF">
                            <span> {item.productName} </span>
                          </div>
                          <div className="cashier-salereturns-table-customerF">
                            <span>
                              {" "}
                              <CustomDateFormatter inputDate={item.date} />{" "}
                            </span>
                          </div>
                          <div className="cashier-salereturns-table-companyF">
                            <span> {item?.returnStatus} </span>
                          </div>
                          <div className="cashier-salereturns-table-warehouseF">
                            <span>{item?.orderId}</span>
                          </div>
                          <div className="cashier-salereturns-table-actionF">
                            <span> ${item?.returnAmount} </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {loading ? (
                          <>
                            <ChartPreloader />
                          </>
                        ) : (
                          <>
                            <p className="text-center">
                              {" "}
                              No Cancled Orders History{" "}
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="cashier-pagination-area">
                  <div className="cashier-pagination-wrapper">
                    <div className="grid grid-cols-12">
                      <div className="single-input-field w-full">
                        <NiceSelectThree
                          options={pageLimitArray}
                          defaultCurrent={0}
                          onChange={selectHandler}
                          name=""
                          setLimit={setLimit}
                          className=""
                        />
                      </div>

                      <div className="lg:col-span-9 md:col-span-6 col-span-12">
                        <PaginationComponent
                          totalPages={totalPages}
                          currentPage={currentPage}
                          setPage={setPage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-center mt-5"> No Client Found </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CancelHistory;
