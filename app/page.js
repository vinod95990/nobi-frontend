"use client";
import Header from "@/src/components/Common/Header";
import "./home.css";
import NobiServices from "@/src/services/nobiServices";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navigationTabs } from "@/src/constants/navigation";
import SearchBar from "@/src/components/Common/SearchBar";
import Folders from "@/src/components/Common/Folders";
import AddModal from "@/src/components/AddModal";
import { nobiDocType, pageTypes } from "@/src/constants/NobiConstants";
import BreadCrumb from "@/src/components/Common/BreadCrumb";
import EditModal from "@/src/components/EditModal";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
import MoveToModal from "@/src/components/MoveToModal";
import useNobi from "@/src/hooks/useNobi";
import withAuth from "@/src/hoc/withAuth";
import Image from "next/image";

function Home() {
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
    setAddModalType,
    handleAddModal,
    hideContextMenu,
    openMoveToModal,
    debouncedHandleSearchedString,
    handleSearchClick,
  } = useNobi();
  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      `getAllFolders`,
      { type: navigationTabs[0], searchedString: searchedString || undefined },
    ],
    queryFn: () =>
      NobiServices.getAllFolders({
        type: navigationTabs[0],
        searchedString: searchedString || "",
      }),
  });

  useEffect(() => {
    if (queryData && !isLoading) {
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
  }, [queryData, router, isLoading]);

  return (
    <div
      className=" text-5xl    w-full   home-page relative"
      onClick={(e) => {
        hideContextMenu();
      }}
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

      <AddModal type={addModalType} setAddModalType={setAddModalType} />
      <EditModal
        data={selectedItem}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
      />
      {moveToModal && selectedItem && (
        <MoveToModal
          setMoveToModal={setMoveToModal}
          selectedItem={selectedItem}
          hideContextMenu={hideContextMenu}
        />
      )}

      <div
        className="flex justify-center flex-col items-center p-4 w-full my-3 "
        style={{
          zIndex: "5",
          opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
        }}
      >
        <div className="flex items-center justify-center sm:justify-end gap-4 text-sm p-4  w-9/12 mb-4">
          <button
            disabled={addModalType || openEditModal ? true : false}
            style={{
              opacity: addModalType || openEditModal ? 0.3 : 1,
            }}
            className="shiny-text  rounded-md   py-1 px-3  text-[#3d3266] border-2 border-[#3d3266] hover:bg-[#3d3266] hover:text-[#f4f5f0] transition-colors cursor-pointer text-base sm:text-xl tracking-wide	"
            onClick={() => handleAddModal(nobiDocType.folder)}
          >
            <p>Add Folder</p>
          </button>
          <button
            disabled={addModalType || openEditModal ? true : false}
            className="shiny-text  rounded-md   py-1 px-3  text-[#3d3266] border-2 border-[#3d3266] hover:bg-[#3d3266] hover:text-[#f4f5f0] transition-colors cursor-pointer  text-base sm:text-xl  tracking-wide	"
            onClick={() => handleAddModal(nobiDocType.link)}
            style={{
              opacity: addModalType || openEditModal || moveToModal ? 0.3 : 1,
            }}
          >
            <p>Add Link</p>
          </button>
        </div>
        <BreadCrumb />

        <Folders
          key="folder"
          folderData={queryData?.data?.data}
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
      <Socials isLoading={isLoading} />

      <Image
        className="w-36 sm:w-44 fixed bottom-52 -left-20 -z-10 neuShadow-brave   rotate-[50deg]"
        src="/floats/f1.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>
      <Image
        className="w-36 sm:w-44 fixed -bottom-5 -left-10 -z-10 neuShadow-dragon-girl  rotate-[30deg]"
        src="/floats/f4.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>

      <Image
        className="w-36 sm:w-44 fixed bottom-52 -right-20 -z-10 neuShadow-curl-girl  -rotate-45"
        src="/floats/f5.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>

      <Image
        className="w-40 sm:w-48 right-0 fixed -bottom-24 sm:right-32 -z-10 neuShadow-girl-with-pot-at-back   -rotate-3"
        src="/floats/f3.jpg"
        width={160}
        height={160}
        alt="cards"
        loading="lazy"
      ></Image>
    </div>
  );
}

export default withAuth(Home);
