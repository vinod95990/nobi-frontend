"use client";

import Folders from "@/src/components/Common/Folders";
import NobiServices from "@/src/services/nobiServices";
import "../home.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
import Header from "@/src/components/Common/Header";
import { pageTypes } from "@/src/constants/NobiConstants";

export default function Home({ params }) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [NobiServices.GET_RECYCLE_BIN_DATA],
    queryFn: () => NobiServices.getRecycleBinData(),
  });

  useEffect(() => {
    if (queryData) {
      const { data, error, unauthorized } = queryData;
      if (unauthorized) {
        toast.info("Please login again!", {
          className: "toast-message",
        });
        router.push("/guard-gate");
      }

      if (error) {
        toast.error(error, {
          className: "toast-message",
        });
        return;
      }
    }
  }, [queryData, router]);

  function redirectToNobi() {
    router.push("/");
  }

  function returnBack() {
    router.back();
  }

  function hideContextMenu() {
    setSelectedItem(null);
  }
  return (
    <div
      className=" text-5xl w-full relative h-full "
      onClick={(e) => {
        hideContextMenu();
      }}
    >
      <Header />

      <div className="m-8 text-[#3d3266]">
        <div className="flex items-center justify-center  gap-5">
          <div className="flex  items-baseline  justify-center gap-3 ">
            <h1 className="text-center text-2xl sm:text-4xl ">
              Pixie&apos;s Dustbin
            </h1>
            <img
              src="../../icons/sparkle.svg"
              width={40}
              className=" cursor-pointer w-6 sm:w-10"
            ></img>
          </div>

          <p
            className="px-4 py-2 text-[#3d3266]  doodle-btn shiny-text text-sm sm:text-lg cursor-pointer"
            onClick={returnBack}
          >
            Back
          </p>
        </div>
        <div className="flex justify-center flex-col items-center p-4 w-full mt-8  ">
          <Folders
            folderData={queryData?.data?.data}
            isLoading={isLoading}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            hideContextMenu={hideContextMenu}
            pageType={pageTypes.dustbin}
          />
        </div>
      </div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#3d3266] opacity-25 flex  items-center  justify-center gap-3 ">
        <h1 className="text-center text-base sm:text-xl ">
          Nobi Fox will magically tidy up and clear data every Sunday!{" "}
        </h1>
        <img
          src="../../icons/broom.svg"
          className=" cursor-pointer w-5 sm:w-10"
        ></img>
      </div>
      <Socials isLoading={isLoading} />
    </div>
  );
}
