import { forwardRef } from 'react';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import MuiCardHeader from '@mui/material/CardHeader';
import MuiCardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Card = forwardRef(({
    children,
    className,
    variant = 'default',
    hover = true,
    animate = false,
    delay = 0,
    padding,
    sx,
    ...props
}, ref) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'glass':
                return {
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                };
            case 'luxury':
                return {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,1) 100%)',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                };
            case 'elevated':
                return {
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
                };
            default:
                return {};
        }
    };

    const hoverStyles = hover ? {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        },
    } : {};

    const CardComponent = (
        <MuiCard
            ref={ref}
            className={className}
            sx={{
                ...getVariantStyles(),
                ...hoverStyles,
                ...(padding === 'none' ? { '& .MuiCardContent-root': { p: 0 } } : {}),
                ...sx,
            }}
            {...props}
        >
            {children}
        </MuiCard>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
            >
                {CardComponent}
            </motion.div>
        );
    }

    return CardComponent;
});

Card.displayName = 'Card';

// Sub-components
export const CardContent = forwardRef(({ children, className, sx, ...props }, ref) => (
    <MuiCardContent ref={ref} className={className} sx={{ p: 3, ...sx }} {...props}>
        {children}
    </MuiCardContent>
));
CardContent.displayName = 'CardContent';

export const CardHeader = forwardRef(({ children, className, title, subheader, action, sx, ...props }, ref) => (
    <MuiCardHeader
        ref={ref}
        className={className}
        title={title}
        subheader={subheader}
        action={action}
        sx={{ pb: 0, ...sx }}
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
        {...props}
    >
        {children}
    </MuiCardHeader>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ children, className, sx }) => (
    <Typography variant="h6" component="h3" fontWeight={600} className={className} sx={sx}>
        {children}
    </Typography>
);

export const CardDescription = ({ children, className, sx }) => (
    <Typography variant="body2" color="text.secondary" className={className} sx={sx}>
        {children}
    </Typography>
);

export const CardFooter = forwardRef(({ children, className, sx, ...props }, ref) => (
    <MuiCardActions ref={ref} className={className} sx={{ p: 3, pt: 0, ...sx }} {...props}>
        {children}
    </MuiCardActions>
));
CardFooter.displayName = 'CardFooter';

export default Card;
