import { Input as NextInput } from "@nextui-org/react";
import { cn } from "../../lib/utils";

const Input = ({
    label,
    className,
    classNames,
    variant = "bordered",
    color = "primary",
    icon: Icon,
    ...props
}) => {
    return (
        <NextInput
            label={label}
            variant={variant}
            color={color}
            labelPlacement="outside"
            startContent={Icon ? <Icon className="text-stone-400 w-4 h-4" /> : null}
            classNames={{
                ...classNames,
                inputWrapper: cn(
                    "bg-white shadow-sm hover:bg-stone-50 transition-colors",
                    "data-[hover=true]:bg-stone-50",
                    "group-data-[focus=true]:bg-white group-data-[focus=true]:shadow-md group-data-[focus=true]:border-emerald-500",
                    classNames?.inputWrapper
                ),
                label: cn("!text-stone-600 font-medium mb-1", classNames?.label),
            }}
            className={cn("mb-2", className)}
            {...props}
        />
    );
};

export default Input;
