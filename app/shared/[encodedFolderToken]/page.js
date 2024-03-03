"use client";

import Folders from "@/src/components/Common/Folders";
import "./sharedFolder.css";
import NobiServices from "@/src/services/nobiServices";
import "../../home.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
export default function Home({ params }) {
  const { encodedFolderToken } = params;
  const router = useRouter();

  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      `getSharedFolderDetails`,
      {
        encodedFolderToken: encodedFolderToken,
      },
    ],
    queryFn: () =>
      NobiServices.decodeSharedFolderToken({
        encodedFolderToken: encodedFolderToken,
      }),
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

      if (data) {
        toast.success(data?.message, {
          className: "toast-message",
        });
      }
    }
  }, [queryData, router]);

  function redirectToNobi() {
    router.push("/");
  }

  return (
    <div className=" text-5xl w-full  ">
      <div
        className="p-4 bg-[#3d3266] flex items-center justify-center"
        onClick={() => redirectToNobi()}
      >
        <img
          src="../../nobi-logo.png"
          width={40}
          className=" cursor-pointer"
        ></img>
      </div>

      <div className="m-8 text-[#3d3266]">
        <div className="flex items-center  justify-center gap-5 ">
          <img
            src="../../icons/witch.png"
            width={80}
            className=" cursor-pointer    "
          ></img>
          <h1 className="text-center text-7xl ">
            {queryData?.data?.data?.folderName || "Shared Nobis"}
          </h1>
        </div>
        <p className="text-center text-2xl mt-3 mb-6 font-mono">
          Shared with you by
          <span className="text-[#ff7575] text-3xl font-mono font-bold">
            {queryData?.data?.data?.createdBy
              ? ` {${queryData?.data?.data?.createdBy}}`
              : " a Nobi warrior"}
          </span>
        </p>

        <div className="flex justify-center flex-col items-center p-4 w-full my-3  ">
          <Folders
            folderData={queryData?.data?.data?.links}
            isLoading={isLoading}
            sharedFolder={true}
          />
        </div>

        <div className="floating-animation absolute top-9">
          <img
            src="../../icons/broom-witch.png"
            width={80}
            className=" cursor-pointer"
          ></img>
        </div>
      </div>
      <p
        class="transform -rotate-90 hover:bg-[#3d3266] border-2 text-[#3d3266] transition-colors cursor-pointer border-[#3d3266] text-2xl hover:shiny-text hover:text-white w-fit p-3 rounded-xl absolute bottom-1/3 left-0"
        onClick={() => redirectToNobi()}
      >
        Be a Nobi
      </p>
      <Socials />
    </div>
  );
}
