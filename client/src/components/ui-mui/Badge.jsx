import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';

const Badge = ({
    children,
    variant = 'filled',
    color = 'default',
    size = 'small',
    className,
    sx,
    ...props
}) => {
    // Map custom variants to MUI Chip colors
    const getMuiColor = () => {
        switch (variant) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'destructive':
            case 'error':
                return 'error';
            case 'secondary':
                return 'secondary';
            case 'outline':
                return 'default';
            default:
                return color || 'primary';
        }
    };

    const getMuiVariant = () => {
        return variant === 'outline' ? 'outlined' : 'filled';
    };

    return (
        <Chip
            label={children}
            variant={getMuiVariant()}
            color={getMuiColor()}
            size={size}
            className={className}
            sx={{
                fontWeight: 500,
                borderRadius: 1.5,
                ...sx,
            }}
            {...props}
        />
    );
};

export default Badge;
