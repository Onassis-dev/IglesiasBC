import '@/lib/boilerplate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { api } from '@/lib/boilerplate';
import { BadgeCheck, User, UserCheck2 } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import InfoCard from '@/components/common/InfoCard';
import MembersCard from './MembersCard';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { displayDate } from '@/lib/timeFunctions';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CrudTable, type Column } from '@/components/common/CrudTable';
import { calculateAge } from './members.lib';
import MembersForm from './MembersForm';
import ImportMembers from './ImportMembers';

export function Members() {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>({});
    const [filters, setFilters] = useState<any>({ name: '' });
    const [page, setPage] = useState(1);

    const { data: members, status } = useQuery({
        queryKey: ['members', page, filters],
        queryFn: async () => (await api.get('/members', { params: { ...filters, page } })).data,
        placeholderData: keepPreviousData,
    });
    const { data: stats } = useQuery({
        queryKey: ['members', 'stats'],
        queryFn: async () => (await api.get('/members/stats')).data,
    });
    const { data: birthdays } = useQuery({
        queryKey: ['members', 'birthdays'],
        queryFn: async () => (await api.get('/members/birthdays')).data,
    });

    useEffect(() => {
        if (!open && !open1 && !open2) setTimeout(() => setSelectedMember({}), 150);
    }, [open, open1, open2]);

    const columns: Column[] = [
        { title: 'Nombre', data: 'name' },
        { title: 'Tipo', data: 'positionId', badge: true },
        { title: 'Teléfono', data: 'cellphone', hide: true },
        { title: 'Correo', data: 'email', hide: true },
    ];

    return (
        <div className="space-y-3 bg-dashboardbg">
            <StatsGrid>
                <InfoCard color="purple" title="Total de miembros" data={stats?.total}>
                    <User />
                </InfoCard>
                <InfoCard color="purple" title="Miembros activos" data={stats?.active}>
                    <UserCheck2 />
                </InfoCard>
                <InfoCard color="purple" title="Cumpleaneros del mes" data={stats?.birthdays}>
                    <BadgeCheck />
                </InfoCard>
            </StatsGrid>

            <OptionsGrid>
                <SearchInput placeholder="Buscar..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

                <DeleteDialog
                    text="¿Estás seguro de eliminar este usuario?"
                    open={open2}
                    setOpen={setOpen2}
                    id={selectedMember.id}
                    successMessage="Miembro eliminado"
                    path="members"
                />
                <div className="flex gap-2">
                    <ImportMembers />
                    <MembersForm open={open} setOpen={setOpen} id={selectedMember.id} />
                </div>
                <MembersCard open={open1} setOpen={setOpen1} id={selectedMember.id} />
            </OptionsGrid>

            <Card>
                <CardContent className="p-0 w-full">
                    <CrudTable
                        columns={columns}
                        data={members?.rows}
                        status={status}
                        setSelectedRow={setSelectedMember}
                        setOpenView={setOpen1}
                        setOpenEdit={setOpen}
                        setOpenDelete={setOpen2}
                        enableOpenOnRowClick={true}
                    ></CrudTable>
                </CardContent>
            </Card>
            <PaginationMenu page={page} setPage={setPage} count={members?.count} rowsDisplayed={10} />

            <h3 className=" ml-1 pt-10 font-semibold text-xl">Cumpleañeros del mes</h3>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Cumpleaños</TableHead>
                                <TableHead>Cumplidos</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {birthdays ? (
                                birthdays?.map((birthday: any, i: any) => (
                                    <TableRow key={i}>
                                        <TableCell>{birthday.name}</TableCell>
                                        <TableCell>{displayDate(birthday.birthday, `EEEE d 'de' MMMM`)}</TableCell>
                                        <TableCell>{calculateAge(birthday.birthday)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <></>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default Members;
