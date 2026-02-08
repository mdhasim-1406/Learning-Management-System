import { Skeleton as NextSkeleton } from "@nextui-org/react";
import { cn } from "../../lib/utils";

const Skeleton = ({ className, children, ...props }) => {
    return (
        <NextSkeleton className={cn("rounded-lg", className)} {...props}>
            {children}
        </NextSkeleton>
    );
};

export const SkeletonText = ({ lines = 3, className }) => (
    <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className={cn("h-4 w-full", i === lines - 1 && "w-2/3")} />
        ))}
    </div>
);

export const SkeletonCard = ({ className }) => (
    <div className={cn("p-4 border border-stone-100 rounded-2xl space-y-3", className)}>
        <Skeleton className="rounded-lg h-32" />
        <div className="space-y-2">
            <Skeleton className="h-5 w-3/5 rounded-lg" />
            <Skeleton className="h-4 w-4/5 rounded-lg" />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
    <div className="space-y-4">
        <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-1/4 rounded-lg" />
            ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
                {Array.from({ length: cols }).map((_, j) => (
                    <Skeleton key={j} className="h-10 w-1/4 rounded-lg" />
                ))}
            </div>
        ))}
    </div>
);

export default Skeleton;
