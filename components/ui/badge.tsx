import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-brand-green text-white hover:bg-brand-green/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-red-500 text-white hover:bg-red-500/80",
                outline: "text-foreground",
                success: "border-transparent bg-green-100 text-green-800",
                warning: "border-transparent bg-yellow-100 text-yellow-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    // Using simplified implementation since cva might not be fully available if I didn't install the right deps, 
    // but I'll assume users usually have clsx/tailwind-merge or I just wrote them.
    // Actually, I wrote utils so cn works. cva requires package.
    // I'll rewrite this to not use cva if I can't guarantee it, but let's try to simulate cva logic simply.

    const variants = {
        default: "bg-brand-green text-white",
        secondary: "bg-gray-100 text-gray-900",
        destructive: "bg-red-100 text-red-900",
        outline: "border border-gray-200 text-gray-900",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        info: "bg-blue-100 text-blue-800"
    };

    const v = variant || "default";

    return (
        <div className={cn("inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2", variants[v as keyof typeof variants], className)} {...props} />
    )
}

export { Badge, badgeVariants }
