import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ChevronDown, PlusCircleIcon } from "lucide-react";

const buttonVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring  disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    text?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

const SelectButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, children = false, ...props }, ref) => {
    return (
        <Button className={cn("gap-2 flex justify-start shadow-sm", className)} ref={ref} size="sm" {...props} variant={variant || "outline"}>
            <span className="bg-primary-foreground"></span>
            <span className="overflow-hidden w-full text-left">{children}</span>
            <ChevronDown className="size-4 opacity-50" />
        </Button>
    );
});

const RegisterButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, children = false, ...props }, ref) => {
    return (
        <Button className={cn("gap-2 shadow-sm", className)} ref={ref} size="sm" {...props}>
            <PlusCircleIcon className="size-3.5" />
            <span className="hidden sm:block">{children}</span>
        </Button>
    );
});

const ActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, text, children = false, ...props }, ref) => {
    return (
        <Button className={cn("gap-2 shadow-sm", className)} ref={ref} size="sm" variant="outline" {...props}>
            {children}
            <span className="hidden sm:block">{text}</span>
        </Button>
    );
});

export { Button, buttonVariants, RegisterButton, ActionButton, SelectButton };
