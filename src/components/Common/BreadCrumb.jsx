import { CaretRight, HouseSimple } from "@phosphor-icons/react";
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
        <HouseSimple
          size={32}
          color="#0b1215"
          weight="fill"
          className="cursor-pointer"
          onClick={() => handleNavigation("/")}
        />
        {/* <Image
          width={40}
          height={40}
          alt="home"
          src="/icons/house-bold.svg"
        ></Image> */}
      </div>
    );
  }

  return (
    <div
      className="flex w-9/12 gap-3 my-1 mb-7 items-center overflow-x-auto py-2"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#ff9090 transparent",
      }}
    >
      <HouseSimple
        size={32}
        color="#0b1215"
        weight="fill"
        className="cursor-pointer"
        onClick={() => handleNavigation("/")}
      />
      {parentData?.map((data, index) => {
        return (
          <React.Fragment key={data._id}>
            <CaretRight size={20} color="#0b1215" className="cursor-pointer" />
            <p
              className={`text-sm sm:text-lg ${
                parentData.length == index + 1
                  ? "text-[#353535]"
                  : "text-[#0b1215]"
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
