"use client";
import { useFormik } from "formik";
import "./AddModal.css";
import NobiServices from "../services/nobiServices";
import * as Yup from "yup";
import { nobiDocType } from "../constants/NobiConstants";
import Loader from "./Common/Loader";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

export default function AddModal(props) {
  const {
    type,
    parentId = null,
    setAddModalType,
    setLinkExistsResponseData,
  } = props;
  const queryClient = useQueryClient();

  const folderForm = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(1, "Must be atleast 1 pixie or more")
        .required("Every spirit scroll needs a name!"),
    }),
    onSubmit: handleAddFolder,
    enableReinitialize: true,
  });

  const linkForm = useFormik({
    initialValues: {
      customName: "",
      link: "",
    },
    validationSchema: Yup.object({
      customName: Yup.string()
        .trim()
        .min(1, "Must be atleast 1 pixie or more")
        .required("Every spirit scroll needs a name!"),
      link: Yup.string().required("Every spirit scroll needs a house!"),
    }),
    onSubmit: handleAddLink,
    enableReinitialize: true,
  });

  async function handleAddFolder(values) {
    if (parentId) {
      values.parentId = parentId;
    }
    const res = await NobiServices.addFolder(values);

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

    handleCloseModal();
  }

  async function handleAddLink(values) {
    if (parentId) {
      values.parentId = parentId;
    }
    const res = await NobiServices.addLink(values);

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

    // that link already exists alert
    if (res?.data?.linkAlreadyExists) {
      setLinkExistsResponseData(res?.data);
      // return;
    }

    queryClient.invalidateQueries();

    handleCloseModal();
  }

  function handleCloseModal() {
    setAddModalType(null);
  }

  if (!type) {
    return <></>;
  }

  return type == nobiDocType.folder ? (
    <div className=" parent-addModal">
      <div className="add-modal w-3/4  sm:w-1/2 ">
        <div
          className="absolute -top-0 -right-0  cursor-pointer   rounded-md"
          onClick={handleCloseModal}
        >
          <Image
            src="/icons/x-square-bold.svg"
            alt="close"
            width={35}
            height={35}
            className="bg-white rounded-md"
          ></Image>
        </div>
        <p
          className="text-[#fff] text-xl bg-[#3d3266] shiny-text text-center py-3"
          style={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          Add Folder
        </p>
        <form
          onSubmit={folderForm.handleSubmit}
          className=" flex gap-4 flex-col p-2 items-center justify-center text-base"
        >
          <div className="w-full">
            <div className="rounded-lg  font-sans doodle-input">
              <input
                placeholder="Owls requires a scroll name"
                id="name"
                name="name"
                type="text"
                className="w-full p-3"
                onChange={folderForm.handleChange}
                style={{
                  outline: "none",
                  background: "transparent !important",
                }}
                value={folderForm.values.name}
              ></input>
            </div>

            {folderForm.touched.name && folderForm.errors.name ? (
              <div className="text-lg  text-rose-400	text-center">
                {"{ "} {folderForm.errors.name} {" }"}
              </div>
            ) : (
              <></>
            )}
          </div>
          {folderForm.isSubmitting ? (
            <div className="relative my-3">
              <Loader />
            </div>
          ) : (
            <div className="w-full flex items-center  gap-2 p-3">
              <button
                className="border-2 w-full  rounded-xl border-[#3d3266] bg-[#7152E1] text-[#fff] p-2 hover:bg-[#3d3266] hover:text-[#fff] transition-colors cursor-pointer tracking-wide"
                type="submit"
                disabled={
                  folderForm.isSubmitting ||
                  Object.keys(folderForm.errors).length > 0
                    ? true
                    : false
                }
              >
                <p className="text-[#fff] text-sm sm:text-xl ">Add Folder</p>
              </button>
              <button
                className="border-2 rounded-xl  w-full border-[#3d3266] text-[#3d3266] hover:text-[#fff]  p-2 hover:bg-[#3d3266]  transition-colors cursor-pointer   tracking-wide"
                onClick={handleCloseModal}
              >
                <p className=" text-base sm:text-xl">Cancel</p>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  ) : (
    <div className=" parent-addModal">
      <div className="add-modal  w-3/4  sm:w-1/2">
        <div
          className="absolute -top-0 -right-0   rounded-md"
          onClick={handleCloseModal}
        >
          <Image
            src="/icons/x-square-bold.svg"
            alt="close"
            width={35}
            height={35}
            loading="lazy"
            className="bg-white rounded-md"
          ></Image>
        </div>
        <p
          className="text-[#fff] text-xl bg-[#3d3266] shiny-text text-center py-3"
          style={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          Add Link
        </p>
        <form
          onSubmit={linkForm.handleSubmit}
          className=" flex gap-4 flex-col p-2 items-center justify-center text-base"
        >
          <div className="w-full">
            <div className="rounded-lg  font-sans doodle-input">
              <input
                placeholder="Owls requires a scroll name"
                id="customName"
                name="customName"
                type="text"
                className="w-full p-3"
                onChange={linkForm.handleChange}
                style={{
                  outline: "none",
                  background: "transparent !important",
                }}
                value={linkForm.values.customName}
              ></input>
            </div>
            {linkForm.touched.customName && linkForm.errors.customName ? (
              <div className="text-lg text-rose-400	text-center ">
                {"{ "} {linkForm.errors.customName} {" }"}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full">
            <div className="rounded-lg  font-sans doodle-input">
              <input
                placeholder="Owls requires a link"
                id="link"
                name="link"
                type="text"
                className="w-full p-3"
                onChange={linkForm.handleChange}
                style={{
                  outline: "none",
                  background: "transparent !important",
                }}
                value={linkForm.values.link}
              ></input>
            </div>
            {linkForm.touched.link && linkForm.errors.link ? (
              <div className="text-lg text-rose-400	text-center">
                {"{ "} {linkForm.errors.link} {" }"}
              </div>
            ) : (
              <></>
            )}
          </div>

          {linkForm.isSubmitting ? (
            <div className="relative my-3">
              <Loader />
            </div>
          ) : (
            <div className="w-full flex items-center  gap-2 p-3">
              <button
                className="border-2 w-full  rounded-xl border-[#3d3266] bg-[#7152E1] text-[#fff] p-2 hover:bg-[#3d3266] hover:text-[#fff] transition-colors cursor-pointer tracking-wide"
                type="submit"
                disabled={
                  Object.keys(linkForm.errors).length > 0 ? true : false
                }
              >
                <p className="text-[#fff] text-base sm:text-xl">Add Link</p>
              </button>
              <button
                className="border-2 rounded-xl  w-full border-[#3d3266] text-[#3d3266] hover:text-[#fff]  p-2 hover:bg-[#3d3266]  transition-colors cursor-pointer   tracking-wide"
                onClick={handleCloseModal}
              >
                <p className=" text-base sm:text-xl">Cancel</p>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
