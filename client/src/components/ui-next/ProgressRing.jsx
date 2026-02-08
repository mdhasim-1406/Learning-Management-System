import { CircularProgress } from "@nextui-org/react";
import { cn } from "../../lib/utils";

const ProgressRing = ({
    value,
    size = "md",
    color = "primary",
    showValueLabel = false,
    className,
    ...props
}) => {
    return (
        <CircularProgress
            value={value}
            size={size}
            color={color}
            showValueLabel={showValueLabel}
            className={cn(className)}
            classNames={{
                svg: "drop-shadow-md",
                indicator: "stroke-current",
                track: "stroke-stone-100",
                value: "text-xs font-semibold text-stone-600",
            }}
            {...props}
        />
    );
};

export default ProgressRing;
