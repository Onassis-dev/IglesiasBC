import '@/lib/boilerplate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { tsr } from '@/lib/boilerplate';
import { BadgeCheck, User, UserCheck2 } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import InfoCard from '@/components/common/InfoCard';
import MembersCard from './MembersCard';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { displayDate } from '@/lib/timeFunctions';
import { CrudTable, type Column } from '@/components/common/CrudTable';
import { calculateAge, setCurrentYear } from './members.lib';
import MembersForm from './MembersForm';
import ImportMembers from './ImportMembers';
import { useDebounce } from '@/lib/hooks/useDebounce';

export function Members() {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>({});
    const [filters, setFilters] = useState<any>({ name: '' });
    const [page, setPage] = useState(1);
    const debouncedFilters = useDebounce(filters, 500);

    const { data: { body: members } = {}, status } = tsr.members.get.useQuery({
        queryKey: ['members', page, debouncedFilters],
        queryData: {
            query: {
                page,
                ...filters,
            },
        },
    });
    const { data: { body: stats } = {} } = tsr.members.getStats.useQuery({
        queryKey: ['members', 'stats'],
    });
    const { data: { body: birthdays } = {} } = tsr.members.getBirthdays.useQuery({
        queryKey: ['members', 'birthdays'],
    });
    const { data: { body: positionsList } = {} } = tsr.options.getPositions.useQuery({
        queryKey: ['positionsObj'],
        refetchOnMount: false,
    });
    const positions = positionsList ? Object.fromEntries(positionsList.map(({ id, value }: { id: any; value: any }) => [id, value])) : {};

    const columns: Column[] = [
        { title: 'Nombre', data: 'name' },
        { title: 'Tipo', data: 'positionId', badge: true, transform: (e: any) => positions[e] },
        { title: 'Teléfono', data: 'cellphone', hide: true },
        { title: 'Correo', data: 'email', hide: true },
    ];

    return (
        <div className="flex flex-col gap-3">
            <StatsGrid>
                <InfoCard color="purple" title="Total de miembros" data={stats?.total}>
                    <User />
                </InfoCard>
                <InfoCard color="purple" title="Miembros activos" data={stats?.active}>
                    <UserCheck2 />
                </InfoCard>
                <InfoCard href="#birthdays" color="purple" title="Cumpleañeros del mes" data={stats?.birthdays}>
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
                    <MembersForm open={open} setOpen={setOpen} member={selectedMember} setSelectedMember={setSelectedMember} />
                </div>
                <MembersCard open={open1} setOpen={setOpen1} member={selectedMember} setDelete={setOpen2} setEdit={setOpen} />
            </OptionsGrid>

            <CrudTable
                columns={columns}
                data={members?.rows}
                status={status}
                setSelectedRow={setSelectedMember}
                setOpenView={setOpen1}
                setOpenEdit={setOpen}
                setOpenDelete={setOpen2}
                onRowClick={setOpen1}
            ></CrudTable>
            <PaginationMenu page={page} setPage={setPage} count={members?.count} rowsDisplayed={10} />

            <h3 className=" ml-1 pt-10 font-semibold text-xl" id="birthdays">
                Cumpleañeros del mes
            </h3>
            <Card className="overflow-hidden">
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
                                        <TableCell>{displayDate(setCurrentYear(birthday.birthday), `EEEE d 'de' MMMM`)}</TableCell>
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
