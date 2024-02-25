"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import PaginationComponent from "../all-products/PaginationComponent ";
import { OrderDataType } from "@/interFace/apiInterFace";
import ChartPreloader from "@/preloaders/ChartPreloader";
import NiceSelectThree from "@/utils/NiceSelectThree";
import Modal from "@/sheardComponent/Modal";
import ClientsOrder from "../client-orders/ClientsOrder";
import CustomDateFormatter from "@/hooks/CustomDateFormatter ";
import useGlobalContext from "@/hooks/use-context";
import { toast } from "react-toastify";
import moment from "moment/moment";
import emailjs from "emailjs-com";
import { useRouter } from "next/navigation";
interface statusType {
  id: number;
  value: string;
}

const ClientsTable = () => {
  const { header, user } = useGlobalContext();
  const [clients, setClients] = useState<OrderDataType[]>([]);

  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setotalPages] = useState<number>(0);
  const [currentPage, setcurrentPage] = useState<number>(0);
  const [clientId, setClientId] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [match, setMatch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const router = useRouter();
  //  open dropdown menu

  const handleOpen = (id: string) => {
    setMatch(id);
    setOpen(!open);
  };

  const openModal = (id: string) => {
    setModalIsOpen(true);
    setClientId(id);
  };
  const closeModal = () => setModalIsOpen(false);
  const selectHandler = () => {};
  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value);
    setLoading(true);
    axios
      .get(
        `${process.env.BASE_URL}success/search-clients?search=${searchValue}`
      )
      .then((res) => {
        setClients(res.data);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.BASE_URL}success/clientInfo?page=${page}&limit=${limit}`
      )
      .then((res) => {
        setClients(res.data.products);
        setotalPages(res.data.totalPages);
        setcurrentPage(res.data.currentPage);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  }, [page, limit, updateStatus]);
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
  const orderStatusArray: statusType[] = [
    {
      id: 1,
      value: "Order Placed",
    },
    {
      id: 2,
      value: "In Production",
    },
    {
      id: 3,
      value: "Shipping",
    },
    {
      id: 4,
      value: "Delivered",
    },
  ];

  const handleUpdateStstus = (item: statusType, product: OrderDataType) => {
    setUpdateStatus(false);
    const now = moment();
    const date = now.format("MM/DD/YY hh:mm a");
    const updateProductStatus = {
      id: product?._id,
      shipmentStatus: item?.value,
      orderStatusDate: date,
      paymentId: product?.paymentId,
      orderId: product?.orderId,
    };

    const sendEmail = () => {
      const templateParams = {
        name: product?.name,
        message: item?.value,
        userEmail: product?.buyerEmail,
        orderId: product?.orderId,
        adminEmail: user?.email,
      };

      emailjs
        .send(
          `${process.env.EMAIL_SERVICE_ID}`,
          `${process.env.EMAIL_TEMPLATE_ID}`,
          templateParams,
          `${process.env.EMAIL_PUBLIC_KEY}`
        )
        .then(
          function (response) {
            console.info("SUCCESS!", response.status, response.text);
          },
          function (error) {
            console.log("FAILED...", error);
          }
        );
    };

    axios
      .put(
        `${process.env.BASE_URL}success/update-shipment-status?email=${user?.email}`,
        updateProductStatus,
        header
      )
      .then((res) => {
        if (res.data.message === "success") {
          sendEmail();
          setUpdateStatus(true);
          setMatch(product?._id);
          setOpen(!open);
          toast.success(`Status Updated`, {
            position: "top-left",
          });
        }
        if (res.data.message === "something is wrong") {
          setMatch(product?._id);
          setOpen(!open);
          toast.error(`Something Is Wrong`, {
            position: "top-left",
          });
        }
        if (res.data.message === "duplicate error") {
          setMatch(product?._id);
          setOpen(!open);
          toast.error(`${res.data.data}`, {
            position: "top-left",
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          toast.error("CURD Operation Is Disabled");
        } else {
          toast.error("CURD Operation Is Disabled");
        }
      });
  };

  const handleNeviget = () => {
    router.push("/order-cancel");
  };

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
          {clients?.length ? (
            <>
              <div className="cashier-salereturns-table-area relative">
                <div className="cashier-salereturns-table-innerD">
                  <div className="cashier-salereturns-table-inner-wrapperD border border-solid border-grayBorder border-b-0 mb-7">
                    <div className="cashier-salereturns-table-list flex border-b border-solid border-grayBorder h-12">
                      <div className="cashier-salereturns-table-dateF ml-5">
                        <h5>Email</h5>
                      </div>
                      <div className="cashier-salereturns-table-referenceF">
                        <h5>Phone</h5>
                      </div>
                      <div className="cashier-salereturns-table-customerF">
                        <h5>Payment Id</h5>
                      </div>
                      <div className="cashier-salereturns-table-companyF">
                        <h5>Shipment Status</h5>
                      </div>
                      <div className="cashier-salereturns-table-warehouseF">
                        <h5>Order Date</h5>
                      </div>
                      <div className="cashier-salereturns-table-actionF">
                        <h5>Action</h5>
                      </div>
                    </div>

                    {clients.length ? (
                      clients.map((item) => (
                        <div
                          key={item._id}
                          className="cashier-salereturns-table-list flex border-b border-solid border-grayBorder h-12"
                        >
                          <div className="cashier-salereturns-table-dateF ml-5">
                            <span> {item.buyerEmail} </span>
                          </div>
                          <div className="cashier-salereturns-table-referenceF">
                            <span> {item.Phone} </span>
                          </div>
                          <div className="cashier-salereturns-table-customerF">
                            <span> {item.paymentId} </span>
                          </div>
                          <div className="cashier-salereturns-table-companyF">
                            {!item?.shipmentStatus ? (
                              <>
                                <div className="dropdown">
                                  <button className="common-action-menu-style">
                                    pending
                                    <i className="fa-sharp fa-solid fa-caret-down"></i>
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                {item?.shipmentStatus === "order cancelled" ? (
                                  <>
                                    <div className="dropdown">
                                      <button className="common-action-menu-style">
                                        {item?.shipmentStatus}
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="dropdown">
                                      <button
                                        onClick={() => handleOpen(item._id)}
                                        className="common-action-menu-style"
                                      >
                                        {item?.shipmentStatus}
                                        <i className="fa-sharp fa-solid fa-caret-down"></i>
                                      </button>
                                      <div
                                        className="dropdown-list"
                                        style={{
                                          display: `${
                                            item._id === match && open
                                              ? "block"
                                              : "none"
                                          }`,
                                        }}
                                      >
                                        {orderStatusArray?.map((itm) => (
                                          <button
                                            onClick={() =>
                                              handleUpdateStstus(itm, item)
                                            }
                                            key={itm?.id}
                                            className="dropdown-menu-item"
                                          >
                                            <span> {itm?.value} </span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                          <div className="cashier-salereturns-table-warehouseF">
                            <span>
                              {" "}
                              <CustomDateFormatter inputDate={item.date} />{" "}
                            </span>
                          </div>
                          <div className="cashier-salereturns-table-actionF">
                            {item?.shipmentStatus === "order cancelled" ? (
                              <>
                                <div className="dropdown">
                                  <button
                                    onClick={handleNeviget}
                                    className="common-action-menu-style"
                                  >
                                    <i className="fa-solid fa-eye mr-1"></i>
                                    See Status
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="dropdown">
                                  <button
                                    onClick={() => openModal(item._id)}
                                    className="common-action-menu-style"
                                  >
                                    <i className="fa-solid fa-eye mr-1"></i>
                                    View Order
                                  </button>
                                </div>
                              </>
                            )}
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
                          <></>
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
      <Modal
        modalClass="custom-modal-two"
        overly="overlay-two"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <ClientsOrder id={clientId} />
      </Modal>
    </>
  );
};

export default ClientsTable;
