import { Avatar as NextAvatar } from "@nextui-org/react";
import { cn } from "../../lib/utils";

const Avatar = ({
    src,
    name,
    size = "md",
    className,
    isBordered = false,
    color = "default",
    ...props
}) => {
    return (
        <NextAvatar
            src={src}
            name={name}
            size={size}
            isBordered={isBordered}
            color={color}
            className={cn(className)}
            {...props}
        />
    );
};

export default Avatar;
