import { Chip } from "@nextui-org/react";
import { cn } from "../../lib/utils";

const Badge = ({
    children,
    variant = "default", // default, success, warning, error, info
    size = "md",
    className,
    ...props
}) => {
    const colorMap = {
        default: "default",
        success: "success",
        warning: "warning",
        error: "danger",
        danger: "danger",
        info: "primary",
        secondary: "secondary",
    };

    const sizeMap = {
        sm: "sm",
        md: "md",
        lg: "lg",
    };

    return (
        <Chip
            color={colorMap[variant] || "default"}
            size={sizeMap[size] || "md"}
            variant="flat" // 'flat' looks best for badges usually
            className={cn("font-medium", className)}
            classNames={{
                content: "font-semibold",
            }}
            {...props}
        >
            {children}
        </Chip>
    );
};

export default Badge;
