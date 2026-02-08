import { Table as NextTable, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

const Table = ({ children, ...props }) => {
    return (
        <NextTable
            aria-label="Table"
            removeWrapper
            classNames={{
                th: "bg-stone-50 text-stone-500 font-semibold text-xs uppercase tracking-wider border-b border-stone-100",
                td: "py-4 border-b border-stone-50 group-last:border-none",
                base: "overflow-scroll",
            }}
            {...props}
        >
            {children}
        </NextTable>
    );
};

export { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell };
