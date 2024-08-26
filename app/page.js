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
import EditModal from "@/src/components_v2/EditModal";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SharedLinkCard from "@/src/components/SharedLinkCard";
import Loader from "@/src/components/Common/Loader";
import { toast } from "sonner";

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
    handleShareFolder,
    hideContextMenu,
    openMoveToModal,
    debouncedHandleSearchedString,
    linkExistsResponseData,
    setLinkExistsResponseData,
    setSearchedString,
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
        toast.info("Please login again!");

        router.push("/guard-gate");
      }

      if (error) {
        toast.error(error);
        return;
      }
    }
  }, [queryData, router, isLoading]);

  async function handleSearchClick() {
    await refetch();
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* <ResizablePanel defaultSize={20} className="bg-[#0b1215]">
        One
        <Separator orientation="horizontal" />
      </ResizablePanel> */}

      <ResizablePanel defaultSize={80}>
        <ScrollArea type="scroll" className=" text-5xl h-screen ">
          <div
            style={{
              opacity: openEditModal || moveToModal ? 0.12 : 1,
            }}
            className=" text-5xl "
          >
            <Header />
          </div>
          <Separator orientation="vertical" />
          <div
            style={{
              opacity: openEditModal || moveToModal ? 0.12 : 1,
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
            // slug is used to know what folder user currently on and it is used to move folders to the current folder
            // this number is basically indicating root folder for backend as in backend we will send this in order to bypass yup validation for hex,
            slug={"5e8b7a3346a1f02d9b851e5c"}
          />

          <div
            className="flex justify-center flex-col items-center p-4 w-full my-3 "
            style={{
              zIndex: "5",
              opacity: openEditModal || moveToModal ? 0.12 : 1,
            }}
          >
            <div className="flex items-center justify-center sm:justify-end gap-4 text-sm p-4  w-9/12 mb-4">
              {/* if while adding link that link already exists so set his state and the above LinkExistsAlert component will get triggered */}
              <AddModal setLinkExistsResponseData={setLinkExistsResponseData} />
              <Popover>
                <PopoverTrigger>
                  <Button
                    className="bg-[#0b1215] hover:bg-black text-lg sm:text-xl"
                    onClick={() =>
                      //this hex decimal number indicates in backend ki bahi root hi share kardiya
                      handleShareFolder("5e8b7a3346a1f02d9b851e5c")
                    }
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

            <BreadCrumb />
            <div className="w-9/12">
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
