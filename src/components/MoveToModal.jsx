"use client";
import { useFormik } from "formik";
import "./AddModal.css";
import NobiServices from "../services/nobiServices";
import * as Yup from "yup";
import { nobiDocType } from "../constants/NobiConstants";
import Loader from "./Common/Loader";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const FolderPig = (props) => {
  const { folder, setSelectedParent, selectedParent, selectedItem } = props;
  const { name, children, _id } = folder;
  return (
    <div className="my-2 ml-11">
      <p
        className={`text-sm w-40 sm:text-lg px-3 py-2 border-2 border-[#3d3266] rounded-md transition-all cursor-pointer ${
          selectedParent?._id == _id
            ? "text-[#fff] bg-[#3d3266] shiny-text"
            : "text-[#3d3266]"
        } ${
          selectedItem?.parentId == folder?._id
            ? "text-[#2a2b29] opacity-40 border-double cursor-none "
            : ""
        }`}
        onClick={() => {
          if (selectedItem?.parentId == folder?._id) {
            return;
          }
          setSelectedParent(folder);
        }}
      >
        {`${name}  ${selectedItem?.parentId == folder?._id ? "(current)" : ""}`}
      </p>
      {children &&
        children.map((child) => (
          <FolderPig
            key={child._id}
            folder={child}
            setSelectedParent={setSelectedParent}
            selectedParent={selectedParent}
            selectedItem={selectedItem}
          />
        ))}
    </div>
  );
};

export default function MoveToModal(props) {
  const { selectedItem, setMoveToModal, hideContextMenu } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedParent, setSelectedParent] = useState();
  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: [
      `getValidFolders`,
      {
        docId: selectedItem?._id,
      },
    ],
    queryFn: () =>
      NobiServices.getValidFoldersToMove({
        docId: selectedItem?._id,
      }),
  });

  async function handleMoveFolder() {
    const res = await NobiServices.moveFolder({
      childId: selectedItem._id,
      parentId:
        selectedParent == "5e8b7a3346a1f02d9b851e5c"
          ? "5e8b7a3346a1f02d9b851e5c"
          : selectedParent._id,
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
      return null;
    }

    queryClient.invalidateQueries();
    setMoveToModal(null);
    handleCloseModal();
  }

  function handleCloseModal() {
    hideContextMenu();
    setMoveToModal(null);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className="parent-addModal"
      onClick={(e) => {
        e.stopPropagation();
        hideContextMenu();
        setMoveToModal(null);
      }}
    >
      <div
        className="add-modal w-3/4  sm:w-1/2 "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="absolute -top-0 -right-0  cursor-pointer   rounded-md"
          onClick={handleCloseModal}
        >
          <img
            src="/icons/x-square-bold.svg"
            alt="close"
            width={35}
            height={35}
            className="bg-white rounded-md"
          ></img>
        </div>
        <p
          className="text-[#fff] text-xl bg-[#3d3266] text-center py-3 "
          style={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          Sorting Hat
        </p>
        <div className="flex-col flex lg:flex-row items-center gap-3 justify-around">
          <div className="flex items-center flex-col m-2  ">
            <img
              src="harry-potter.png"
              alt="close"
              width={45}
              height={45}
              className="bg-white rounded-md"
            ></img>{" "}
            <p className="text-sm sm:text-lg  px-2 py-1 bg-[#3d3266] text-white rounded-md shiny-text">
              {selectedItem?.name}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 flex-col p-3 m-2 w-[75%] ">
            <p className="text-[#3d3266] text-base sm:text-lg">
              Folders(Select One)
            </p>
            <div className="h-44 sm:h-56  w-[100%] sm:w-[100%] md:w-[100%]  overflow-auto p-2 m-1">
              <p
                className={`text-sm sm:text-lg px-3 py-2 border-2 border-[#3d3266] rounded-md transition-all cursor-pointer ${
                  selectedParent == "5e8b7a3346a1f02d9b851e5c"
                    ? "text-[#fff] bg-[#3d3266] shiny-text"
                    : "text-[#3d3266]"
                } ${
                  selectedItem?.parentId === null
                    ? "text-[#2a2b29] opacity-40 cursor-none "
                    : ""
                }`}
                onClick={() => {
                  if (selectedItem?.parentId === null) {
                    return;
                  }
                  setSelectedParent("5e8b7a3346a1f02d9b851e5c");
                }}
              >
                {` Home  ${selectedItem?.parentId === null ? "(current)" : ""}`}
              </p>
              {data?.data?.data &&
                data?.data?.data?.length > 0 &&
                data?.data?.data?.map((folder) => (
                  <FolderPig
                    key={folder._id}
                    folder={folder}
                    setSelectedParent={setSelectedParent}
                    selectedParent={selectedParent}
                    selectedItem={selectedItem}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center  gap-2 p-3">
          <button
            className={`border-2 rounded-xl w-full border-[#3d3266] bg-[#7152E1] text-[#fff] p-2 hover:bg-[#3d3266] hover:text-[#fff] transition-colors cursor-pointer  tracking-wide ${
              !selectedItem || !selectedParent ? "opacity-60" : ""
            }`}
            onClick={handleMoveFolder}
            disabled={!selectedItem || !selectedParent ? true : false}
          >
            <p
              className={`text-[#fff] text-base sm:text-xl ${
                !selectedItem || !selectedParent ? "opacity-60" : ""
              }`}
            >
              Move
            </p>
          </button>
          <button
            className="border-2 rounded-xl w-full border-[#3d3266]  text-[#3d3266] hover:text-[#fff]  p-2 hover:bg-[#3d3266]  transition-colors cursor-pointer   tracking-wide"
            onClick={handleCloseModal}
          >
            <p className=" text-xl">Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
}
