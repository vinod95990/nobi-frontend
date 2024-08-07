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
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import NobiServices from "../services/nobiServices";
import { toast } from "react-toastify";
import Loader from "./Common/Loader";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LinkExistsAlert(props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    // this got set in add modal when response from server has linkAlreadyExists flag
    linkExistsResponseData,
    setLinkExistsResponseData,
    // slug(/id) used to determine which folder user is currently at
    slug = null,
  } = props;
  const { message, linkData } = linkExistsResponseData;
  const queryClient = useQueryClient();

  function navigateTo(path = "/") {
    //path is null -> that means take user to root
    path = path || "/";
    router.push(`/${path}`);
    setLinkExistsResponseData(false);
  }

  async function moveLinkHere() {
    setIsLoading(true);
    const res = await NobiServices.moveFolder({
      childId: linkData?.linkId,
      parentId: slug,
    });

    if (res?.unauthorized) {
      toast.info("Please login again!", {
        className: "toast-message",
      });
      setIsLoading(false);
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(res?.error, {
        className: "toast-message",
      });
      setIsLoading(false);
      return null;
    }

    queryClient.invalidateQueries();
    // closing this alert dialog
    setIsLoading(false);
    setLinkExistsResponseData(false);
  }

  function triggerBtns(z) {
    if (!z) return <></>;
    const { routeTo, existsInDiffFolder } = z;

    /*agar routeTo is falsy and existsInDiffFolder is false toh this results in true 
      routeTo can be null(if the link is on root folder) , false(if user is currently at the folder that link is in)
      toh routeTo -> false yani route ni karna banda usi jagah pe hai jahan link hai, routeTo -> null yani bande is in diff folder usse route pe lejao
      toh dono case mei falsy value is there, that's why this existsInDi.. is returned in response from server

      ki existsInDiff -> true (yani routing honi hai), if false routing nhi honi

      toh isse routeTo jab null hoga vo wala case will be handled ki route karna hai hume it is indicating ki root 
      pe lejao toh dusra existsInDif.. wala check will help in here ki bahi <></> return mat kar dusre folder mei jane
      ka btn show kar

      case routeTo -> false, existsIn.. -> false (ki route mat kar and exists wala indicates ki dusre folder mei nhi hai)
      case routeTo -> null, existsIn.. -> true (ki routeTo saying route to root folder and exists bhi keh rha hai dusre folder mei jana hai )
      
    */

    if (!routeTo && !existsInDiffFolder) {
      return <></>;
    }

    // if link exists in dustbin, take user to there
    if (routeTo == "/dustbin") {
      return (
        <>
          <AlertDialogAction
            className="tracking-widest "
            onClick={() => navigateTo("dustbin")}
          >
            To dustbin
          </AlertDialogAction>
        </>
      );
    }
    // if link exists in some other folder

    return (
      <>
        <Button
          className="tracking-widest "
          onClick={() => navigateTo(routeTo)}
        >
          Take me to it
        </Button>
        <Button className="tracking-widest" onClick={moveLinkHere}>
          Move that link here
        </Button>
      </>
    );
  }

  return (
    <AlertDialog
      open={linkExistsResponseData}
      onOpenChange={(val) => {
        setLinkExistsResponseData(val);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium text-xl">
            {isLoading ? "Wait..." : message}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base font-mono text-[#3d3266]">
            {isLoading ? "" : message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <AlertDialogFooter>
            {triggerBtns(linkData)}
            <AlertDialogCancel className="tracking-widest">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
