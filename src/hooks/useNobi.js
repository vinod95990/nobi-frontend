const { useState } = require("react");
import debounce from "lodash.debounce";

export default function useNobi() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(null);
  const [moveToModal, setMoveToModal] = useState(null);

  const [searchedString, setSearchedString] = useState("");
  const [addModalType, setAddModalType] = useState(null);

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

  // when user adds link and link already exists in some other folder, take the user to that folder

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
  };
}
