import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function BreadCrumb(props) {
  const { parentData = null, current } = props;
  const router = useRouter();
  function handleNavigation(to) {
    router.push(to);
  }
  //agar koi parent nhi bheja humne toh show just a home icon
  if (!parentData) {
    return (
      <div className="flex  w-9/12 gap-3 my-1 mb-7 items-center py-2">
        <Image
          className="cursor-pointer"
          width={40}
          height={40}
          alt="home"
          src="/icons/house-bold.svg"
          onClick={() => handleNavigation("/")}
        ></Image>
      </div>
    );
  }

  return (
    <div
      className="flex w-9/12 gap-3 my-1 mb-7 items-center overflow-x-auto py-2"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#7152E1 transparent",
      }}
    >
      <Image
        className="cursor-pointer"
        width={40}
        height={40}
        alt="navigation"
        src="/icons/house-bold.svg"
        onClick={() => handleNavigation("/")}
      ></Image>
      {parentData?.map((data, index) => {
        return (
          <React.Fragment key={data._id}>
            <Image
              width={30}
              height={30}
              alt="path"
              src="/icons/arrow-fat-right-bold.svg"
            ></Image>
            <p
              className={`text-sm sm:text-lg ${
                parentData.length == index + 1
                  ? "text-[#7152E1]"
                  : "text-[#16171c]"
              } cursor-pointer`}
              onClick={() => handleNavigation(`/${data._id}`)}
              style={{ whiteSpace: "nowrap" }}
            >
              {data.name}
            </p>
          </React.Fragment>
        );
      })}
    </div>
  );
}
