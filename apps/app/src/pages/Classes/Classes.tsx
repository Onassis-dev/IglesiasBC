// import "@/lib/boilerplate";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/boilerplate";
// import { LibraryBig, Presentation, UsersRound } from "lucide-react";
// import DeleteDialog from "@/components/common/DeleteDialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { SearchInput } from "@/components/ui/input";
// import PaginationMenu from "@/components/common/PaginationMenu";
// import InfoCard from "@/components/common/InfoCard";
// import ClassesForm from "./ClassesForm";
// import ClassesCard from "./ClassesCard";
// import { OptionsGrid, StatsGrid } from "@/components/ui/grids";
// import { downloadFile } from "@/lib/downloadFile";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";

// import { CrudTable, type Column } from "@/components/common/CrudTable";

// export const Classes = () => {

//     const [open, setOpen] = useState(false);
//     const [open1, setOpen1] = useState(false);
//     const [open2, setOpen2] = useState(false);
//     const [selectedClass, setSelectedClass] = useState<any>({});
//     const [filters, setFilters] = useState<any>({ name: "" });
//     const [page, setPage] = useState(1);

//     const { data: classes, status } = useQuery({ queryKey: ["classes", page, filters], queryFn: async () => (await api.get("/classes", { params: { ...filters, page } })).data, placeholderData: keepPreviousData });
//     const { data: stats } = useQuery({ queryKey: ["classes", "stats"], queryFn: async () => (await api.get("/classes/stats")).data });

//     useEffect(() => {
//         if (!open && !open1 && !open2) setTimeout(() => setSelectedClass({}), 200);
//     }, [open, open1, open2]);

//     const downloadAssistanceList = async (id: string | number) => {
//         const buffer: ArrayBuffer = (await api.get(`/classes/list/${id}`, { responseType: "arraybuffer" })).data;
//         downloadFile(buffer, "application/pdf", "Lista.pdf");
//     };

//     const columns: Column[] = [{ title: "Clase", data: "title" }];

//     return (
//         <div className="flex flex-col gap-3">
//             <StatsGrid>
//                 <InfoCard color="blue" title="Total de clases" data={stats?.classes}>
//                     <Presentation />
//                 </InfoCard>
//                 <InfoCard color="blue" title="Total de materias" data={stats?.subjects}>
//                     <LibraryBig />
//                 </InfoCard>
//                 <InfoCard color="blue" title="Total de alumnos" data={stats?.students}>
//                     <UsersRound />
//                 </InfoCard>
//             </StatsGrid>
//             <OptionsGrid>
//                 <SearchInput placeholder="Buscar..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

//                 <DeleteDialog text="Desea eliminar esta clase?" successMessage="Clase eliminado" open={open1} setOpen={setOpen1} path="classes" id={selectedClass.id} />
//                 <ClassesForm open={open} setOpen={setOpen} id={selectedClass.id} />
//                 <ClassesCard open={open2} setOpen={setOpen2} selectedClass={selectedClass} />
//             </OptionsGrid>

//             <Card>
//                 <CardContent className="p-0">
//                     <CrudTable columns={columns} data={classes?.rows} status={status} setSelectedRow={setSelectedClass} setOpenView={setOpen2} setOpenEdit={setOpen} setOpenDelete={setOpen1} downloadFunc={downloadAssistanceList}></CrudTable>
//                 </CardContent>
//             </Card>
//             <PaginationMenu page={page} setPage={setPage} count={classes?.count} rowsDisplayed={10} />
//         </div>
//     );
// };

// export default Classes;
