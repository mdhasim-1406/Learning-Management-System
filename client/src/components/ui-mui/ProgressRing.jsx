import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const ProgressRing = ({
    value = 0,
    size = 'md',
    showValue = true,
    color = 'primary',
    className,
    sx,
    ...props
}) => {
    const sizeMap = {
        sm: 40,
        md: 60,
        lg: 80,
        xl: 100,
    };

    const dimension = sizeMap[size] || sizeMap.md;
    const thickness = size === 'sm' ? 4 : size === 'lg' || size === 'xl' ? 3 : 3.5;

    return (
        <Box
            className={className}
            sx={{
                position: 'relative',
                display: 'inline-flex',
                ...sx,
            }}
            {...props}
        >
            {/* Background circle */}
            <CircularProgress
                variant="determinate"
                value={100}
                size={dimension}
                thickness={thickness}
                sx={{
                    color: 'grey.200',
                    position: 'absolute',
                }}
            />
            {/* Progress circle */}
            <CircularProgress
                variant="determinate"
                value={value}
                size={dimension}
                thickness={thickness}
                color={color}
                sx={{
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                        transition: 'stroke-dashoffset 0.5s ease-in-out',
                    },
                }}
            />
            {showValue && (
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        color="text.primary"
                        fontWeight={600}
                        fontSize={size === 'sm' ? 10 : size === 'lg' || size === 'xl' ? 16 : 12}
                    >
                        {`${Math.round(value)}%`}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProgressRing;
