"use client";

import Folders from "@/src/components/Common/Folders";
import NobiServices from "@/src/services/nobiServices";
import "../home.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
import Header from "@/src/components/Common/Header";
import { pageTypes } from "@/src/constants/NobiConstants";
import withAuth from "@/src/hoc/withAuth";
import Image from "next/image";
import { Sparkle } from "@phosphor-icons/react";
import TooltipCustom from "@/src/components/Common/TooltipCustom";

function Home({ params }) {
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

      <div className="m-8 text-[#0b1215]">
        <div className="flex items-center justify-center  gap-5">
          <div className="flex  items-center  justify-center gap-3 ">
            <h1 className="text-center text-2xl sm:text-4xl ">
              Pixie&apos;s Dustbin
            </h1>
            <TooltipCustom
              trigger={<Sparkle size={32} color="#0b1215" />}
              content="  Nobi Fox will magically tidy up and clear data every Sunday!"
            />
          </div>

          <p
            className="px-4 py-2 text-[#0b1215]  doodle-btn shiny-text text-sm sm:text-base cursor-pointer"
            onClick={returnBack}
          >
            Back
          </p>
        </div>
        <div className="flex justify-center flex-col items-center p-4  w-9/12 mx-auto mt-8  ">
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

      <Socials isLoading={isLoading} />

      {/* <Image
        className="w-36 sm:w-44   fixed bottom-52  -left-20 -z-10 neuShadow-camp-fire   rotate-[50deg]"
        src="/floats/f7.jpg"
        width={176}
        height={176}
        alt="cards"
        loading="lazy"
      ></Image>
      <Image
        className="w-36 sm:w-44    fixed -bottom-11 -left-10 -z-10 neuShadow-pink-cat-girl  rotate-[30deg]"
        src="/floats/f22.jpg"
        width={176}
        height={176}
        alt="cards"
        loading="lazy"
      ></Image>

      <Image
        className="w-36 sm:w-44  fixed bottom-52  -right-20 -z-10 neuShadow-group-fire-camp  -rotate-45"
        src="/floats/f6.jpg"
        width={176}
        height={176}
        alt="cards"
        loading="lazy"
      ></Image>

      <Image
        className="w-40 sm:w-48 right-0 fixed -bottom-24 sm:right-32 -z-10 neuShadow-mermaid   -rotate-3"
        src="/floats/f18.jpg"
        width={192}
        height={192}
        alt="cards"
        loading="lazy"
      ></Image> */}
    </div>
  );
}

export default withAuth(Home);
