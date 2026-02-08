import { Button as NextButton } from "@nextui-org/react";
import { cn } from "../../lib/utils";

const Button = ({
    children,
    variant = "primary", // Map old variants to NextUI colors/variants
    size = "md",
    className,
    loading = false,
    icon: Icon,
    iconPosition = "left",
    ...props
}) => {
    // Map our custom variants to NextUI props + classes
    const getVariantProps = () => {
        switch (variant) {
            case "primary":
                return { color: "primary", variant: "solid" };
            case "secondary":
                return { color: "secondary", variant: "solid" };
            case "outline":
                return { variant: "bordered", color: "default" }; // or primary depending on need
            case "ghost":
                return { variant: "light", color: "default" };
            case "danger":
                return { color: "danger", variant: "solid" };
            case "success":
                return { color: "success", variant: "solid" };
            case "luxury":
                return {
                    className: "bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/30 border-none",
                    variant: "solid"
                };
            case "gold":
                return {
                    className: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-amber-500/30 border-none",
                    variant: "solid"
                };
            default:
                return { color: "primary", variant: "solid" };
        }
    };

    const { className: variantClasses, ...nextUiProps } = getVariantProps();

    return (
        <NextButton
            isLoading={loading}
            size={size}
            className={cn(
                "font-semibold",
                variantClasses,
                className
            )}
            {...nextUiProps}
            {...props}
        >
            {Icon && iconPosition === "left" && !loading && <Icon className="w-4 h-4 mr-1" />}
            {children}
            {Icon && iconPosition === "right" && !loading && <Icon className="w-4 h-4 ml-1" />}
        </NextButton>
    );
};

export default Button;
