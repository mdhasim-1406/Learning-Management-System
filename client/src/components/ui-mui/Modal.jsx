import { forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({
    children,
    isOpen,
    onClose,
    title,
    size = 'md',
    className,
    ...props
}) => {
    const sizeMap = {
        sm: 'sm',
        md: 'sm',
        lg: 'md',
        xl: 'lg',
        full: 'xl',
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth={sizeMap[size] || 'sm'}
            fullWidth
            TransitionComponent={Transition}
            className={className}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                },
            }}
            {...props}
        >
            {title && (
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 3,
                        pb: 2,
                        fontWeight: 600,
                        fontSize: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: 'grey.500',
                            '&:hover': {
                                color: 'grey.700',
                                backgroundColor: 'grey.100',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            )}
            {children}
        </Dialog>
    );
};

export const ModalHeader = DialogTitle;
export const ModalBody = forwardRef(({ children, sx, ...props }, ref) => (
    <DialogContent ref={ref} sx={{ p: 3, pt: 1, ...sx }} {...props}>
        {children}
    </DialogContent>
));
ModalBody.displayName = 'ModalBody';

export const ModalFooter = forwardRef(({ children, sx, ...props }, ref) => (
    <DialogActions ref={ref} sx={{ p: 3, pt: 2, gap: 1, ...sx }} {...props}>
        {children}
    </DialogActions>
));
ModalFooter.displayName = 'ModalFooter';

export default Modal;
