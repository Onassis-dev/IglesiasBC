import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            outline: "text-foreground bg-muted border-muted",
            destructive: "border-destructive-background bg-destructive-background text-destructive hover:bg-destructive/80",
            blue: "border-blue-background bg-blue-background text-blue hover:bg-destructive/80",
            orange: "border-orange-background bg-orange-background text-orange hover:bg-destructive/80",
            cyan: "border-cyan-background bg-cyan-background text-cyan hover:bg-destructive/80",
            purple: "border-purple-background bg-purple-background text-purple hover:bg-destructive/80",
            yellow: "border-yellow-background bg-yellow-background text-yellow hover:bg-destructive/80",
            green: "border-green-background bg-green-background text-green hover:bg-destructive/80",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
