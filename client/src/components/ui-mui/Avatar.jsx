import MuiAvatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';

const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const Avatar = ({
    src,
    alt,
    name,
    size = 'md',
    className,
    sx,
    ...props
}) => {
    const sizeMap = {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 56,
        xl: 80,
    };

    const dimension = sizeMap[size] || sizeMap.md;

    // Generate consistent color based on name
    const stringToColor = (string) => {
        if (!string) return '#1E3A5F';
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ['#1E3A5F', '#FF6B35', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <MuiAvatar
            src={src}
            alt={alt || name}
            className={className}
            sx={{
                width: dimension,
                height: dimension,
                fontSize: dimension * 0.4,
                fontWeight: 600,
                bgcolor: !src ? stringToColor(name) : undefined,
                ...sx,
            }}
            {...props}
        >
            {!src && getInitials(name)}
        </MuiAvatar>
    );
};

export default Avatar;
