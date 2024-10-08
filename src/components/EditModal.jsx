"use client";
import { useFormik } from "formik";
import "./AddModal.css";
import NobiServices from "../services/nobiServices";
import * as Yup from "yup";
import { nobiDocType } from "../constants/NobiConstants";
import Loader from "./Common/Loader";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

export default function EditModal(props) {
  const { data, setOpenEditModal, openEditModal } = props;
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      newName: data?.name,
    },
    validationSchema: Yup.object({
      newName: Yup.string()
        .trim()
        .min(1, "Must be atleast 1 pixie or more")
        .required("Every spirit scroll needs a name!"),
    }),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  async function handleSubmit(values) {
    let res = null;
    if (data.type == nobiDocType.folder) {
      res = await NobiServices.updateFolderName({
        folderId: data?._id,
        ...values,
      });
    } else {
      res = await NobiServices.updateLinkName({ linkId: data?._id, ...values });
    }

    if (res?.unauthorized) {
      toast.info("Please login again!");
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(error);
      return null;
    }

    queryClient.invalidateQueries();
    handleCloseModal();
  }

  function handleCloseModal() {
    setOpenEditModal(false);
  }

  if (!openEditModal) {
    return <></>;
  }

  return (
    <div
      className=" parent-addModal"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="add-modal  w-3/4  sm:w-1/2">
        <div
          className="absolute -top-0 -right-0  cursor-pointer   rounded-md"
          onClick={handleCloseModal}
        >
          <Image
            src="/icons/x-square-bold.svg"
            className="bg-white rounded-md"
            alt="close"
            width={35}
            height={35}
          ></Image>
        </div>
        <p
          className="text-[#f4f5f0] text-xl bg-[#3d3266] shiny-text text-center py-3"
          style={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          {`Edit ${data.type == nobiDocType.folder ? "Folder" : "Link"} Name`}
        </p>
        <form
          onSubmit={formik.handleSubmit}
          className=" flex gap-4 flex-col p-2 items-center justify-center text-base"
        >
          <div className="w-full">
            <div className="rounded-lg  font-sans doodle-input">
              <input
                placeholder="Owls requires a scroll name"
                id="newName"
                name="newName"
                type="text"
                className="w-full p-3"
                onChange={formik.handleChange}
                style={{
                  outline: "none",
                  background: "transparent !important",
                }}
                value={formik.values.newName}
              ></input>
            </div>

            {formik.touched.newName && formik.errors.newName ? (
              <div className="text-lg  text-rose-400	text-center">
                {"{ "} {formik.errors.newName} {" }"}
              </div>
            ) : (
              <></>
            )}
          </div>
          {formik.isSubmitting ? (
            <div className="relative my-3">
              <Loader />
            </div>
          ) : (
            <div className="w-full flex items-center  gap-2 p-3">
              <button
                className="border-2 w-full  rounded-xl border-[#3d3266] bg-[#7152E1] text-[#fff] p-2 hover:bg-[#3d3266] hover:text-[#fff] transition-colors cursor-pointer tracking-wide"
                type="submit"
                disabled={
                  formik.isSubmitting || Object.keys(formik.errors).length > 0
                    ? true
                    : false
                }
              >
                <p className="text-[#fff] text-sm sm:text-xl">
                  {`Edit ${
                    data.type == nobiDocType.folder ? "Folder" : "Link"
                  }`}{" "}
                  Name
                </p>
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
