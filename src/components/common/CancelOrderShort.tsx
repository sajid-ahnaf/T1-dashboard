import CustomDateFormatter from "@/hooks/CustomDateFormatter ";
import useGlobalContext from "@/hooks/use-context";
import { CanceOrderDataType } from "@/interFace/apiInterFace";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const CancelOrderShort = () => {
  const { updateStatus, settotalCancelOrder } = useGlobalContext();
  const [cancelOrderData, setCancelOrderData] = useState<CanceOrderDataType[]>(
    []
  );

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    axios
      .get(
        `${process.env.BASE_URL}success/cancel-orders?page=${page}&limit=${limit}`
      )
      .then((res) => {
        setCancelOrderData(res.data.products);
        settotalCancelOrder(cancelOrderData?.length);
      })
      .catch((e) => console.log(e));
  }, [page, limit]);


  //  }, [page, limit, updateStatus, cancelOrderData, settotalCancelOrder]);

  return (
    <>
      {/* ====== */}
      {cancelOrderData?.slice(0,4)?.map((item) => (
        <div
          key={item?._id}
          className="cashier-notify-dropdown-list py-4 flex items-center border-b border-grayBorder border-solid"
        >
          <div className="cashier-notify-img">
            <Link href="">
              <Image
                src={item?.orderProduct?.img}
                width={500}
                height={500}
                style={{ width: "100%", height: "auto" }}
                alt="img not found"
              />
            </Link>
          </div>
          <div className="cashier-notify-text">
            <h6>
              <Link className="capitalize" href="/order-cancel">
              {item?.productName}
              </Link>
              <span className="pill">Order Cancelled </span>
            </h6>
            <span>
              {" "}
              {item?.date ? (
                <CustomDateFormatter inputDate={item.date} />
              ) : (
                " 16 sept 2023 - 02:26 PM"
              )}
            </span>
          </div>
        </div>
      ))}
      {/* ======= */}
    </>
  );
};

export default CancelOrderShort;
