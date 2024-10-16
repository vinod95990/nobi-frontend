import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import * as Yup from "yup";

import TagServices from "../services/tagServices";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import Loader from "./Common/Loader";
import { useQueryClient } from "@tanstack/react-query";
import NobiServices from "../services/nobiServices";
import { Tag, PlusSquare, XSquare } from "@phosphor-icons/react";
import TooltipCustom from "./Common/TooltipCustom";
import { toast } from "sonner";

export default function AddTagPopover(props) {
  const { linkId } = props;
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const queryClient = useQueryClient();

  const createTagForm = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(1, "Must be atleast 1 pixie or more")
        .required("Tag needs a name!"),
    }),
    onSubmit: handleCreateTag,
    enableReinitialize: true,
  });

  async function handleCreateTag(values) {
    values.linkId = linkId;
    try {
      const res = await NobiServices.createTagAndAttach(values);

      if (res?.unauthorized) {
        toast.info("Please login again!");
        router.push("/guard-gate");
      }

      if (res?.error) {
        toast.error(res?.error);
        return null;
      }

      queryClient.invalidateQueries(["getLinkTags"]);
    } catch (error) {
      toast.error("An error occurred, please try again.");
    } finally {
      setIsTagPopoverOpen(false);
    }
  }

  function handleClose() {
    setIsTagPopoverOpen(false);
  }

  return (
    <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
      <PopoverTrigger>
        <div className="border-2  border-[#0b1215] text-[#0b1215] flex p-2 gap-2 text-base tracking-wider items-center justify-center rounded-md">
          <p>Add New Tag</p>
          <Tag size={16} color="#0b1215" weight="fill" className="" />
        </div>
      </PopoverTrigger>
      <PopoverContent className=" " align="start">
        <form
          onSubmit={createTagForm.handleSubmit}
          className=" flex gap-4 p-2 items-center justify-center text-base"
        >
          <div className="flex items-start flex-col justify-center gap-2">
            <Input
              placeholder="Tag name"
              id="name"
              name="name"
              type="text"
              className=" tracking-wider text-sm sm:text-lg border-[#0b1215]"
              onChange={createTagForm.handleChange}
              value={createTagForm.values.name}
            />

            {createTagForm.touched.name && createTagForm.errors.name ? (
              <div className="text-lg  text-rose-400	text-center">
                {"{ "} {createTagForm.errors.name} {" }"}
              </div>
            ) : (
              <></>
            )}
          </div>
          {createTagForm.isSubmitting ? (
            <div className="relative my-3">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-2">
              <TooltipCustom
                trigger={
                  <PlusSquare
                    size={28}
                    onClick={createTagForm.submitForm}
                    color="#0b1215"
                    weight="fill"
                    className="hover:border-2 hover:border-[#0b1215] hover:p-1  transition-all hover:rounded-md"
                  />
                }
                content="Add tag"
                side="top"
              />

              <TooltipCustom
                trigger={
                  <XSquare
                    size={28}
                    type="button"
                    onClick={handleClose}
                    color="#0b1215"
                    weight="fill"
                    className="hover:border-2 hover:border-[#0b1215] hover:p-1  transition-all hover:rounded-md"
                  />
                }
                content="Cancel"
                side="bottom"
              />
            </div>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
}
