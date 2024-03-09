"use client";

import AddModal from "@/src/components/AddModal";
import Folders from "@/src/components/Common/Folders";
import Header from "@/src/components/Common/Header";
import SearchBar from "@/src/components/Common/SearchBar";
import { nobiDocType, pageTypes } from "@/src/constants/NobiConstants";
import NobiServices from "@/src/services/nobiServices";
import "../home.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BreadCrumb from "@/src/components/Common/BreadCrumb";
import Loader from "@/src/components/Common/Loader";
import EditModal from "@/src/components/EditModal";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
import MoveToModal from "@/src/components/MoveToModal";
import useNobi from "@/src/hooks/useNobi";

export default function Home({ params }) {
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

  return (
    <div
      className=" text-5xl    w-full   home-page  relative"
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

      <AddModal
        type={addModalType}
        setAddModalType={setAddModalType}
        parentId={slug}
      />
      <EditModal
        data={selectedItem}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
      />
      {moveToModal && (
        <MoveToModal
          moveToModal={moveToModal}
          setMoveToModal={setMoveToModal}
          selectedItem={selectedItem}
          hideContextMenu={hideContextMenu}
        />
      )}
      <div
        className="flex justify-center flex-col items-center p-4 w-full my-3  "
        style={{
          zIndex: "5",
          opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
        }}
      >
        <div className="flex items-center justify-center sm:justify-end gap-4 text-sm p-4  w-9/12 mb-4">
          <button
            disabled={addModalType || openEditModal ? true : false}
            style={{
              opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
            }}
            className="shiny-text  rounded-md   py-1 px-3  text-[#3d3266] border-2 border-[#3d3266] hover:bg-[#3d3266] hover:text-[#f4f5f0] transition-colors cursor-pointer text-base sm:text-xl tracking-wide	"
            onClick={() => handleAddModal(nobiDocType.folder)}
          >
            <p>Add Folder</p>
          </button>
          <button
            disabled={addModalType || openEditModal ? true : false}
            className="shiny-text  rounded-md   py-1 px-3  text-[#3d3266] border-2 border-[#3d3266] hover:bg-[#3d3266] hover:text-[#f4f5f0] transition-colors cursor-pointer text-base sm:text-xl tracking-wide	"
            onClick={() => handleAddModal(nobiDocType.link)}
            style={{
              opacity: addModalType || moveToModal ? 0.12 : 1,
            }}
          >
            <p>Add Link</p>
          </button>
        </div>
        <BreadCrumb
          parentData={queryData?.data?.data?.parent}
          current={queryData?.data?.data?.docData}
        />

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
      <Socials isLoading={isLoading} />
    </div>
  );
}
