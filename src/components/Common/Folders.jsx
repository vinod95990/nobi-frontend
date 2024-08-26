import { nobiDocType, pageTypes } from "@/src/constants/NobiConstants";
import { useEffect, useState } from "react";
import "./Folder.css";
import { useRouter } from "next/navigation";
import NobiServices from "@/src/services/nobiServices";
import Loader from "./Loader";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  TerminalWindow,
  LinkSimple,
  Horse,
  TrashSimple,
  PencilSimple,
  MagicWand,
  ClockClockwise,
} from "@phosphor-icons/react";

export default function Folders(props) {
  const {
    folderData = [],
    selectedItem,
    setOpenEditModal,
    setSelectedItem,
    isLoading,
    pageType,
    openMoveToModal,
  } = props;
  const queryClient = useQueryClient();
  const [minorLoading, setMinorLoading] = useState(false);
  const router = useRouter();

  function handleFolderNavigation(event, id) {
    event.preventDefault();

    if (pageType == pageTypes.dustbin) {
      toast.info("Don't worry! The folder is empty");
      return;
    }

    setMinorLoading(true);
    router.push(`/${id}`);
    setMinorLoading(false);
  }

  async function handleEdit() {
    setMinorLoading(true);
    if (pageType == pageTypes.mainFolder) {
      if (!selectedItem) {
        return;
      }
      setOpenEditModal(true);
    }
    setMinorLoading(false);
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
        toast.info("Please login again!");
        router.push("/guard-gate");
      }

      if (error) {
        toast.error(error);
      }

      if (data) {
        toast.success(data?.message);
      }
    } else {
      const { data, error, unauthorized } = await NobiServices.deleteLink({
        linkId: selectedItem._id,
      });
      if (unauthorized) {
        toast.info("Please login again!");
        router.push("/guard-gate");
      }

      if (error) {
        toast.error(error);
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
      toast.info("Please login again!");
      router.push("/guard-gate");
    }

    if (error) {
      toast.error(error);
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
      toast.info("Please login again!");
      router.push("/guard-gate");
    }

    if (error) {
      toast.error(error);
    }
    setMinorLoading(false);

    queryClient.invalidateQueries();
  }

  function righClickMenus(data) {
    if (pageType == pageTypes.sharedFolder) {
      return <></>;
    }

    if (pageType == pageTypes.dustbin) {
      return (
        <ContextMenuContent className="bg-[#0b1215] text-white  ">
          <ContextMenuItem
            onClick={(e) => restoreFromBin(e)}
            className="text-lg sm:text-xl "
          >
            Restore
            <ContextMenuShortcut>
              <ClockClockwise size={22} color="#fff" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={() => handleDelete()}
            className="text-lg sm:text-xl "
          >
            Delete
            <ContextMenuShortcut>
              <TrashSimple size={22} color="#fff" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      );
    }

    return (
      <ContextMenuContent className="bg-[#0b1215] text-white  ">
        <ContextMenuItem className="text-lg sm:text-xl" onClick={handleEdit}>
          Edit
          <ContextMenuShortcut>
            <PencilSimple size={22} color="#fff" />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => pushToRecycleBin()}
          className="text-lg sm:text-xl"
        >
          Delete
          <ContextMenuShortcut>
            <TrashSimple size={20} color="#fff" />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={(e) => openMoveToModal(e)}
          className="text-lg sm:text-xl"
        >
          Move
          <ContextMenuShortcut>
            <MagicWand size={22} color="#fff" />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    );
  }

  if (isLoading) {
    return (
      <div className="m-2 transition-all flex flex-wrap  items-center gap-5  w-full pb-24">
        <Skeleton className=" w-[180px]  h-[40px] rounded-[4px] bg-[#0b1215]" />
        <Skeleton className=" w-[180px]  h-[40px] rounded-[4px] bg-[#0b1215]" />
        <Skeleton className=" w-[180px]  h-[40px] rounded-[4px] bg-[#0b1215]" />
        <Skeleton className=" w-[180px]  h-[40px] rounded-[4px] bg-[#0b1215]" />
      </div>
    );
  }

  return (
    <div
      className="m-2 transition-all flex flex-wrap  items-center gap-5  text-[#16171c] text-xl w-full  pb-24"
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
      {folderData?.length >= 1 ? (
        folderData.map((data, index) => {
          return data.type == nobiDocType.folder ? (
            <ContextMenu
              className="media"
              onOpenChange={() => {
                setSelectedItem(data);
              }}
            >
              <ContextMenuTrigger>
                <div
                  key={index}
                  className="doodle-folder border-[2px] border-[#0b1215] rounded-2xl	 p-2 sm:p-3 flex items-center gap-3 cursor-pointer text-base sm:text-xl"
                  style={{
                    width: "160px",
                    position: "relative",
                    zIndex: "10",
                    display: "grid",
                    gridTemplateColumns: "32px auto",
                    gap: "8px",
                    alignItems: "center",
                  }}
                  onClick={(e) => handleFolderNavigation(e, data._id)}
                  // onContextMenu={(e) => handleRightClick(e, data)}
                >
                  <TerminalWindow
                    size={30}
                    color="#091a03"
                    className="w-5 sm:w-8"
                    weight="bold"
                  />
                  <p className="text-[#0b1215]  overflow-hidden	">{data.name}</p>
                </div>
              </ContextMenuTrigger>
              {righClickMenus(data)}
            </ContextMenu>
          ) : (
            <ContextMenu
              className="media"
              onOpenChange={() => {
                setSelectedItem(data);
              }}
            >
              <ContextMenuTrigger>
                <Link
                  key={index}
                  href={data?.link || undefined}
                  target="_blank"
                  className="doodle-link p-2 w-full sm:w-[280px] sm:p-3 flex gap-3 items-center text-base sm:text-xl"
                  style={{
                    gridColumnEnd: "span 2",
                    position: "relative",
                    zIndex: "10",
                  }}
                  // onContextMenu={(e) => handleRightClick(e, data)}
                >
                  <LinkSimple
                    size={30}
                    color="#091a03"
                    weight="bold"
                    className="w-5 sm:w-8"
                  />

                  <div className="flex flex-col justify-center flex-wrap overflow-hidden	">
                    <p className="text-[#152131] ">{data.name}</p>
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
                        border: "2px solid #0b1215",
                        borderRadius: "12px",
                        width: "100%",
                        height: "100%",
                      }}
                      className="bg-[#0b1215] tracking-wider text-[#f4f5f0] text-sm "
                    >
                      <p
                        className="p-2 text-wrap"
                        style={{
                          wordWrap: "break-word",
                          letterSpacing: "1.5px",
                        }}
                      >
                        {data?.link?.substring(8, 60) + "..."}
                      </p>
                    </span>
                  )}
                </Link>{" "}
              </ContextMenuTrigger>

              {righClickMenus(data)}
            </ContextMenu>
          );
        })
      ) : (
        <p className="text-[#3d3266] text-lg sm:text-3xl font-medium ">...</p>
      )}
    </div>
  );
}
