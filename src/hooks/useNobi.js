const { useState } = require("react");
import debounce from "lodash.debounce";
import copy from "clipboard-copy";
import { toast } from "react-toastify";

export default function useNobi() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(null);
  const [moveToModal, setMoveToModal] = useState(null);

  const [searchedString, setSearchedString] = useState("");
  const [addModalType, setAddModalType] = useState(null);

  const [sharedLink, setSharedLink] = useState("");

  /*state for -> jab user is adding link and that link already exists toh we populate this state with the data from server
  that include information about that already existing link and hence this state triggers the alertlinkexists alert in page.js */
  const [linkExistsResponseData, setLinkExistsResponseData] = useState(false);

  function handleAddModal(type) {
    setAddModalType(type);
  }

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

  // async function handleShareFolder() {
  //   const res = await NobiServices.generateSharedFolderToken({
  //     folderId: selectedItem?._id,
  //   });

  //   if (res?.unauthorized) {
  //     toast.info("Please login again!", {
  //       className: "toast-message",
  //     });
  //     router.push("/guard-gate");
  //   }

  //   if (res?.error) {
  //     toast.error(res?.error, {
  //       className: "toast-message",
  //     });
  //   }

  //   if (res?.data) {
  //     try {
  //       await copy(
  //         `${window.location.origin}/shared/${res?.data?.encodedFolderToken}`
  //       );
  //       setSharedLink(
  //         `${window.location.origin}/shared/${res?.data?.encodedFolderToken}`
  //       );
  //       toast.success("Folder link copied successfully! 🚀", {
  //         className: "toast-message",
  //       });
  //     } catch (err) {
  //       toast.error(
  //         "Oops! Couldn't copy the text. You can try copying it from the URL.",
  //         {
  //           className: "toast-message",
  //         }
  //       );
  //     }
  //     // router.push(`/shared/${res?.data?.encodedFolderToken}`);
  //   }
  // }
  return {
    selectedItem,
    setSelectedItem,
    openEditModal,
    setOpenEditModal,
    moveToModal,
    setMoveToModal,
    searchedString,
    setSearchedString,
    addModalType,
    setAddModalType,
    handleAddModal,
    hideContextMenu,
    openMoveToModal,
    handleSearchedStringChange,
    debouncedHandleSearchedString,
    linkExistsResponseData,
    setLinkExistsResponseData,
    // handleShareFolder,
  };
}
