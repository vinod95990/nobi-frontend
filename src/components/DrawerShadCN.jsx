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
import { InputWithButton } from "@/src/components/Common/InputWithButton";
import { useEffect, useState } from "react";
import NobiServices from "../services/nobiServices";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Folders from "./Common/Folders";
import { pageTypes } from "../constants/NobiConstants";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DrawerShadCN() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [searchedString, setSearchedString] = useState("");
  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      `getDrawerFolderData`,
      { searchedString: searchedString || undefined },
    ],
    queryFn: () =>
      NobiServices.searchQQuery({
        searchedString: searchedString || "",
      }),
    enabled: searchedString.length > 0,
  });

  useEffect(() => {
    if (queryData && !isLoading) {
      const { data, error, unauthorized } = queryData;
      if (unauthorized) {
        toast.info("Please login again!");
        router.push("/guard-gate");
      }

      if (error) {
        toast.error(error);
        return;
      }
    }
  }, [queryData, router, isLoading]);

  async function handleSearchClick() {
    if (searchedString.length == 0) return;
    await refetch();
  }

  function onInputChange(e) {
    e.preventDefault();
    setSearchedString(e.target?.value?.trim());
  }

  function handleDrawerClose(isOpen) {
    if (!isOpen) {
      setSearchedString("");
    }
    setOpen(isOpen);
  }
  return (
    <Drawer
      disablePreventScroll={false}
      noBodyStyles={true}
      setBackgroundColorOnScale={true}
      modal={false}
      open={open}
      onOpenChange={handleDrawerClose}
      className=""
    >
      <DrawerTrigger>
        <Button className="sm:text-xl outline-none text-base  bg-white border-2 text-[#0b1215]    hover:text-white border-[#0b1215]  hover:bg-black">
          Search
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#fff] border-[#0b1215]	 border-2	items-center ">
        <DrawerHeader className={"mb-6 justify-items-center"}>
          {/* tooltip */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <Image
                  className="w-8 sm:w-12 "
                  src="/icons/info.png"
                  alt="cards"
                  width={180}
                  height={180}
                  loading="lazy"
                ></Image>
              </TooltipTrigger>
              <TooltipContent
                collisionPadding={20}
                arrowPadding={10}
                className="w-96 p-5 text-base font-mono"
              >
                <p className="font-mono">
                  {" "}
                  Enter keywords separated by spaces to search through your
                  saved public links. For example, type &quot;spiced
                  coffee&quot; to find links containing both terms. Notice that
                  words do not necessarily need to appear near each other as
                  long as they appear in the document somewhere
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DrawerTitle className=" font-normal tracking-wide text-lg sm:text-3xl">
            <p>Search Keywords in Your Links</p>
          </DrawerTitle>
          <InputWithButton
            onSubmit={handleSearchClick}
            onInputChange={onInputChange}
            placeholderText={"Enter keywords"}
          />
          <DrawerDescription className="text-lg text-center tracking-wider w-[60%]"></DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-44 w-[90%] mx-auto ">
          <Folders
            pageType={pageTypes.drawerKeyword}
            folderData={queryData?.data?.data}
            isLoading={isLoading}
            width={`100%`}
          />
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose>
            <Button
              type="submit"
              className="hover:shiny-text text-base sm:text-lg bg-white text-[#0b1215] border-[#0b1215]	 border-2 outline-none hover:text-white hover:bg-black"
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
