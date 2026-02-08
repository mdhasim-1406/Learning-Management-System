import { forwardRef } from 'react';
import MuiTable from '@mui/material/Table';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableRow from '@mui/material/TableRow';
import MuiTableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';

export const Table = forwardRef(({ children, className, sx, ...props }, ref) => (
    <TableContainer ref={ref} className={className} sx={sx}>
        <MuiTable {...props}>
            {children}
        </MuiTable>
    </TableContainer>
));
Table.displayName = 'Table';

export const TableHeader = forwardRef(({ children, className, sx, ...props }, ref) => (
    <MuiTableHead ref={ref} className={className} sx={sx} {...props}>
        <MuiTableRow>
            {children}
        </MuiTableRow>
    </MuiTableHead>
));
TableHeader.displayName = 'TableHeader';

export const TableColumn = forwardRef(({ children, className, align = 'left', sx, ...props }, ref) => (
    <MuiTableCell
        ref={ref}
        component="th"
        className={className}
        align={align}
        sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            color: 'grey.600',
            backgroundColor: 'grey.50',
            borderBottom: '2px solid',
            borderColor: 'grey.200',
            py: 2,
            ...sx,
        }}
        {...props}
    >
        {children}
    </MuiTableCell>
));
TableColumn.displayName = 'TableColumn';

export const TableBody = forwardRef(({ children, emptyContent, className, sx, ...props }, ref) => {
    const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true);

    return (
        <MuiTableBody ref={ref} className={className} sx={sx} {...props}>
            {hasChildren ? children : (
                <MuiTableRow>
                    <MuiTableCell colSpan={100} sx={{ py: 8, textAlign: 'center' }}>
                        {emptyContent || 'No data available'}
                    </MuiTableCell>
                </MuiTableRow>
            )}
        </MuiTableBody>
    );
});
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef(({ children, className, hover = true, sx, ...props }, ref) => (
    <MuiTableRow
        ref={ref}
        className={className}
        hover={hover}
        sx={{
            transition: 'background-color 0.15s ease-in-out',
            '&:hover': {
                backgroundColor: 'grey.50',
            },
            ...sx,
        }}
        {...props}
    >
        {children}
    </MuiTableRow>
));
TableRow.displayName = 'TableRow';

export const TableCell = forwardRef(({ children, className, align = 'left', sx, ...props }, ref) => (
    <MuiTableCell
        ref={ref}
        className={className}
        align={align}
        sx={{
            py: 2,
            borderColor: 'grey.100',
            ...sx,
        }}
        {...props}
    >
        {children}
    </MuiTableCell>
));
TableCell.displayName = 'TableCell';
