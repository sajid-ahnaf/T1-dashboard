import CustomDateFormatter from "@/hooks/CustomDateFormatter ";
import { UserContactType } from "@/interFace/apiInterFace";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import thumb from "../../../public/assets/img/user/user-1.png";
const ContactInfoShort = () => {
  const [notificationData, setNotificationData] = useState<UserContactType[]>(
    []
  );
  useEffect(() => {
    axios.get(`${process.env.BASE_URL}user-input/contact-info`).then((res) => {
      setNotificationData(res.data);
    });
  }, []);
 
  return (
    <>
      {notificationData?.length ? (
        <>
          {notificationData.slice(0, 4).map((item) => (
            <div
              key={item._id}
              className="cashier-notify-dropdown-list py-4 flex items-center border-b border-grayBorder border-solid"
            >
              <div className="cashier-notify-img">
                <Link href="">
                  <Image src={thumb} alt="img not found" />
                </Link>
              </div>
              <div className="cashier-notify-text">
                <h6>
                  <Link className="capitalize" href="">
                    {item?.name} Send you Message
                  </Link>
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ContactInfoShort;
