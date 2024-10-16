import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { twMerge } from "tailwind-merge";
function TooltipCustom(props) {
  const { trigger, content, side, className } = props;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger type="button">{trigger}</TooltipTrigger>
        <TooltipContent
          collisionPadding={20}
          arrowPadding={10}
          side={side || "top"}
          className={twMerge(className, "p-2 text-base")}
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipCustom;
