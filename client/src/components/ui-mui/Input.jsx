import { forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const Input = forwardRef(({
    label,
    placeholder,
    type = 'text',
    value,
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    fullWidth = true,
    icon: Icon,
    startAdornment,
    endAdornment,
    variant = 'outlined',
    size = 'medium',
    multiline = false,
    rows,
    className,
    sx,
    ...props
}, ref) => {
    return (
        <TextField
            ref={ref}
            label={label}
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error || helperText}
            disabled={disabled}
            required={required}
            fullWidth={fullWidth}
            variant={variant === 'bordered' ? 'outlined' : variant}
            size={size}
            multiline={multiline}
            rows={rows}
            className={className}
            InputProps={{
                startAdornment: Icon ? (
                    <InputAdornment position="start">
                        <Icon sx={{ color: 'grey.400', fontSize: 20 }} />
                    </InputAdornment>
                ) : startAdornment,
                endAdornment,
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: 'grey.50',
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                    },
                },
                ...sx,
            }}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;
