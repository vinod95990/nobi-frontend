"use client";
import { useFormik } from "formik";
// import "./AddModal.css";
import NobiServices from "../services/nobiServices";
import * as Yup from "yup";
import { nobiDocType } from "../constants/NobiConstants";
import Loader from "../components/Common/Loader";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import "../components/Signup/Signup.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function AddModal(props) {
  const {
    type,
    parentId = null,
    setAddModalType,
    setLinkExistsResponseData,
  } = props;
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [typeValue, setTypeValue] = useState(nobiDocType.link);
  const folderForm = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(1, "Must be atleast 1 pixie or more")
        .required("Folder needs a name!"),
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
        .required("Link needs a name!"),
      link: Yup.string().required("A link is required!"),
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
      toast.info("Please login again!");
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(res?.error);
      return null;
    }

    queryClient.invalidateQueries();

    setOpenModal(false);
  }

  async function handleAddLink(values) {
    if (parentId) {
      values.parentId = parentId;
    }
    const res = await NobiServices.addLink(values);

    if (res?.unauthorized) {
      toast.info("Please login again!");
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(res?.error);
      return;
    }

    // that link already exists alert
    if (res?.data?.linkAlreadyExists) {
      setLinkExistsResponseData(res?.data);
      // return;
    }

    queryClient.invalidateQueries();

    setOpenModal(false);
  }

  return (
    <AlertDialog onOpenChange={setOpenModal} open={openModal}>
      <AlertDialogTrigger asChild>
        <Button className="bg-[#0b1215] hover:bg-black text-lg sm:text-xl">
          Add
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="p-3 outline-none">
        <AlertDialogHeader> </AlertDialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="tracking-widest font-medium">
              Create Nobi
            </CardTitle>
            <CardDescription className="tracking-widest ">
              Save your new doc in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col  mb-6">
              <Label
                htmlFor="nobi"
                className=" tracking-wider text-base sm:text-lg"
              >
                Type
              </Label>
              <Select
                onValueChange={(val) => setTypeValue(val)}
                defaultValue={typeValue}
              >
                <SelectTrigger
                  id="nobi"
                  className=" tracking-wider text-base sm:text-lg"
                >
                  <SelectValue
                    placeholder="Select"
                    className=" tracking-wider text-base sm:text-lg"
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem
                    value={nobiDocType.folder}
                    className=" tracking-wider text-base sm:text-lg"
                  >
                    Folder
                  </SelectItem>
                  <SelectItem
                    value={nobiDocType.link}
                    className=" tracking-wider text-base sm:text-lg"
                  >
                    Link
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {typeValue == nobiDocType.folder ? (
              <>
                <form onSubmit={folderForm.handleSubmit}>
                  <div className="grid w-full items-center gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="flex items-center gap-3 tracking-wider text-base sm:text-lg"
                      >
                        <p>Name</p>
                        {folderForm.touched.name && folderForm.errors.name ? (
                          <div className="text-lg  text-rose-400	text-center">
                            {"[ "} {folderForm.errors.name} {" ]"}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Label>
                      <div className="auth-doodle-input">
                        <input
                          placeholder="Type in folder name"
                          id="name"
                          name="name"
                          type="text"
                          className=" tracking-wider text-base sm:text-lg"
                          onChange={folderForm.handleChange}
                          style={{
                            outline: "none",
                            background: "transparent !important",
                          }}
                          value={folderForm.values.name}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <CardFooter className="flex justify-end gap-4  my-6">
                    {folderForm.isSubmitting ? (
                      <Loader />
                    ) : (
                      <>
                        <AlertDialogCancel className=" tracking-wider text-base sm:text-lg">
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          className=" tracking-wider text-base sm:text-lg bg-[#0b1215] hover:bg-black"
                          type="submit"
                          disabled={
                            folderForm.isSubmitting ||
                            Object.keys(folderForm.errors).length > 0
                              ? true
                              : false
                          }
                        >
                          Add
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </form>
              </>
            ) : (
              <>
                <form onSubmit={linkForm.handleSubmit}>
                  <div className="grid w-full items-center gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <Label
                        htmlFor="name"
                        className=" tracking-wider text-base sm:text-lg flex items-center gap-3"
                      >
                        <p>Link Name</p>
                        {linkForm.touched.customName &&
                        linkForm.errors.customName ? (
                          <div className="text-lg text-rose-400	text-center ">
                            {"[ "} {linkForm.errors.customName} {" ]"}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Label>
                      <div className="auth-doodle-input">
                        <input
                          placeholder="Give your link a name"
                          id="customName"
                          name="customName"
                          type="text"
                          className="w-full p-3  tracking-wider"
                          onChange={linkForm.handleChange}
                          style={{
                            outline: "none",
                            background: "transparent !important",
                          }}
                          value={linkForm.values.customName}
                        ></input>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label
                        htmlFor="name"
                        className=" tracking-wider text-base sm:text-lg flex items-center gap-3"
                      >
                        <p>Link</p>
                        {linkForm.touched.link && linkForm.errors.link ? (
                          <div className="text-lg text-rose-400	text-center">
                            {"[ "} {linkForm.errors.link} {" ]"}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Label>
                      <div className="auth-doodle-input">
                        <input
                          placeholder="Enter the link in here"
                          id="link"
                          name="link"
                          type="text"
                          className="w-full p-3 tracking-wider"
                          onChange={linkForm.handleChange}
                          style={{
                            outline: "none",
                            background: "transparent !important",
                          }}
                          value={linkForm.values.link}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <CardFooter className="flex justify-end gap-4 pt-10">
                    {linkForm.isSubmitting ? (
                      <div className="relative my-3">
                        <Loader />
                      </div>
                    ) : (
                      <>
                        <AlertDialogCancel className=" tracking-wider text-base sm:text-lg">
                          Cancel
                        </AlertDialogCancel>

                        <Button
                          type="submit"
                          className=" tracking-wider text-base sm:text-lg bg-[#0b1215] hover:bg-black"
                          disabled={
                            Object.keys(linkForm.errors).length > 0
                              ? true
                              : false
                          }
                        >
                          Add
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
