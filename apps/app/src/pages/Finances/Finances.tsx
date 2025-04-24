import '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { tsr } from '@/lib/boilerplate';
import { CircleDollarSign, MinusCircle, PlusCircle } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import InfoCard from '@/components/common/InfoCard';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { CrudTable, type Column } from '@/components/common/CrudTable';
import TreasuriesForm from './TreasuriesForm';
import { useDebounce } from '@/lib/hooks/useDebounce';

export const Finances = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [selectedTreasury, setSelectedTreasury] = useState<any>({});
    const [filters, setFilters] = useState<any>({ name: '' });
    const [page, setPage] = useState(1);
    const debouncedFilters = useDebounce(filters, 500);

    const { data: { body: treasuries } = {}, status } = tsr.treasuries.get.useQuery({
        queryKey: ['treasuries', page, debouncedFilters],
        queryData: {
            query: {
                ...filters,
                page,
            },
        },
    });
    const { data: { body: stats } = {} } = tsr.treasuries.getStats.useQuery({
        queryKey: ['treasuries', 'stats'],
    });

    useEffect(() => {
        if (!open && !open1) setTimeout(() => setSelectedTreasury({}), 200);
    }, [open, open1]);

    const columns: Column[] = [{ title: 'Tesorería', data: 'name' }];

    return (
        <div className="flex flex-col gap-3">
            <StatsGrid>
                <InfoCard color="green" title="Balance" data={stats?.balance}>
                    <CircleDollarSign />
                </InfoCard>
                <InfoCard color="green" title="Total de ingresos" data={stats?.income}>
                    <PlusCircle />
                </InfoCard>
                <InfoCard color="green" title="Total de egresos" data={stats?.expense}>
                    <MinusCircle />
                </InfoCard>
            </StatsGrid>
            <OptionsGrid>
                <SearchInput placeholder="Buscar..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

                <DeleteDialog
                    text="Desea eliminar esta tesorería y todos sus movimientos?"
                    successMessage="Tesorería eliminada"
                    path="treasuries"
                    open={open1}
                    setOpen={setOpen1}
                    id={selectedTreasury.id}
                />
                <TreasuriesForm open={open} setOpen={setOpen} id={selectedTreasury.id} />
            </OptionsGrid>

            <CrudTable
                columns={columns}
                data={treasuries?.rows}
                status={status}
                setSelectedRow={setSelectedTreasury}
                viewHref="/finances/treasury?id="
                setOpenEdit={setOpen}
                setOpenDelete={setOpen1}
            ></CrudTable>
            <PaginationMenu page={page} setPage={setPage} count={treasuries?.count} rowsDisplayed={10} />
        </div>
    );
};

export default Finances;
