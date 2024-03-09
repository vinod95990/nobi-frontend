const { useState } = require("react");
import debounce from "lodash.debounce";

export default function useNobi() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(null);
  const [moveToModal, setMoveToModal] = useState(null);

  const [searchedString, setSearchedString] = useState("");
  const [addModalType, setAddModalType] = useState(null);

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

  async function handleSearchClick() {
    await refetch();
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
    addModalType,
    setAddModalType,
    handleAddModal,
    hideContextMenu,
    openMoveToModal,
    handleSearchedStringChange,
    debouncedHandleSearchedString,
    handleSearchClick,
  };
}
