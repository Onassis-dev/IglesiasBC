import '@/lib/boilerplate';
import { ActionButton } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { api } from '@/lib/boilerplate';
import { Boxes, DollarSign, FileDown, Package } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import InfoCard from '@/components/common/InfoCard';
import InventoryForm from './InventoryForm';
import InventoryCard from './InventoryCard';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { downloadFile } from '@/lib/downloadFile';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CrudTable, type Column } from '@/components/common/CrudTable';

export function Inventory() {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [filters, setFilters] = useState<any>({ name: '' });
    const [page, setPage] = useState(1);

    const { data: inventory, status } = useQuery({
        queryKey: ['inventory', page, filters],
        queryFn: async () => (await api.get('/inventory', { params: { ...filters, page } })).data,
        placeholderData: keepPreviousData,
    });
    const { data: stats } = useQuery({ queryKey: ['inventory', 'stats'], queryFn: async () => (await api.get('/inventory/stats')).data });

    const exportData = async () => {
        const buffer: ArrayBuffer = (await api.get('/inventory/export', { responseType: 'arraybuffer' })).data;
        downloadFile(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Inventario.xlsx');
    };

    useEffect(() => {
        if (!open && !open1 && !open2) setTimeout(() => setSelectedItem({}), 200);
    }, [open, open1, open2]);

    const columns: Column[] = [
        { title: 'Nombre', data: 'name' },
        { title: 'Marca', data: 'brand', hide: true },
        { title: 'Cantidad', data: 'amount', hide: true },
        { title: 'Precio unitario', data: 'price', hide: true },
        { title: 'Precio total', data: 'price' },
    ];

    return (
        <div className="space-y-3 bg-dashboardbg">
            <StatsGrid>
                <InfoCard color="yellow" title="Unidades en inventario" data={stats?.total}>
                    <Boxes />
                </InfoCard>
                <InfoCard color="yellow" title="Total en inventario" data={stats?.money}>
                    <DollarSign />
                </InfoCard>
                <InfoCard color="yellow" title="Tipos de objetos" data={stats?.items}>
                    <Package />
                </InfoCard>
            </StatsGrid>

            <OptionsGrid>
                <SearchInput placeholder="Buscar..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

                <div className="flex gap-2">
                    <ActionButton text="Exportar" onClick={() => showPromise(exportData(), 'Excel generado')}>
                        <FileDown className="size-3.5" />
                    </ActionButton>

                    <InventoryForm open={open} setOpen={setOpen} id={selectedItem.id} />
                </div>
                <DeleteDialog
                    text="¿Estás seguro de eliminar este artículo?"
                    path="inventory"
                    open={open2}
                    setOpen={setOpen2}
                    successMessage="Artículo eliminado"
                    id={selectedItem.id}
                />
                <InventoryCard open={open1} setOpen={setOpen1} id={selectedItem.id} />
            </OptionsGrid>

            <Card>
                <CardContent className="p-0">
                    <CrudTable
                        columns={columns}
                        status={status}
                        data={inventory?.rows}
                        setSelectedRow={setSelectedItem}
                        setOpenView={setOpen1}
                        setOpenEdit={setOpen}
                        setOpenDelete={setOpen2}
                        enableOpenOnRowClick={true}
                    />
                </CardContent>
            </Card>
            <PaginationMenu page={page} setPage={setPage} count={inventory?.count} rowsDisplayed={10} />
        </div>
    );
}

export default Inventory;
