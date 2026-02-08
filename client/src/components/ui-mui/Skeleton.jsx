import MuiSkeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const Skeleton = ({ className, variant = 'rectangular', width, height, sx, ...props }) => (
    <MuiSkeleton
        variant={variant === 'circular' ? 'circular' : variant === 'text' ? 'text' : 'rounded'}
        width={width}
        height={height}
        className={className}
        animation="wave"
        sx={{
            borderRadius: variant === 'circular' ? '50%' : 2,
            bgcolor: 'grey.200',
            ...sx,
        }}
        {...props}
    />
);

export const SkeletonText = ({ lines = 3, className, sx }) => (
    <Box className={className} sx={sx}>
        {Array.from({ length: lines }).map((_, i) => (
            <MuiSkeleton
                key={i}
                variant="text"
                animation="wave"
                sx={{
                    height: 16,
                    mb: 1,
                    width: i === lines - 1 ? '60%' : '100%',
                    bgcolor: 'grey.200',
                }}
            />
        ))}
    </Box>
);

export const SkeletonCard = ({ className, sx }) => (
    <Box
        className={className}
        sx={{
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            ...sx,
        }}
    >
        <MuiSkeleton variant="rectangular" height={160} animation="wave" sx={{ bgcolor: 'grey.200' }} />
        <Box sx={{ p: 2.5 }}>
            <MuiSkeleton variant="text" height={24} width="70%" animation="wave" sx={{ mb: 1, bgcolor: 'grey.200' }} />
            <MuiSkeleton variant="text" height={16} animation="wave" sx={{ mb: 0.5, bgcolor: 'grey.200' }} />
            <MuiSkeleton variant="text" height={16} width="80%" animation="wave" sx={{ bgcolor: 'grey.200' }} />
        </Box>
    </Box>
);

export const SkeletonTable = ({ rows = 5, className, sx }) => (
    <Box className={className} sx={sx}>
        <MuiSkeleton variant="rectangular" height={48} animation="wave" sx={{ mb: 1, borderRadius: 2, bgcolor: 'grey.200' }} />
        {Array.from({ length: rows }).map((_, i) => (
            <MuiSkeleton
                key={i}
                variant="rectangular"
                height={56}
                animation="wave"
                sx={{ mb: 0.5, borderRadius: 1, bgcolor: 'grey.100' }}
            />
        ))}
    </Box>
);

export default Skeleton;
