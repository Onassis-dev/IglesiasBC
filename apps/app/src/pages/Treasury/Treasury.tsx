import '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { api } from '@/lib/boilerplate';
import { CircleDollarSign, MinusCircle, PlusCircle } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import InfoCard from '@/components/common/InfoCard';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { displayDate } from '@/lib/timeFunctions';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CrudTable, type Column } from '@/components/common/CrudTable';
import TransactionsForm from './TransactionsForm';
import { usePathStore } from '@/lib/store';

export const Treasury = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>({});
    const [filters, setFilters] = useState<any>({ name: '' });
    const [page, setPage] = useState(1);
    const [id, setId] = useState('');
    const { setPath } = usePathStore((state) => state);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setId(queryParams.get('id') || '');
    }, []);

    const { data: treasury, status } = useQuery({
        queryKey: ['transactions', page, filters, id],
        queryFn: async () => (await api.get('/transactions', { params: { ...filters, page, id } })).data,
        enabled: !!id,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (treasury?.name) setPath(treasury.name);
    }, [treasury]);

    const { data: stats } = useQuery({
        queryKey: ['transactions', 'stats', id],
        queryFn: async () => (await api.get('/transactions/stats/' + id)).data,
        enabled: !!id,
    });

    useEffect(() => {
        if (!open && !open1) setTimeout(() => setSelectedTransaction({}), 200);
    }, [open, open1]);

    const columns: Column[] = [
        { title: 'Concepto', data: 'concept' },
        { title: 'Fecha', data: 'date', transform: (e) => displayDate(e) },
        { title: 'Categoría', data: 'category', badge: true },
        { title: 'Cantidad', data: 'amount' },
    ];

    return (
        <div className="space-y-3 bg-dashboardbg">
            <StatsGrid>
                <InfoCard color="green" title="Total de ingresos" data={stats?.income}>
                    <PlusCircle />
                </InfoCard>
                <InfoCard color="green" title="Total de egresos" data={stats?.expense}>
                    <MinusCircle />
                </InfoCard>
                <InfoCard color="green" title="Balance" data={stats?.balance}>
                    <CircleDollarSign />
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
                <TransactionsForm open={open} setOpen={setOpen} transaction={selectedTransaction} />
            </OptionsGrid>

            <Card>
                <CardContent className="p-0">
                    <CrudTable
                        columns={columns}
                        data={treasury?.rows}
                        status={status}
                        setSelectedRow={setSelectedTransaction}
                        setOpenEdit={setOpen}
                        setOpenDelete={setOpen1}
                    />
                </CardContent>
            </Card>
            <PaginationMenu page={page} setPage={setPage} count={treasury?.count} rowsDisplayed={10} />
        </div>
    );
};

export default Treasury;
