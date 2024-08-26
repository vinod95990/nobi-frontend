"use client";

import AddModal from "@/src/components_v2/AddModal";
import Folders from "@/src/components/Common/Folders";
import Header from "@/src/components/Common/Header";
import SearchBar from "@/src/components/Common/SearchBar";
import { nobiDocType, pageTypes } from "@/src/constants/NobiConstants";
import NobiServices from "@/src/services/nobiServices";
import "../home.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BreadCrumb from "@/src/components/Common/BreadCrumb";
import EditModal from "@/src/components_v2/EditModal";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
import MoveToModal from "@/src/components/MoveToModal";
import useNobi from "@/src/hooks/useNobi";
import withAuth from "@/src/hoc/withAuth";
import Image from "next/image";
import DrawerShadCN from "@/src/components/DrawerShadCN";
import LinkExistsAlert from "@/src/components/AddedLinkAlreadyExistsAlert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SharedLinkCard from "@/src/components/SharedLinkCard";
import Loader from "@/src/components/Common/Loader";

function Home({ params }) {
  const { slug } = params;
  const router = useRouter();

  const {
    selectedItem,
    setSelectedItem,
    openEditModal,
    setOpenEditModal,
    moveToModal,
    setMoveToModal,
    searchedString,
    addModalType,
    handleShareFolder,
    hideContextMenu,
    openMoveToModal,
    debouncedHandleSearchedString,
    linkExistsResponseData,
    setLinkExistsResponseData,
    sharedLink,
    copySharedFolderLink,
    routeToSharedFolder,
  } = useNobi();

  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      `getFolderDetails`,
      {
        folderId: slug,
        searchedString: searchedString,
      },
    ],
    queryFn: () =>
      NobiServices.getFolderDetails({
        folderId: slug,
        searchedString,
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

    // return () => {
    //   return null;
    // };
  }, [queryData, router]);

  async function handleSearchClick() {
    await refetch();
  }

  return (
    <div
      className=" text-5xl    w-full   home-page  relative"
      // onClick={(e) => {
      //   hideContextMenu();
      // }}
    >
      <div
        style={{
          opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
        }}
      >
        <Header />
      </div>

      <div
        style={{
          opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
        }}
      >
        <SearchBar
          handleSearchClick={handleSearchClick}
          handleSearchedStringChange={debouncedHandleSearchedString}
        />
      </div>

      <EditModal
        data={selectedItem}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
      />

      {moveToModal && selectedItem && (
        <MoveToModal
          moveToModal={moveToModal}
          setMoveToModal={setMoveToModal}
          selectedItem={selectedItem}
          hideContextMenu={hideContextMenu}
        />
      )}

      <LinkExistsAlert
        linkExistsResponseData={linkExistsResponseData}
        setLinkExistsResponseData={setLinkExistsResponseData}
        slug={slug}
      />
      <div
        className="flex justify-center flex-col items-center p-4 w-full my-3  "
        style={{
          zIndex: "5",
          opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
        }}
      >
        <div className="flex items-center justify-center sm:justify-end gap-4 text-sm p-4  w-9/12 mb-4">
          <AddModal
            setLinkExistsResponseData={setLinkExistsResponseData}
            parentId={slug}
          />
          <Popover>
            <PopoverTrigger>
              <Button
                className="bg-[#0b1215] hover:bg-black text-lg sm:text-xl"
                onClick={() => handleShareFolder(slug)}
              >
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <SharedLinkCard
                sharedLink={sharedLink}
                routeToSharedFolder={routeToSharedFolder}
                copySharedFolderLink={copySharedFolderLink}
              />
            </PopoverContent>
          </Popover>
        </div>
        <BreadCrumb
          parentData={queryData?.data?.data?.parent}
          current={queryData?.data?.data?.docData}
        />
        <div className="w-9/12">
          <Folders
            folderData={queryData?.data?.data?.children}
            selectedItem={selectedItem}
            hideContextMenu={hideContextMenu}
            setSelectedItem={setSelectedItem}
            setOpenEditModal={setOpenEditModal}
            isLoading={isLoading}
            pageType={pageTypes.mainFolder}
            setMoveToModal={setMoveToModal}
            openMoveToModal={openMoveToModal}
          />
        </div>
      </div>

      <div>
        <DrawerShadCN />
      </div>
      <Socials isLoading={isLoading} />

      {/* <Image
        className="w-36 sm:w-44  fixed bottom-52  -left-20 -z-10 neuShadow-brave   rotate-[50deg]"
        src="/floats/f1.jpg"
        alt="cards"
        width={176}
        height={176}
        loading="lazy"
      ></Image>
      <Image
        className="w-36 sm:w-44    fixed -bottom-5 -left-10 -z-10 neuShadow-dragon-girl  rotate-[30deg]"
        src="/floats/f4.jpg"
        width={176}
        height={176}
        alt="cards"
        loading="lazy"
      ></Image>

      <Image
        className="w-36 sm:w-44   fixed bottom-52  -right-20 -z-10 neuShadow-curl-girl  -rotate-45"
        src="/floats/f5.jpg"
        width={176}
        height={176}
        alt="cards"
        loading="lazy"
      ></Image>

      <Image
        className="w-40 sm:w-48 right-0  fixed -bottom-24 sm:right-32 -z-10 neuShadow-girl-with-pot-at-back   -rotate-3"
        src="/floats/f3.jpg"
        width={192}
        height={192}
        alt="cards"
        loading="lazy"
      ></Image> */}
    </div>
  );
}

export default withAuth(Home);
