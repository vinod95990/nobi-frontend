import { nobiDocType } from "@/src/constants/NobiConstants";
import { useEffect, useState } from "react";
import "./Folder.css";
import { useRouter } from "next/navigation";
import NobiServices from "@/src/services/nobiServices";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function Folders(props) {
  const {
    folderData = [],
    selectedItem,
    hideContextMenu,
    setOpenEditModal,
    setSelectedItem,
    isLoading,
    sharedFolder,
  } = props;
  const queryClient = useQueryClient();

  const router = useRouter();
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  let folderLen =
    folderData?.length > 2 ? folderData?.length - 2 : folderData?.length;

  function handleFolderNavigation(id) {
    router.push(`/${id}`);
  }

  function handleRightClick(event, item) {
    if (sharedFolder) {
      return;
    }
    event.preventDefault();
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
    //sharedfolder -> true, jab yeh folder compeontn is used in voh shared page toh events wagera nhi hone chahiye vo links pe
    if (sharedFolder) {
      return;
    }
    e.stopPropagation();
    if (!selectedItem) {
      return;
    }
    setOpenEditModal(true);
  }

  async function handleShareFolder(e) {
    e.stopPropagation();
    if (!selectedItem) {
      return;
    }
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
      return;
    }

    if (res?.data) {
      router.push(`/shared/${res?.data?.encodedFolderToken}`);
    }
  }

  async function handleDelete() {
    if (sharedFolder) {
      return;
    }
    if (!selectedItem) {
      return;
    }

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
        return null;
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
        return null;
      }

      if (data) {
        toast.success(data?.message, {
          className: "toast-message",
        });
      }
    }
    queryClient.invalidateQueries("getAllFolders");
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
      className="flex flex-wrap  gap-5  text-[#16171c] text-xl w-9/12  pb-24"
      style={{
        zIndex: 5,
      }}
    >
      {!sharedFolder && selectedItem && (
        <div
          className="w-32 absolute z-1000 bg-[#f4f5f0] border-2 rounded-md border-[#3d3266] p-3 flex flex-col gap-3 "
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            zIndex: "20",
          }}
        >
          {selectedItem.type == nobiDocType.folder && (
            <button
              onClick={(e) => handleShareFolder(e)}
              className="flex items-center gap-2 text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#7152E1] hover:text-[#f4f5f0] transition-colors	"
            >
              <img
                src="/icons/share-fat-bold.svg"
                width={20}
                className="z-10"
              ></img>
              <p>Share</p>
            </button>
          )}
          <button
            onClick={(e) => handleEdit(e)}
            className="flex items-center gap-2  text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#7152E1] hover:text-[#f4f5f0] transition-colors	"
          >
            <img
              src="/icons/pencil-simple-bold.svg"
              width={20}
              className="z-10"
            ></img>
            <p>Edit</p>
          </button>
          <button
            onClick={() => handleDelete()}
            className="flex items-center gap-2 text-[#3d3266] border-2 rounded-md border-[#3d3266] p-2 hover:bg-[#7152E1] hover:text-[#f4f5f0] transition-colors	"
          >
            <img
              src="/icons/trash-simple-bold.svg"
              width={20}
              className="z-10"
            ></img>
            <p>Delete</p>
          </button>
        </div>
      )}
      {folderData?.length >= 1 ? (
        folderData.map((data, index) => {
          return data.type == nobiDocType.folder ? (
            <div
              key={index}
              className="doodle-folder  p-3 flex items-center gap-3 cursor-pointer"
              style={{
                width: "160px",
                position: "relative",
                zIndex: "10",
              }}
              onClick={() => handleFolderNavigation(data._id)}
              onContextMenu={(e) => handleRightClick(e, data)}
            >
              <img src="/icons/folder-bold.svg" width={30}></img>

              <p className="text-[#3d3266]">{data.name}</p>
            </div>
          ) : (
            <a
              key={index}
              href={data?.link || undefined}
              target="_blank"
              className="doodle-link  p-3 flex gap-3 items-center"
              style={{
                width: "280px",
                gridColumnEnd: "span 2",
                position: "relative",
                zIndex: "10",
              }}
              onContextMenu={(e) => handleRightClick(e, data)}
            >
              <img src="/icons/link-simple-bold.svg" width={30}></img>
              <div className="flex flex-col justify-center flex-wrap">
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
        <p className="text-[#3d3266] text-3xl">[ NO DATA ]</p>
      )}
    </div>
  );
}
