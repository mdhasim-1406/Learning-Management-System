import { Card as NextCard, CardHeader as NextHeader, CardBody as NextBody, CardFooter as NextFooter } from "@nextui-org/react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

// Create a motion component from NextCard
const MotionNextCard = motion(NextCard);

export const Card = ({
    children,
    className,
    variant = "default", // default, glass, elevated, luxury
    padding = "md",
    hover = false,
    animate = false,
    delay = 0,
    ...props
}) => {
    const paddings = {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-8",
    };

    const variants = {
        default: "bg-white border border-stone-200/60 shadow-sm",
        glass: "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg",
        elevated: "bg-white shadow-luxury border-none",
        luxury: "bg-gradient-to-br from-white to-stone-50 border border-stone-200 shadow-luxury",
    };

    const Component = animate ? MotionNextCard : NextCard;

    const motionProps = animate ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: delay, ease: [0.22, 1, 0.36, 1] }
    } : {};

    return (
        <Component
            className={cn(
                variants[variant],
                hover && "hover:scale-[1.005] transition-transform duration-300 hover:shadow-xl",
                className
            )}
            classNames={{
                body: paddings[padding],
            }}
            {...motionProps}
            {...props}
        >
            {children}
        </Component>
    );
};

export const CardHeader = ({ children, className, ...props }) => (
    <NextHeader className={cn("pb-2 px-5 pt-5 flex-col items-start gap-1", className)} {...props}>
        {children}
    </NextHeader>
);

export const CardBody = ({ children, className, ...props }) => (
    <NextBody className={cn("py-2 px-5", className)} {...props}>
        {children}
    </NextBody>
);

export const CardFooter = ({ children, className, ...props }) => (
    <NextFooter className={cn("pt-2 px-5 pb-5", className)} {...props}>
        {children}
    </NextFooter>
);

// Compatibility exports for existing usage
export const CardTitle = ({ children, className }) => (
    <h3 className={cn("text-lg font-bold text-stone-900 tracking-tight", className)}>{children}</h3>
);

export const CardDescription = ({ children, className }) => (
    <p className={cn("text-sm text-stone-500", className)}>{children}</p>
);

export const CardContent = CardBody; // Alias for compatibility

export default Card;
