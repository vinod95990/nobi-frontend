const { useState } = require("react");
import debounce from "lodash.debounce";
import copy from "clipboard-copy";
import { toast } from "sonner";
import NobiServices from "../services/nobiServices";
import { useRouter } from "next/navigation";

export default function useNobi() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(null);
  const [moveToModal, setMoveToModal] = useState(null);

  const [searchedString, setSearchedString] = useState("");

  const [sharedLink, setSharedLink] = useState("");

  /*state for -> jab user is adding link and that link already exists toh we populate this state with the data from server
  that include information about that already existing link and hence this state triggers the alertlinkexists alert in page.js */
  const [linkExistsResponseData, setLinkExistsResponseData] = useState(false);

  function hideContextMenu() {
    setSelectedItem(null);
  }

  function openMoveToModal(e) {
    e.stopPropagation();
    setMoveToModal(true);
  }

  function handleSearchedStringChange(e) {
    e.preventDefault();
    setSearchedString(e.target.value?.trim());
  }

  const debouncedHandleSearchedString = debounce(
    handleSearchedStringChange,
    800
  );

  async function handleShareFolder(folderId) {
    if (sharedLink) return;

    const res = await NobiServices.generateSharedFolderToken({
      folderId: folderId,
    });

    if (res?.unauthorized) {
      toast.info("Please login again!");
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(res?.error);
    }

    if (res?.data) {
      try {
        setSharedLink(
          `${window.location.origin}/shared/${res?.data?.encodedFolderToken}`
        );
      } catch (err) {
        toast.error(
          "Oops! Couldn't copy the text. You can try copying it from the URL."
        );
      }
    }
  }

  async function copySharedFolderLink() {
    if (!sharedLink) {
      return;
    }
    await copy(sharedLink);
    toast.success("Folder link copied successfully!");
  }

  function routeToSharedFolder() {
    if (!sharedLink) return;
    router.push(sharedLink);
  }

  return {
    selectedItem,
    setSelectedItem,
    openEditModal,
    setOpenEditModal,
    moveToModal,
    setMoveToModal,
    searchedString,
    setSearchedString,
    hideContextMenu,
    openMoveToModal,
    handleSearchedStringChange,
    debouncedHandleSearchedString,
    linkExistsResponseData,
    setLinkExistsResponseData,
    handleShareFolder,
    copySharedFolderLink,
    routeToSharedFolder,
    sharedLink,
  };
}
