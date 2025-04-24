import '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { tsr } from '@/lib/boilerplate';
import { CircleDollarSign, MinusCircle, PlusCircle } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import InfoCard from '@/components/common/InfoCard';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { displayDate } from '@/lib/timeFunctions';
import { CrudTable, type Column } from '@/components/common/CrudTable';
import TransactionsForm from './TransactionsForm';
import { usePathStore } from '@/lib/store';
import { useDebounce } from '@/lib/hooks/useDebounce';
export const Treasury = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>({});
    const [filters, setFilters] = useState<any>({ name: '' });
    const [page, setPage] = useState(1);
    const [id, setId] = useState('');
    const { setPath } = usePathStore((state) => state);
    const debouncedFilters = useDebounce(filters, 500);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setId(queryParams.get('id') || '');
    }, []);

    const { data: { body: treasury } = {}, status } = tsr.transactions.get.useQuery({
        queryKey: ['transactions', page, debouncedFilters],
        enabled: !!id,
        queryData: {
            query: {
                ...filters,
                page,
                id,
            },
        },
    });

    const { data: { body: stats } = {} } = tsr.transactions.getStats.useQuery({
        queryKey: ['transactions', 'stats', id],
        queryData: {
            params: {
                id,
            },
        },
        enabled: !!id,
    });

    useEffect(() => {
        if (treasury?.name) setPath(treasury.name);
    }, [treasury, setPath]);

    useEffect(() => {
        if (!open && !open1) setTimeout(() => setSelectedTransaction({}), 200);
    }, [open, open1]);

    const columns: Column[] = [
        { title: 'Concepto', data: 'concept' },
        { title: 'Fecha', data: 'date', transform: (e) => displayDate(e), hide: true },
        { title: 'Categoría', data: 'category', badge: true, hide: true },
        { title: 'Cantidad', data: 'amount' },
    ];

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
                    text="¿Desea eliminar esta transacción?"
                    successMessage="Transacción eliminada"
                    path="transactions"
                    open={open1}
                    setOpen={setOpen1}
                    id={selectedTransaction.id}
                />
                <TransactionsForm open={open} setOpen={setOpen} transaction={selectedTransaction} treasuryId={Number(id)} />
            </OptionsGrid>

            <CrudTable
                columns={columns}
                data={treasury?.rows}
                status={status}
                setSelectedRow={setSelectedTransaction}
                setOpenEdit={setOpen}
                setOpenDelete={setOpen1}
                onRowClick={setOpen}
            />
            <PaginationMenu page={page} setPage={setPage} count={treasury?.count} rowsDisplayed={10} />
        </div>
    );
};

export default Treasury;
