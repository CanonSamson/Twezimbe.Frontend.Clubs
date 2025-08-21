import { FC, MouseEventHandler } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  hidden?: boolean;
  handleClick?: MouseEventHandler<HTMLButtonElement> | undefined
  disabled?: boolean;
}

const Hint: FC<HintProps> = ({
  label,
  children,
  side = "top",
  align = "center",
  hidden = false,
  handleClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={handleClick} hidden={hidden} asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="bg-black text-white border"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
