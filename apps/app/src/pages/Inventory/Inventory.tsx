import '@/lib/boilerplate';
import { ActionButton } from '@/components/ui/button';
import { useState } from 'react';
import { tsr } from '@/lib/boilerplate';
import { Boxes, DollarSign, FileDown, Package } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { showPromise } from '@/lib/showFunctions.tsx';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import InfoCard from '@/components/common/InfoCard';
import InventoryForm from './InventoryForm';
import InventoryCard from './InventoryCard';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { downloadFile } from '@/lib/downloadFile';
import { CrudTable, type Column } from '@/components/common/CrudTable';
import { useDebounce } from '@/lib/hooks/useDebounce';

export function Inventory() {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [filters, setFilters] = useState<any>({ name: '' });
    const [page, setPage] = useState(1);
    const debouncedFilters = useDebounce(filters, 500);

    const { data: { body: inventory } = {}, status } = tsr.inventory.get.useQuery({
        queryKey: ['inventory', page, debouncedFilters],
        queryData: {
            query: {
                page,
                ...filters,
            },
        },
    });

    const { data: { body: stats } = {} } = tsr.inventory.getStats.useQuery({
        queryKey: ['inventory', 'stats'],
    });

    const exportData = async () => {
        const { body: buffer } = await tsr.inventory.export.query({});
        downloadFile(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Inventario.xlsx');
    };

    const columns: Column[] = [
        { title: 'Nombre', data: 'name' },
        { title: 'Marca', data: 'brand', hide: true },
        { title: 'Cantidad', data: 'amount', hide: true },
        { title: 'Precio unitario', data: 'price', hide: true },
        { title: 'Precio total', data: 'price' },
    ];

    return (
        <div className="flex flex-col gap-3">
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

                    <InventoryForm open={open} setOpen={setOpen} item={selectedItem} setSelectedItem={setSelectedItem} />
                </div>
                <DeleteDialog
                    text="¿Estás seguro de eliminar este artículo?"
                    path="inventory"
                    open={open2}
                    setOpen={setOpen2}
                    successMessage="Artículo eliminado"
                    id={selectedItem.id}
                />
                <InventoryCard open={open1} setOpen={setOpen1} item={selectedItem} />
            </OptionsGrid>

            <CrudTable
                columns={columns}
                status={status}
                data={inventory?.rows}
                setSelectedRow={setSelectedItem}
                setOpenView={setOpen1}
                setOpenEdit={setOpen}
                setOpenDelete={setOpen2}
                onRowClick={setOpen1}
            />
            <PaginationMenu page={page} setPage={setPage} count={inventory?.count} rowsDisplayed={10} />
        </div>
    );
}

export default Inventory;
