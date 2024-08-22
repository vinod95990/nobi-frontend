"use client";
import Header from "@/src/components/Common/Header";
import "./home.css";
import NobiServices from "@/src/services/nobiServices";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navigationTabs } from "@/src/constants/navigation";
import SearchBar from "@/src/components/Common/SearchBar";
import Folders from "@/src/components/Common/Folders";
import { nobiDocType, pageTypes } from "@/src/constants/NobiConstants";
import BreadCrumb from "@/src/components/Common/BreadCrumb";
import EditModal from "@/src/components/EditModal";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Socials from "@/src/components/Common/Socials";
import MoveToModal from "@/src/components/MoveToModal";
import useNobi from "@/src/hooks/useNobi";
import withAuth from "@/src/hoc/withAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import DrawerShadCN from "@/src/components/DrawerShadCN";
import LinkExistsAlert from "@/src/components/AddedLinkAlreadyExistsAlert";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import AddModal from "@/src/components_v2/AddModal";

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
    linkExistsResponseData,
    setLinkExistsResponseData,
    setSearchedString,
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

  async function handleSearchClick() {
    await refetch();
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        One
        <Separator orientation="vertical" />
      </ResizablePanel>

      <ResizablePanel defaultSize={80}>
        <ScrollArea type="scroll" className=" text-5xl h-screen ">
          <div
            style={{
              opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
            }}
            className=" text-5xl "
            // onClick={(e) => {
            //   hideContextMenu();
            // }}
          >
            <Header />
          </div>
          <Separator orientation="vertical" />
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
              setMoveToModal={setMoveToModal}
              selectedItem={selectedItem}
              hideContextMenu={hideContextMenu}
            />
          )}

          <LinkExistsAlert
            linkExistsResponseData={linkExistsResponseData}
            setLinkExistsResponseData={setLinkExistsResponseData}
            slug={"5e8b7a3346a1f02d9b851e5c"}
            setSearchedString={setSearchedString}
          />

          <div
            className="flex justify-center flex-col items-center p-4 w-full my-3 "
            style={{
              zIndex: "5",
              opacity: addModalType || openEditModal || moveToModal ? 0.12 : 1,
            }}
          >
            <div className="flex items-center justify-center sm:justify-end gap-4 text-sm p-4  w-9/12 mb-4">
              {/* if while adding link that link already exists so set his state and the above LinkExistsAlert component will get triggered */}
              <AddModal setLinkExistsResponseData={setLinkExistsResponseData} />
              {/* 
              <button
                disabled={addModalType || openEditModal ? true : false}
                className="shiny-text  rounded-md   py-1 px-3  text-[#3d3266] border-2 border-[#3d3266] hover:bg-[#3d3266] hover:text-[#f4f5f0] transition-colors cursor-pointer  text-base sm:text-xl  tracking-wide	"
                onClick={() => handleAddModal(nobiDocType.link)}
                style={{
                  opacity:
                    addModalType || openEditModal || moveToModal ? 0.3 : 1,
                }}
              >
                <p>Add Link</p>
              </button> */}
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

          <div>
            <DrawerShadCN />
          </div>
          <Socials isLoading={isLoading} />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default withAuth(Home);
