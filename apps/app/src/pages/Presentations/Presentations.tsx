import '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { tsr } from '@/lib/boilerplate';
import DeleteDialog from '@/components/common/DeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import { OptionsGrid } from '@/components/ui/grids';
import { CrudTable, type Column } from '@/components/common/CrudTable';
import PresentationsForm from './PresentationsForm';

export const Presentations = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [selectedTreasury, setSelectedTreasury] = useState<any>({});
    const [filters, setFilters] = useState<any>({ title: '' });
    const [page, setPage] = useState(1);

    const { data: { body: presentations } = {}, status } = tsr.presentations.get.useQuery({
        queryKey: ['presentations', page, filters],
        queryData: {
            query: {
                ...filters,
                page,
            },
        },
    });

    const columns: Column[] = [{ title: 'Título', data: 'title' }];

    useEffect(() => {
        if (!open && !open1) setSelectedTreasury({});
    }, [open, open1]);

    return (
        <div className="space-y-3 bg-dashboardbg">
            <OptionsGrid>
                <SearchInput placeholder="Buscar..." value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />

                <DeleteDialog
                    text="Desea eliminar esta presentación?"
                    successMessage="Presentación eliminada"
                    path="presentations"
                    open={open1}
                    setOpen={setOpen1}
                    id={selectedTreasury.id}
                />
                <PresentationsForm open={open} setOpen={setOpen} id={selectedTreasury.id} />
            </OptionsGrid>

            <Card>
                <CardContent className="p-0">
                    <CrudTable
                        columns={columns}
                        data={presentations?.rows}
                        status={status}
                        setSelectedRow={setSelectedTreasury}
                        viewHref="/presentations/slides?id="
                        setOpenEdit={setOpen}
                        setOpenDelete={setOpen1}
                        enableOpenOnRowClick={true}
                    ></CrudTable>
                </CardContent>
            </Card>
            <PaginationMenu page={page} setPage={setPage} count={presentations?.count} rowsDisplayed={10} />
        </div>
    );
};

export default Presentations;
