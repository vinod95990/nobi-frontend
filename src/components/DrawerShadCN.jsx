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
import { toast } from "react-toastify";
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

export default function DrawerShadCN() {
  const router = useRouter();

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
        toast.info("Please login again!", {
          className: "toast-message",
        });
        router.push("/guard-gate");
      }

      if (error) {
        toast.error(error, {
          className: "toast-message",
        });
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
  }
  return (
    <Drawer
      disablePreventScroll={false}
      noBodyStyles={true}
      setBackgroundColorOnScale={true}
      modal={false}
      onOpenChange={handleDrawerClose}
      className=""
    >
      <DrawerTrigger>
        <Button className="sm:text-2xl text-lg rotate-[270deg]  -left-1 tracking-wider fixed bottom-10 bg-transparent border-2 text-[#3d3266]    hover:text-white border-[#3d3266]  hover:bg-[#3d3266]">
          Search
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#fff] border-[#060708]	 border-2	items-center">
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
        <Folders
          pageType={pageTypes.drawerKeyword}
          folderData={queryData?.data?.data}
          isLoading={isLoading}
        />
        <DrawerFooter>
          <DrawerClose>
            <Button
              type="submit"
              className="hover:shiny-text text-base sm:text-lg bg-white text-[#060708] border-[#060708]	 border-2 outline-none hover:text-white hover:bg-[#060708]"
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
