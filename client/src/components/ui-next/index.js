// Re-export all components from ui-mui
// This allows existing imports to continue working while using MUI components

export { default as Button } from '../ui-mui/Button';
export { default as Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui-mui/Card';
export { default as Input } from '../ui-mui/Input';
export { default as Badge } from '../ui-mui/Badge';
export { default as Avatar } from '../ui-mui/Avatar';
export { default as Modal, ModalHeader, ModalBody, ModalFooter } from '../ui-mui/Modal';
export { default as Skeleton, SkeletonCard, SkeletonText, SkeletonTable } from '../ui-mui/Skeleton';
export { default as ProgressRing } from '../ui-mui/ProgressRing';
export { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '../ui-mui/Table';

// Default export for Card (for backwards compatibility)
export { default } from '../ui-mui/Card';
