import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import NobiServices from "../services/nobiServices";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Formik, Field, Form } from "formik";
import Folders from "./Common/Folders";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import TagServices from "../services/tagServices";
import { ScrollArea } from "@/components/ui/scroll-area";
import { pageTypes } from "../constants/NobiConstants";
import {
  Eraser,
  Highlighter,
  PencilSimple,
  PlusSquare,
  Question,
  Tag,
  TrashSimple,
  XSquare,
} from "@phosphor-icons/react";
import TooltipCustom from "./Common/TooltipCustom";
import { useFormik } from "formik";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";

export default function TagFilterDrawer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null); // Store the tag for editing
  const [tagToDelete, setTagToDelete] = useState(null); // Store the tag for deletion

  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`getLinksByTags`],
    queryFn: () => TagServices.getAllTags(),
    enabled: open, // only refetch tags when the drawer is opened
    staleTime: 0,
  });

  useEffect(() => {
    if (queryData && !isLoading) {
      const { unauthorized, error } = queryData;
      if (unauthorized) {
        toast.info("Please login again!");
        router.push("/guard-gate");
      }
      if (error) {
        toast.error(error);
      }
    }
  }, [queryData, router, isLoading]);

  // Function to handle submitting selected tags
  async function handleSubmitTags(selectedTags, setSubmitting) {
    try {
      const { data, error, unauthorized } = await NobiServices.getLinksByTag({
        tagIds: selectedTags,
      });
      if (unauthorized) {
        toast.info("Please login again!");
        router.push("/guard-gate");
        return;
      }
      if (error) {
        toast.error(error);
        return;
      }

      // Update the state with the returned links data
      setFilteredLinks(data?.data || []);
    } catch (error) {
      toast.error("An error occurred, please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDrawerClose(isOpen) {
    if (!isOpen) {
      setFilteredLinks([]);
    }
    setOpen(isOpen);
  }
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
        await refetch();
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
    <Drawer
      disablePreventScroll={false}
      noBodyStyles={true}
      setBackgroundColorOnScale={true}
      modal={false}
      open={open}
      onOpenChange={handleDrawerClose}
    >
      <DrawerTrigger>
        <Button className="sm:text-xl text-base bg-white border-2 text-[#0b1215] hover:text-white border-[#0b1215] hover:bg-black">
          Tag filter
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#fff] border-[#0b1215] border-2 items-center h-[95%] ">
        <DrawerHeader className="mb-6 justify-items-center">
          <DrawerTitle className="font-normal tracking-wide text-lg sm:text-3xl">
            <p>Choose Tags to Filter Relevant Links</p>
          </DrawerTitle>
        </DrawerHeader>

        {isLoading && <>. . .</>}
        <div className="w-full p-1 grid gap-4 sm:grid-cols-[30%_auto] grid-cols-1">
          {queryData?.data && (
            <Formik
              initialValues={{
                selectedTags: [],
              }}
              enableReinitialize
              onSubmit={(values, { setSubmitting }) => {
                handleSubmitTags(values.selectedTags, setSubmitting);
              }}
            >
              {({ values, setFieldValue, dirty, isSubmitting }) => (
                <Form>
                  <Command className="h-[200px]">
                    <CommandInput placeholder="Search tag" />
                    <CommandList>
                      <CommandGroup heading="Select tags">
                        {queryData?.data?.map((tag) => (
                          <CommandItem key={tag._id}>
                            <label className="flex items-start gap-2 w-full text-base sm:text-lg">
                              <Field
                                type="checkbox"
                                name="selectedTags"
                                className="appearance-none h-5 w-5 sm:h-7 sm:w-7 border-2 border-[#0b1215] rounded-sm checked:bg-[#0b1215] checked:border-transparent checked:after:content-['^'] checked:after:text-white   after:flex after:justify-center after:items-center"
                                value={tag._id}
                                checked={values.selectedTags.includes(tag._id)}
                                onChange={() => {
                                  if (values.selectedTags.includes(tag._id)) {
                                    // Remove from selected tags
                                    setFieldValue(
                                      "selectedTags",
                                      values.selectedTags.filter(
                                        (t) => t !== tag._id
                                      )
                                    );
                                  } else {
                                    // Add to selected tags
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
                  <div className="flex justify-center gap-4 sm:flex-col">
                    <Button
                      type="button"
                      className="bg-white text-[#0b1215] border-2 hover:bg-black hover:text-white border-[#0b1215] tracking-widest rounded-md"
                      onClick={() => {
                        setFieldValue("selectedTags", []), setFilteredLinks([]);
                      }}
                      disabled={isSubmitting}
                    >
                      Clear Filter
                    </Button>
                    <Button
                      type="submit"
                      disabled={!dirty || isSubmitting}
                      className="bg-[#0b1215] tracking-widest text-white rounded-md hover:bg-black transition-all"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
          <Separator
            // orientation="vertical"
            className="my-4 block  sm:hidden"
          />

          {/* Display filtered links after tag selection */}
          <ScrollArea className="h-80 overflow-y-auto w-full  mx-auto ">
            {filteredLinks.length > 0 && (
              <div className="flex items-center gap-2  my-4 ">
                <p className="text-lg ">
                  Total number of links associated -{" "}
                  <span className="text-black text-2xl">
                    {" "}
                    {filteredLinks.length}
                  </span>
                </p>
                <TooltipCustom
                  trigger={
                    <Question
                      size={24}
                      color="#0b1215"
                      weight="fill"
                      className="hover:border-2 hover:border-[#0b1215] hover:p-1  transition-all hover:rounded-md"
                    />
                  }
                  content="Try scrolling to see all links below 😉"
                  side="top"
                />
              </div>
            )}
            <Folders
              pageType={pageTypes.drawerKeyword}
              folderData={filteredLinks}
              isLoading={isLoading}
              width={`60%`}
            />
          </ScrollArea>
          {/* Dialog for Editing Tag */}
          {selectedTag && (
            <Dialog
              open={Boolean(selectedTag)}
              onOpenChange={() => setSelectedTag(null)}
              onContextMenu={(e) => e.stopPropagation()}
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
                    Are you sure you want to delete this tag? This action cannot
                    be undone, and the tag will be permanently removed from
                    every link it is associated with.
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
                    className="bg-white border-2 text-[#0b1215] hover:text-white border-[#0b1215] rounded-md hover:bg-black tracking-widest"
                    onClick={() => setTagToDelete(null)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button className="hover:shiny-text text-base sm:text-lg bg-white text-[#0b1215] border-[#0b1215] border-2 hover:text-white hover:bg-black">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
