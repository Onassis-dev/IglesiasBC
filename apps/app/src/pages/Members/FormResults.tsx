import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { tsr } from '@/lib/boilerplate';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { showPromise } from '@/lib/showFunctions';
import { Button } from '@/components/ui/button';
import { Trash, UserCheck } from 'lucide-react';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const MembersForm = ({ open, setOpen }: props) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [openAccept, setOpenAccept] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const client = tsr.useQueryClient();

    const toggleSelectAll = () => {
        if (selectedIds.size === results.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(results.map((r: any) => r.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
        } else {
            newSelectedIds.add(id);
        }
        setSelectedIds(newSelectedIds);
    };

    const { data: { body: positions } = {} } = tsr.options.getPositions.useQuery({
        queryKey: ['positionsObj'],
        refetchOnMount: false,
    });

    const { data: { body: results } = {} } = tsr.forms.getResults.useQuery({
        queryKey: ['results'],
        enabled: open,
    });

    async function acceptResults() {
        setOpenAccept(false);
        await tsr.forms.acceptResults.mutate({
            body: Array.from(selectedIds).map(Number),
        });
        setSelectedIds(new Set());
        client.refetchQueries({ queryKey: ['results'] });
        client.invalidateQueries({ queryKey: ['members'] });
    }

    async function rejectResults() {
        setOpenReject(false);
        await tsr.forms.rejectResults.mutate({
            body: Array.from(selectedIds).map(Number),
        });
        setSelectedIds(new Set());
        client.refetchQueries({ queryKey: ['results'] });
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="sm:max-w-4xl">
                <SheetHeader>
                    <SheetTitle>Respuestas</SheetTitle>
                </SheetHeader>
                <SheetBody className="p-4">
                    <div className="flex gap-2 mb-2">
                        <Popover open={openAccept} onOpenChange={setOpenAccept}>
                            <PopoverTrigger asChild>
                                <Button size="sm" disabled={selectedIds.size === 0}>
                                    <UserCheck className="size-3.5 mr-1.5" />
                                    Aceptar
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72" align="start">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Confirmar</h4>
                                        <p className="text-sm text-muted-foreground">
                                            ¿Estás seguro de querer aceptar {selectedIds.size} respuestas?
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" onClick={() => showPromise(acceptResults(), 'Respuestas aceptadas')}>
                                            <UserCheck className="mr-1.5 size-3.5" />
                                            Aceptar
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Popover open={openReject} onOpenChange={setOpenReject}>
                            <PopoverTrigger asChild>
                                <Button size="sm" variant="outline" disabled={selectedIds.size === 0}>
                                    <Trash className="size-3.5 mr-1.5" />
                                    Eliminar
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72" align="start">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Confirmar</h4>
                                        <p className="text-sm text-muted-foreground">
                                            ¿Estás seguro de querer eliminar {selectedIds.size} respuestas?
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="outline" onClick={() => showPromise(rejectResults(), 'Respuestas eliminadas')}>
                                            <Trash className="mr-1.5 size-3.5" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Checkbox checked={selectedIds.size === results?.length} onCheckedChange={toggleSelectAll} />
                                        </TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Cargo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results ? (
                                        results?.map((row: any) => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => toggleSelect(row.id)} />
                                                </TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{positions?.find((p: any) => p.id === row.positionId)?.value}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </SheetBody>
            </SheetContent>
        </Sheet>
    );
};

export default MembersForm;
