import { Modal as NextModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

export const Modal = ({
    children,
    isOpen,
    onClose,
    title,
    size = "md",
    className,
    ...props
}) => {
    return (
        <NextModal
            isOpen={isOpen}
            onOpenChange={onClose}
            size={size}
            backdrop="blur"
            classNames={{
                backdrop: "bg-emerald-900/20 backdrop-blur-md",
                base: "bg-white border border-stone-200 shadow-luxury",
                header: "border-b border-stone-100",
                footer: "border-t border-stone-100",
                closeButton: "hover:bg-stone-100 active:bg-stone-200",
            }}
            className={className}
            {...props}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        {title && <ModalHeader className="flex flex-col gap-1 text-stone-900">{title}</ModalHeader>}
                        <ModalBody className="py-6">{children}</ModalBody>
                        {/* Footer should be passed as children if needed, or we can add a prop */}
                    </>
                )}
            </ModalContent>
        </NextModal>
    );
};

export { ModalHeader, ModalBody, ModalFooter }; // Export native subcomponents for flexibility

export default Modal;
