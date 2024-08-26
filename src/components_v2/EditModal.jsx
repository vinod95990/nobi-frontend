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

export default function EditModal(props) {
  const { data, openEditModal, setOpenEditModal } = props;

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
      setOpenEditModal(false);
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(error);
      setOpenEditModal(false);
      return null;
    }
    setOpenEditModal(false);
    queryClient.invalidateQueries();
  }

  if (!data) return <></>;

  return (
    <AlertDialog open={openEditModal} onOpenChange={setOpenEditModal}>
      <AlertDialogTrigger asChild>
        <></>
      </AlertDialogTrigger>

      <AlertDialogContent className="p-3 outline-none">
        <AlertDialogHeader> </AlertDialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="tracking-widest font-medium">
              Edit Nobi
            </CardTitle>
            <CardDescription className="tracking-widest ">
              Edit your doc in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label
                    htmlFor="newName"
                    className="flex items-center gap-3 tracking-wider text-base sm:text-lg"
                  >
                    <p>{`Edit ${
                      data.type == nobiDocType.folder ? "Folder" : "Link"
                    } Name`}</p>
                    {formik.touched.newName && formik.errors.newName ? (
                      <div className="text-lg  text-rose-400	text-center">
                        {"[ "} {formik.errors.newName} {" ]"}
                      </div>
                    ) : (
                      <></>
                    )}
                  </Label>
                  <div className="auth-doodle-input">
                    <input
                      placeholder="Owls requires a name"
                      id="newName"
                      name="newName"
                      type="text"
                      className=" tracking-wider text-base sm:text-lg"
                      onChange={formik.handleChange}
                      style={{
                        outline: "none",
                        background: "transparent !important",
                      }}
                      value={formik.values.newName}
                    ></input>
                  </div>
                </div>
              </div>
              <CardFooter className="flex justify-end gap-4 pt-10">
                {formik.isSubmitting ? (
                  <div className=" z-20">
                    <Loader />
                  </div>
                ) : (
                  <>
                    <AlertDialogCancel className=" tracking-wider text-base sm:text-lg">
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      className="bg-[#0b1215] hover:bg-black tracking-wider text-base sm:text-lg"
                      type="submit"
                      disabled={
                        formik.isSubmitting ||
                        Object.keys(formik.errors).length > 0
                          ? true
                          : false
                      }
                    >
                      Edit
                    </Button>
                  </>
                )}
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
