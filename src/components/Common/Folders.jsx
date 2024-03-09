import { nobiDocType, pageTypes } from "@/src/constants/NobiConstants";
import { useEffect, useState } from "react";
import "./Folder.css";
import { useRouter } from "next/navigation";
import NobiServices from "@/src/services/nobiServices";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import copy from "clipboard-copy";

export default function Folders(props) {
  const {
    folderData = [],
    selectedItem,
    hideContextMenu,
    setOpenEditModal,
    setSelectedItem,
    isLoading,
    pageType,
    openMoveToModal,
  } = props;
  const queryClient = useQueryClient();
  const [minorLoading, setMinorLoading] = useState(false);
  const router = useRouter();
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  let folderLen =
    folderData?.length > 2 ? folderData?.length - 2 : folderData?.length;

  function handleFolderNavigation(id) {
    if (pageType == pageTypes.dustbin) {
      toast.info("Don't worry! The folder is empty", {
        className: "toast-message",
      });
      return;
    }
    router.push(`/${id}`);
  }

  function handleRightClick(event, item) {
    event.preventDefault();
    if (pageType == pageTypes.sharedFolder) {
      return;
    }
    const containerRect = event.currentTarget.getBoundingClientRect();
    // const scrollX = window.scrollX || window.pageXOffset;
    // const scrollY = window.scrollY || window.pageYOffset;
    const viewportOffsetX = event.clientX + window.scrollX;
    const viewportOffsetY = event.clientY + window.scrollY;
    setSelectedItem(item);
    setContextMenuPosition({
      x: viewportOffsetX,
      y: viewportOffsetY,
    });
  }

  async function handleEdit(e) {
    if (pageType == pageTypes.mainFolder) {
      e.stopPropagation();
      if (!selectedItem) {
        return;
      }
      setOpenEditModal(true);
    }
  }

  async function handleShareFolder(e) {
    e.stopPropagation();
    if (!selectedItem) {
      return;
    }
    setMinorLoading(true);
    const res = await NobiServices.generateSharedFolderToken({
      folderId: selectedItem?._id,
    });

    if (res?.unauthorized) {
      toast.info("Please login again!", {
        className: "toast-message",
      });
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(res?.error, {
        className: "toast-message",
      });
    }

    if (res?.data) {
      try {
        await copy(window.location.href);
        toast.success("Folder link copied successfully! 🚀", {
          className: "toast-message",
        });
      } catch (err) {
        toast.error(
          "Oops! Couldn't copy the text. You can try copying it from the URL.",
          {
            className: "toast-message",
          }
        );
      }
      setMinorLoading(false);

      router.push(`/shared/${res?.data?.encodedFolderToken}`);
    }
  }

  async function handleDelete() {
    if (!selectedItem) {
      return;
    }
    setMinorLoading(true);

    if (selectedItem.type == nobiDocType.folder) {
      const { data, error, unauthorized } = await NobiServices.deleteFolder({
        folderId: selectedItem._id,
      });
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
      }

      if (data) {
        toast.success(data?.message, {
          className: "toast-message",
        });
      }
    } else {
      const { data, error, unauthorized } = await NobiServices.deleteLink({
        linkId: selectedItem._id,
      });
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
      }
    }
    setMinorLoading(false);

    queryClient.invalidateQueries();
  }

  async function pushToRecycleBin() {
    if (!selectedItem) {
      return;
    }
    setMinorLoading(true);

    const { data, error, unauthorized } = await NobiServices.pushToRecycleBin({
      docId: selectedItem._id,
    });
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
    }
    setMinorLoading(false);

    queryClient.invalidateQueries();
  }

  async function restoreFromBin() {
    if (!selectedItem) {
      return;
    }
    setMinorLoading(true);

    const { data, error, unauthorized } = await NobiServices.restoreFromBin({
      docId: selectedItem._id,
    });

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
    }
    setMinorLoading(false);

    queryClient.invalidateQueries();
  }

  function righClickMenus() {
    if (pageType == pageTypes.sharedFolder) {
      return <></>;
    }

    if (pageType == pageTypes.dustbin) {
      return (
        <>
          <button
            onClick={(e) => restoreFromBin(e)}
            className="text-lg sm:text-xl bg-white flex items-center gap-2 text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#ff9696] hover:text-[#f4f5f0] transition-colors	"
          >
            <img
              src="/icons/magic-wand.svg"
              width={20}
              className="z-10 max-w-full	"
            ></img>
            <p>Restore</p>
          </button>

          <button
            onClick={() => handleDelete()}
            className="text-lg sm:text-xl bg-white flex items-center gap-2 text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#ff9696] hover:text-[#f4f5f0] transition-colors	"
          >
            <img
              src="/icons/trash-simple-bold.svg"
              width={20}
              className="z-10 max-w-full	"
            ></img>
            <p>Delete</p>
          </button>
        </>
      );
    }

    return (
      <>
        {selectedItem.type == nobiDocType.folder && (
          <button
            onClick={(e) => handleShareFolder(e)}
            className=" text-lg sm:text-xl bg-white flex items-center gap-2 text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#ff9696] hover:text-[#f4f5f0] transition-colors	"
          >
            <img
              src="/icons/share-fat-bold.svg"
              width={20}
              className="z-10 max-w-full	"
            ></img>
            <p>Share</p>
          </button>
        )}
        <button
          onClick={(e) => handleEdit(e)}
          className=" text-lg bg-white sm:text-xl flex items-center gap-2  text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#ff9696] hover:text-[#f4f5f0] transition-colors	"
        >
          <img
            src="/icons/pencil-simple-bold.svg"
            width={20}
            className="z-10 max-w-full	"
          ></img>
          <p>Edit</p>
        </button>
        <button
          onClick={() => pushToRecycleBin()}
          className="text-lg bg-white sm:text-xl flex items-center gap-2 text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#ff9696] hover:text-[#f4f5f0] transition-colors	"
        >
          <img
            src="/icons/trash-simple-bold.svg"
            width={20}
            className="z-10 max-w-full	"
          ></img>
          <p>Delete</p>
        </button>
        <button
          onClick={(e) => openMoveToModal(e)}
          className=" text-lg bg-white sm:text-xl flex items-center gap-2 text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#ff9696] hover:text-[#f4f5f0] transition-colors	"
        >
          <img
            src="/icons/magic-wand.svg"
            width={20}
            className="z-10 max-w-full	"
          ></img>
          <p>Move</p>
        </button>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="relative w-full mx-2">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap  items-center gap-5  text-[#16171c] text-xl w-9/12  pb-24"
      style={{
        zIndex: 25,
      }}
    >
      {minorLoading && (
        <div className="parent-addModal bg-white  opacity-75 z-50">
          <div className="w-3/4  sm:w-1/2">
            <Loader />
          </div>
        </div>
      )}
      {/* right click pe jo context menu ata hai */}
      {selectedItem && (
        <div
          className="custom-scrollbar absolute z-1000 bg-[#ff9090] border-2 rounded-md border-[#3d3266] p-3  grid gap-3 grid-cols-1  sm:w-[135px] h-[160px]  sm:h-[210px] overflow-auto  "
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            zIndex: "100",
          }}
        >
          {righClickMenus()}
          <style>
            {`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;  
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: #ffb8b8;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #fff;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #7152e1;
      }
    `}
          </style>
        </div>
      )}
      {folderData?.length >= 1 ? (
        folderData.map((data, index) => {
          return data.type == nobiDocType.folder ? (
            <div
              key={index}
              className="doodle-folder  p-2 sm:p-3 flex items-center gap-3 cursor-pointer text-base sm:text-xl"
              style={{
                width: "160px",
                position: "relative",
                zIndex: "10",
              }}
              onClick={() => handleFolderNavigation(data._id)}
              onContextMenu={(e) => handleRightClick(e, data)}
            >
              <img
                src="/icons/folder-bold.svg"
                width={30}
                className="max-w-full	"
              ></img>

              <p className="text-[#3d3266]  overflow-hidden	">{data.name}</p>
            </div>
          ) : (
            <a
              key={index}
              href={data?.link || undefined}
              target="_blank"
              className="doodle-link p-2 sm:p-3 flex gap-3 items-center text-base sm:text-xl"
              style={{
                width: "280px",
                gridColumnEnd: "span 2",
                position: "relative",
                zIndex: "10",
              }}
              onContextMenu={(e) => handleRightClick(e, data)}
            >
              <img
                src="/icons/link-simple-bold.svg"
                width={30}
                className="max-w-full	"
              ></img>
              <div className="flex flex-col justify-center flex-wrap overflow-hidden	">
                <p className="text-[#3d3266] ">{data.name}</p>
                <p className="text-sm text-[#7152E1] ">
                  {data?.link
                    ? data.link.substring(0, 20) + "..."
                    : "Link is missing"}
                </p>
              </div>
              {data.link && (
                <span
                  style={{
                    position: "absolute",
                    top: "0%",
                    left: "0%",
                    border: "2px solid #3d3266",
                    borderRadius: "12px",
                    width: "100%",
                    height: "100%",
                  }}
                  className="bg-[#3d3266] tracking-wider text-[#f4f5f0] text-sm "
                >
                  <p
                    className="p-2 text-wrap"
                    style={{ wordWrap: "break-word", letterSpacing: "1.5px" }}
                  >
                    {data?.link?.substring(8, 60) + "..."}
                  </p>
                </span>
              )}
            </a>
          );
        })
      ) : (
        <p className="text-[#3d3266] text-3xl font-medium">[ EMPTY ]</p>
      )}
    </div>
  );
}
