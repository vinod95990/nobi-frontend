"use client";

import Folders from "@/src/components/Common/Folders";
import NobiServices from "@/src/services/nobiServices";
import "../../home.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
import copy from "clipboard-copy";
import { pageTypes } from "@/src/constants/NobiConstants";
import Image from "next/image";
import { Copy } from "@phosphor-icons/react";

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
        toast.info("Please login again!");
        router.push("/guard-gate");
      }

      if (error) {
        toast.error(error);
        return;
      }
    }
  }, [queryData, router]);

  function redirectToNobi() {
    router.push("/");
  }

  async function handleCopy() {
    try {
      await copy(window.location.href);
      toast.success("Folder link copied successfully!");
    } catch (err) {
      toast.error(
        "Oops! Couldn't copy the text. You can try copying it from the URL."
      );
    }
  }

  return (
    <div className=" text-5xl w-full  ">
      <div
        className="p-4 flex items-center justify-center"
        onClick={() => redirectToNobi()}
      >
        <Image
          src="/nobi-logo-dark.png"
          width={40}
          height={40}
          className=" cursor-pointer w-6 sm:w-10"
          alt="logo"
          loading="lazy"
        ></Image>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#0b1215"
              fillOpacity="1"
              d="M0,128L40,128C80,128,160,128,240,117.3C320,107,400,85,480,64C560,43,640,21,720,37.3C800,53,880,107,960,144C1040,181,1120,203,1200,202.7C1280,203,1360,181,1400,170.7L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="m-8 text-[#0b1215   ]">
        <div className="flex items-center  justify-center gap-5 ">
          <h1 className="text-center text-3xl sm:text-5xl bg-[#fff] p-2 rounded-md ">
            {queryData?.data?.data?.folderName || "Shared Nobis"}
          </h1>
        </div>
        <p className="text-center text-sm sm:text-lg mt-2  mb-6  font-mono">
          Shared with you by
          <span className="text-[#ff7575] text-base sm:text-lg font-mono font-extrabold">
            {queryData?.data?.data?.createdBy
              ? ` ${queryData?.data?.data?.createdBy}`
              : " a Nobi warrior"}
          </span>
        </p>
        <div className="flex items-center justify-center">
          <div
            className="doodle-btn p-2  text-base flex items-center  gap-2 justify-center cursor-pointer "
            onClick={handleCopy}
          >
            <p>Copy Link</p>
            <Copy size={28} color="#0b1215" weight="fill" className=" " />
          </div>
        </div>
        <div className="flex justify-center flex-col items-center p-4 w-9/12 mx-auto mt-7  ">
          <Folders
            folderData={queryData?.data?.data?.links}
            isLoading={isLoading}
            pageType={pageTypes.sharedFolder}
          />
        </div>
      </div>
      <p
        class="transform -rotate-90 hover:bg-[#0b1215] border-2 text-[#0b1215] transition-colors cursor-pointer border-[#0b1215] text-base sm:text-2xl hover:shiny-text hover:text-white w-fit p-3 rounded-xl absolute bottom-1/3 left-0"
        onClick={() => redirectToNobi()}
      >
        Be a Nobi
      </p>
      {/* <Socials isLoading={isLoading} /> */}
      {/* <Image
        className="w-36 sm:w-44 fixed bottom-52  -left-20 -z-10 neuShadow-shared-leaf-cat-girl   rotate-[90deg]"
        src="/floats/f1.jpg"
        width={176}
        height={176}
        alt="cards"
        loading="lazy"
      ></Image>
      <Image
        className="w-36 sm:w-44 fixed -bottom-16 -left-12 -z-10 neuShadow-orange-cat-girl  rotate-[30deg]"
        src="/floats/f9.jpg"
        alt="cards"
        width={176}
        height={176}
        loading="lazy"
      ></Image>

      <Image
        className="w-36 sm:w-44 fixed bottom-52  -right-20 -z-10 neuShadow-shared-curl-girl  -rotate-45"
        src="/floats/f3.jpg"
        width={176}
        height={176}
        alt="cards"
        loading="lazy"
      ></Image>

      <Image
        className="w-40 sm:w-48 right-0 fixed -bottom-24 sm:right-32 -z-10 neuShadow-sheep-stack   -rotate-3"
        src="/floats/f23.jpg"
        width={192}
        height={192}
        alt="cards"
        loading="lazy"
      ></Image> */}
    </div>
  );
}
