import { TriangleAlertIcon, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface props {
    variant: "info" | "warning";
    text: string;
}

const ToolTipMessage = ({ variant, text }: props) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={(e) => e.preventDefault()}>
                    {variant === "info" && <InfoIcon />}
                    {variant === "warning" && <TriangleAlertIcon />}
                </TooltipTrigger>
                <TooltipContent>{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ToolTipMessage;
