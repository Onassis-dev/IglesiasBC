import { cn } from "@/lib/utils";

interface props {
    className?: string;
    children: any;
}

const StatsGrid = ({ className, children }: props) => {
    return <div className={cn("w-full grid md:grid-cols-3 gap-3 md:gap-6 justify-stretch mb-8", className)}>{children}</div>;
};

const OptionsGrid = ({ className, children }: props) => {
    return <div className={cn("flex justify-between gap-2", className)}>{children}</div>;
};

export { StatsGrid, OptionsGrid };
