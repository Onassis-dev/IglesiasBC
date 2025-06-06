import { EditIcon, EyeIcon, Ban, Inbox, MoreHorizontal, Trash, FileDown, CircleCheck, CircleMinus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { QueryStatus } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

interface props {
    columns: Column[];
    data: Record<string, any> | undefined;
    status: QueryStatus;
    setSelectedRow: (value: any) => void;
    setOpenDelete?: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenView?: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenEdit?: React.Dispatch<React.SetStateAction<boolean>>;
    downloadFunc?: (row: Record<string, any>) => void;
    viewHref?: string;
    onRowClick?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CrudTable = ({
    columns,
    data,
    status,
    setSelectedRow,
    setOpenDelete,
    setOpenEdit,
    setOpenView,
    downloadFunc,
    viewHref,
    onRowClick,
}: props) => {
    const navigate = useNavigate();

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead className={column.hide ? 'hidden sm:table-cell' : ''}>{column.title}</TableHead>
                            ))}
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {status === 'success' &&
                            data?.map((row: any) => (
                                <TableRow className="w-full" key={row.id}>
                                    {columns?.map((column) => {
                                        const cellContent = Array.isArray(column.data)
                                            ? column.data.map((data) => row[data])
                                            : column.transform
                                              ? column.transform(row[column.data as string])
                                              : row[column.data as string];

                                        return (
                                            <TableCell
                                                onClick={() => {
                                                    setSelectedRow(row);
                                                    if (onRowClick) onRowClick(true);
                                                    if (viewHref) navigate(viewHref + row.id);
                                                }}
                                                key={Array.isArray(column.data) ? column.data[0] : column.data}
                                                className={cn(
                                                    column.hide ? 'hidden sm:table-cell' : '',
                                                    (onRowClick || viewHref) && 'cursor-pointer'
                                                )}
                                            >
                                                {column.badge ? (
                                                    <Badge variant="outline">{cellContent}</Badge>
                                                ) : column.checkbox ? (
                                                    <Badge className="p-0 rounded-full" variant={cellContent ? 'green' : 'orange'}>
                                                        {cellContent ? <CircleCheck /> : <CircleMinus />}
                                                    </Badge>
                                                ) : (
                                                    <span>{cellContent}</span>
                                                )}
                                            </TableCell>
                                        );
                                    })}

                                    <TableCell className="w-0 space-x-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="size-9" aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {setOpenView && (
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedRow(row);
                                                            setOpenView(true);
                                                        }}
                                                    >
                                                        <EyeIcon className="size-4 mr-2" /> Ver
                                                    </DropdownMenuItem>
                                                )}
                                                {viewHref && (
                                                    <Link to={viewHref + row.id}>
                                                        <DropdownMenuItem>
                                                            <EyeIcon className="size-4 mr-2" />
                                                            Ver
                                                        </DropdownMenuItem>
                                                    </Link>
                                                )}
                                                {downloadFunc && (
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedRow(row);
                                                            downloadFunc(row);
                                                        }}
                                                    >
                                                        <FileDown className="size-4 mr-2" /> Descargar
                                                    </DropdownMenuItem>
                                                )}

                                                {setOpenEdit && (
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedRow(row);
                                                            setOpenEdit(true);
                                                        }}
                                                    >
                                                        <EditIcon className="size-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                )}
                                                {setOpenDelete && (
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedRow(row);
                                                            setOpenDelete(true);
                                                        }}
                                                    >
                                                        <Trash className="size-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                        {status === 'success' && data?.length === 0 && (
                            <TableCell colSpan={100}>
                                <div className="w-full justify-center flex flex-col items-center text-muted-foreground h-40">
                                    <Inbox strokeWidth={1} className="size-12 mb-4" />
                                    <span className="font-medium">No se encontraron resultados</span>
                                </div>
                            </TableCell>
                        )}

                        {status === 'pending' &&
                            Array.from({ length: 10 }).map(() => (
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell className={column.hide ? 'hidden sm:table-cell' : ''}>
                                            <Skeleton className="h-4" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {status === 'error' && (
                            <TableCell colSpan={100}>
                                <div className="w-full justify-center flex flex-col items-center text-muted-foreground h-40">
                                    <Ban strokeWidth={1} className="size-12 mb-4" />
                                    <span className="font-medium">Hubo un problema al completar la petición</span>
                                </div>
                            </TableCell>
                        )}

                        {status === 'success' && !data && (
                            <TableCell colSpan={100}>
                                <div className="w-full justify-center flex flex-col items-center text-muted-foreground h-40">
                                    <Ban strokeWidth={1} className="size-12 mb-4" />
                                    <span className="font-medium">Hubo un problema al completar la petición</span>
                                </div>
                            </TableCell>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export interface Column {
    badge?: boolean;
    checkbox?: boolean;
    data: string | string[];
    title: string;
    hide?: boolean;
    transform?: (e: any) => any;
}
