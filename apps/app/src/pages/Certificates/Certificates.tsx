// import '@/lib/boilerplate';
// import { useEffect, useState } from 'react';
// import { api } from '@/lib/boilerplate';
// import { CalendarClock, FileBadge, FileCheck } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { SearchInput } from '@/components/ui/input';
// import PaginationMenu from '@/components/common/PaginationMenu';
// import CertificatesForm from './CertificatesForm';
// import { formatToTZ } from '@/lib/timeFunctions';
// import InfoCard from '@/components/common/InfoCard';
// import LogoUpload from '../Website/LogoUpload';
// import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
// import { format } from 'date-fns';
// import { es } from 'date-fns/locale';

// import { keepPreviousData, useQuery } from '@tanstack/react-query';
// import { CrudTable, type Column } from '@/components/common/CrudTable';
// import DeleteDialog from '@/components/common/DeleteDialog';

// export const Certificates = () => {
//     const [open, setOpen] = useState(false);
//     const [open1, setOpen1] = useState(false);
//     const [selectedCertificate, setSelectedCertificate] = useState<any>({});
//     const [filters, setFilters] = useState<any>({ name: '' });
//     const [page, setPage] = useState(1);

//     const { data: certificates, status } = useQuery({
//         queryKey: ['certificates', page, filters],
//         queryFn: async () => (await api.get('/certificates', { params: { ...filters, page } })).data,
//         placeholderData: keepPreviousData,
//     });
//     const { data: stats } = useQuery({ queryKey: ['certificates', 'stats'], queryFn: async () => (await api.get('/certificates/stats')).data });

//     const downloadCertificate = async (id: string | number) => {
//         const response = await api.get(`/certificates/${id}`, {
//             responseType: 'arraybuffer',
//         });

//         const pdfBuffer = response.data;

//         const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

//         const url = URL.createObjectURL(blob);

//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = `certificado_${id}.pdf`;

//         document.body.appendChild(a);

//         a.click();

//         document.body.removeChild(a);

//         URL.revokeObjectURL(url);
//     };

//     useEffect(() => {
//         if (!open && !open1) setTimeout(() => setSelectedCertificate({}), 200);
//     }, [open, open1]);

//     const columns: Column[] = [
//         { title: 'Miembros', data: ['memberName', 'member2Name'], transform: (e) => e[0] + ((e[1] && `, ${e[1]}`) || '') },
//         { title: 'Pastores', data: ['pastorName', 'pastor2Name'], transform: (e) => e[0] + ((e[1] && `, ${e[1]}`) || '') },
//         { title: 'Tipo', data: 'type', badge: true },
//         {
//             title: 'Fecha de expedición',
//             data: 'expeditionDate',
//             transform: (e) => format(formatToTZ(e) || new Date(), "d 'de' MMMM 'de' yyyy", { locale: es }),
//         },
//     ];

//     return (
//         <div className="space-y-3 bg-dashboardbg">
//             <StatsGrid>
//                 <InfoCard color="cyan" title="Total de certificados" data={stats?.total}>
//                     <FileCheck />
//                 </InfoCard>
//                 <InfoCard color="cyan" title="Expedidos en el ultimo mes" data={stats?.recent}>
//                     <CalendarClock />
//                 </InfoCard>
//                 <InfoCard color="cyan" title="Total de bautizo" data={stats?.baptized}>
//                     <FileBadge />
//                 </InfoCard>
//             </StatsGrid>

//             <OptionsGrid>
//                 <SearchInput placeholder="Buscar..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

//                 <DeleteDialog
//                     text="Desea eliminar este certificado?"
//                     path="certificates"
//                     open={open1}
//                     setOpen={setOpen1}
//                     successMessage="Certificado eliminado"
//                     id={selectedCertificate.id}
//                 />
//                 <div className="flex gap-2">
//                     <LogoUpload />
//                     <CertificatesForm open={open} setOpen={setOpen} />
//                 </div>
//             </OptionsGrid>

//             <Card>
//                 <CardContent className="p-0">
//                     <CrudTable
//                         columns={columns}
//                         data={certificates?.rows}
//                         status={status}
//                         setSelectedRow={setSelectedCertificate}
//                         setOpenDelete={setOpen1}
//                         downloadFunc={downloadCertificate}
//                     ></CrudTable>
//                 </CardContent>
//             </Card>
//             <PaginationMenu page={page} setPage={setPage} count={certificates?.count} rowsDisplayed={10} />
//         </div>
//     );
// };

// export default Certificates;
