import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Triangle, Path } from "@phosphor-icons/react";
import TooltipCustom from "./Common/TooltipCustom";
import { Separator } from "@/components/ui/separator";
import useNobi from "../hooks/useNobi";
function SharedLinkCard(props) {
  const { sharedLink, copySharedFolderLink, routeToSharedFolder } = props;

  return (
    <Card className="-m-3 bg-[#0b1215] text-white">
      <CardHeader className="m-0 py-2">
        <CardTitle className="tracking-widest font-normal text-base sm:text-lg space-y-0">
          Share current folder
        </CardTitle>
      </CardHeader>
      <CardContent className="m-0">
        <div className="flex  items-center flex-row gap-2">
          <Input
            value={sharedLink || "NOT GENERATED"}
            disabled
            className="text-[#0b1215] text-sm sm:text-base bg-white"
          />
          <div className="flex flex-col justify-center items-center gap-2">
            <TooltipCustom
              trigger={
                <Copy
                  size={28}
                  onClick={copySharedFolderLink}
                  color="#fcfcfc"
                  weight="fill"
                  className="hover:border-2 hover:border-white hover:p-1  transition-all hover:rounded-md"
                />
              }
              content="Copy link"
              side="top"
            />

            <TooltipCustom
              trigger={
                <Path
                  size={28}
                  onClick={routeToSharedFolder}
                  color="#fcfcfc"
                  weight="fill"
                  className="hover:border-2 hover:border-white hover:p-1  transition-all hover:rounded-md"
                />
              }
              content="Open link"
              side="bottom"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SharedLinkCard;
