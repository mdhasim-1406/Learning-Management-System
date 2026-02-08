import { forwardRef } from 'react';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';

const Button = forwardRef(({
    children,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    fullWidth = false,
    className,
    sx,
    ...props
}, ref) => {
    // Map custom variants to MUI variants
    const getMuiVariant = () => {
        switch (variant) {
            case 'luxury':
            case 'primary':
                return 'contained';
            case 'ghost':
                return 'text';
            case 'outline':
                return 'outlined';
            case 'link':
                return 'text';
            default:
                return variant;
        }
    };

    // Custom styling for luxury variant
    const luxurySx = variant === 'luxury' ? {
        background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2744 100%)',
        boxShadow: '0 4px 14px rgba(30, 58, 95, 0.4)',
        '&:hover': {
            background: 'linear-gradient(135deg, #2E5077 0%, #1E3A5F 100%)',
            boxShadow: '0 6px 20px rgba(30, 58, 95, 0.5)',
            transform: 'translateY(-2px)',
        },
    } : {};

    return (
        <MuiButton
            ref={ref}
            variant={getMuiVariant()}
            color={color}
            size={size}
            disabled={disabled || loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
            endIcon={endIcon}
            fullWidth={fullWidth}
            className={className}
            sx={{
                minHeight: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
                ...luxurySx,
                ...sx,
            }}
            {...props}
        >
            {children}
        </MuiButton>
    );
});

Button.displayName = 'Button';

export default Button;
