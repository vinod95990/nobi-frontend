import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NobiServices from "@/src/services/nobiServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AddTagPopover from "../AddTagPopover.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Formik, Field, Form, useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eraser, Highlighter, Tag } from "@phosphor-icons/react";
import TooltipCustom from "./TooltipCustom.jsx";
import { Input } from "@/components/ui/input";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TagServices from "@/src/services/tagServices.js";

export default function DropDownWithOptions({ linkId }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null); // Store the tag for editing
  const [tagToDelete, setTagToDelete] = useState(null); // Store the tag for deletion

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getLinkTags", linkId],
    queryFn: () => NobiServices.getLinkTags({ linkId }),
    enabled: isPopoverOpen,
    cacheTime: 0,
    staleTime: 0,
  });

  const handlePopoverOpen = (open) => {
    setIsPopoverOpen(open);
    if (open && !data) {
      refetch();
    }
  };

  const handleSubmitTags = async (addedTags, removedTags, setSubmitting) => {
    try {
      const { error, unauthorized } = await NobiServices.updateTags({
        linkId,
        addTagIds: addedTags,
        removeTagIds: removedTags,
      });

      if (unauthorized) {
        toast.info("Please login again!");
        router.push("/guard-gate");
        return;
      }
      if (error) {
        toast.error(error);
      }
      await refetch();
      setIsPopoverOpen(false);
    } catch (error) {
      toast.error("An error occurred, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const editTagForm = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(1, "Must be at least 1 character")
        .required("Tag needs a name!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data, error, unauthorized } = await TagServices.updateTag({
          tagId: selectedTag._id,
          newName: values.name,
        });
        if (unauthorized) {
          toast.info("Please login again!");
          router.push("/guard-gate");
          return;
        }
        if (error) {
          toast.error(error);
        }
      } catch (error) {
        toast.error("An error occurred, please try again.");
      } finally {
        setSelectedTag(null);
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const handleEditClick = (tag) => {
    setSelectedTag(tag);
    editTagForm.setFieldValue("name", tag.name);
  };

  const handleDeleteClick = (tag) => {
    setTagToDelete(tag);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      const { error, unauthorized } = await TagServices.deleteTag({ tagId });

      if (unauthorized) {
        toast.info("Please login again!");
        router.push("/guard-gate");
        return;
      }
      if (error) {
        toast.error(error);
      } else {
        toast.success("Tag deleted successfully.");
        await refetch();
        setTagToDelete(null); // Close the delete modal after successful deletion
      }
    } catch (error) {
      toast.error("An error occurred while deleting the tag.");
    }
  };

  return (
    <Popover onOpenChange={handlePopoverOpen} side="top">
      <PopoverTrigger className="w-full">
        <div className="flex items-center gap-1 text-base justify-end mr-2">
          <TooltipCustom
            trigger={
              <Tag
                size={17}
                color={isPopoverOpen ? "#7152e1" : "#0b1215"}
                weight="fill"
              />
            }
            content="Tags here"
            side="top"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[260px] tracking-wider"
        align="start"
        side="top"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {isLoading && <>. . .</>}

        {data?.data && (
          <Formik
            initialValues={{
              selectedTags: data?.data?.associatedTags.map((tag) => tag._id),
              initialTags: data?.data?.associatedTags.map((tag) => tag._id),
            }}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              const addedTags = values.selectedTags.filter(
                (tagId) => !values.initialTags.includes(tagId)
              );
              const removedTags = values.initialTags.filter(
                (tagId) => !values.selectedTags.includes(tagId)
              );
              handleSubmitTags(addedTags, removedTags, setSubmitting);
            }}
          >
            {({ values, setFieldValue, dirty, isSubmitting }) => (
              <Form>
                <Command className="h-[200px]">
                  <CommandInput placeholder="Search tag" />
                  <CommandList>
                    <CommandGroup heading="Chosen">
                      {data?.data?.associatedTags.map((tag) => (
                        <CommandItem key={tag._id}>
                          <label className="flex items-start gap-2 w-full">
                            <Field
                              type="checkbox"
                              name="selectedTags"
                              className="appearance-none h-5 w-5 sm:h-7 sm:w-7 border-2 border-[#0b1215] rounded-sm checked:bg-[#0b1215] checked:border-transparent checked:after:content-['^'] checked:after:text-white   after:flex after:justify-center after:items-center"
                              value={tag._id}
                              checked={values.selectedTags.includes(tag._id)}
                              onChange={() => {
                                if (values.selectedTags.includes(tag._id)) {
                                  setFieldValue(
                                    "selectedTags",
                                    values.selectedTags.filter(
                                      (t) => t !== tag._id
                                    )
                                  );
                                } else {
                                  setFieldValue("selectedTags", [
                                    ...values.selectedTags,
                                    tag._id,
                                  ]);
                                }
                              }}
                            />
                            <p>{tag.name}</p>
                          </label>
                          <div
                            className="flex gap-2 items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Highlighter
                              size={20}
                              color="#0b1215"
                              weight="bold"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(tag);
                              }}
                            />
                            <Eraser
                              size={20}
                              color="red"
                              weight="bold"
                              onClick={() => handleDeleteClick(tag)}
                            />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Forsaken">
                      {data?.data?.unassociatedTags.map((tag) => (
                        <CommandItem key={tag._id}>
                          <label className="flex items-start gap-2 w-full">
                            <Field
                              type="checkbox"
                              name="selectedTags"
                              className="appearance-none h-5 w-5 sm:h-7 sm:w-7 border-2 border-[#0b1215] rounded-sm checked:bg-[#0b1215] checked:border-transparent checked:after:content-['^'] checked:after:text-white   after:flex after:justify-center after:items-center"
                              value={tag._id}
                              checked={values.selectedTags.includes(tag._id)}
                              onChange={() => {
                                if (values.selectedTags.includes(tag._id)) {
                                  setFieldValue(
                                    "selectedTags",
                                    values.selectedTags.filter(
                                      (t) => t !== tag._id
                                    )
                                  );
                                } else {
                                  setFieldValue("selectedTags", [
                                    ...values.selectedTags,
                                    tag._id,
                                  ]);
                                }
                              }}
                            />
                            <p>{tag.name}</p>
                          </label>
                          <div className="flex gap-2 items-center">
                            <Highlighter
                              size={20}
                              weight="bold"
                              className="text-[#0b1215] hover:text-blue-800"
                              onClick={() => handleEditClick(tag)}
                            />
                            <Eraser
                              size={20}
                              weight="bold"
                              className="text-red-600 hover:text-blue-800"
                              onClick={() => handleDeleteClick(tag)}
                            />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>

                <Separator className="my-3" />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={!dirty || isSubmitting}
                    className="bg-[#0b1215] tracking-widest text-white  rounded-md"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        <Separator className="my-3" />
        <div className="flex flex-col gap-2 text-sm tracking-wider">
          <AddTagPopover linkId={linkId} />
        </div>
      </PopoverContent>

      {/* Dialog for Editing Tag */}
      {selectedTag && (
        <Dialog
          open={Boolean(selectedTag)}
          onOpenChange={() => setSelectedTag(null)}
        >
          <DialogContent
            onContextMenu={(e) => e.stopPropagation()}
            className="text-[#0b1215]"
          >
            <DialogHeader>
              <DialogTitle className="tracking-wider flex items-center gap-3 text-xl text-[#0b1215] mb-2">
                <p>Edit Tag</p>
                <div className="flex items-center gap-2 bg-[#0b1215] px-2 py-1 text-lg rounded-md font-normal">
                  <Tag size={16} color="white" weight="fill" />

                  <span className="text-white ">{selectedTag.name}</span>
                </div>
              </DialogTitle>
              <p className=" font-mono tracking-normal">
                This change will be permanent and the tag will be renamed
                everywhere.
              </p>
            </DialogHeader>
            <form
              onSubmit={editTagForm.handleSubmit}
              className="flex flex-col gap-2"
            >
              <Input
                placeholder="Tag name"
                id="name"
                name="name"
                type="text"
                className="tracking-wider border-[#0b1215] text-xl"
                onChange={editTagForm.handleChange}
                value={editTagForm.values.name}
              />
              {editTagForm.touched.name && editTagForm.errors.name ? (
                <div className="text-red-500 text-sm">
                  {editTagForm.errors.name}
                </div>
              ) : null}

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#0b1215] text-white tracking-widest"
                  disabled={!editTagForm.dirty || editTagForm.isSubmitting}
                >
                  {editTagForm.isSubmitting ? "Submitting..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for Deleting Tag */}
      {tagToDelete && (
        <Dialog
          open={Boolean(tagToDelete)}
          onOpenChange={() => setTagToDelete(null)}
        >
          <DialogContent
            className="text-[#0b1215]"
            onContextMenu={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle className="tracking-wider flex items-center gap-3 text-xl text-[#0b1215] mb-2">
                <p>Delete Tag</p>
                <div className="flex items-center gap-2 bg-[#0b1215] px-2 py-1 text-lg rounded-md font-normal">
                  <Tag size={16} color="white" weight="fill" />

                  <span className="text-white ">{tagToDelete.name}</span>
                </div>
              </DialogTitle>
              <p className="font-mono tracking-normal">
                Are you sure you want to delete this tag? This action cannot be
                undone, and the tag will be permanently removed from every link
                it is associated with.
              </p>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-red-600 text-white tracking-widest hover:bg-black"
                onClick={() => handleDeleteTag(tagToDelete._id)}
              >
                Delete Permanently
              </Button>
              <Button
                className="bg-white border-2 border-[#0b1215] text-[#0b1215] rounded-md hover:bg-[#0b1215] hover:text-white tracking-widest"
                onClick={() => setTagToDelete(null)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Popover>
  );
}
