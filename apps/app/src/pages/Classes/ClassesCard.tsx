// import { api } from "@/lib/boilerplate";
// import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
// import type { z } from "zod";
// import { DialogHeader } from "@/components/ui/dialog";
// import { useEffect, useState } from "react";
// import { Trash, UserMinus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import DeleteDialog from "@/components/common/DeleteDialog";
// import StudentsForm from "./StudentForm";
// import SubjectsForm from "./SubjectsForm";
// import { showPromise } from "@/lib/showFunctions.tsx";
// import type { ClassSchema } from "./classes.models";

// interface props {
//     selectedClass: z.infer<typeof ClassSchema> | null;
//     open: boolean;
//     setOpen: (open: boolean) => void;
// }

// const ClassesCard = ({ selectedClass, open, setOpen }: props) => {
//     const [students, setStudents] = useState<any>([]);
//     const [subjects, setSubjects] = useState<any>([]);

//     const [selectedStudent, setSelectedStudent] = useState<any | null>();
//     const [selectedSubject, setSelectedSubject] = useState<any | null>();

//     const [open1, setOpen1] = useState(false);
//     const [open2, setOpen2] = useState(false);
//     const [open3, setOpen3] = useState(false);
//     const [open4, setOpen4] = useState(false);

//     useEffect(() => {
//         fetchData();
//     }, [selectedClass]);

//     const fetchData = async () => {
//         if (!selectedClass) return;
//         const result = (await api.get("/classes/data/" + selectedClass.id)).data;
//         setStudents(result.students);
//         setSubjects(result.subjects);
//     };

//     const deleteSubject = async () => {
//         await api.delete("/classes/subjects/" + selectedSubject?.id);
//         setSelectedSubject(null);
//         await fetchData();
//     };

//     const deleteStudent = async () => {
//         await api.delete("/classes/students/" + selectedStudent?.id);
//         setSelectedStudent(null);
//         await fetchData();
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className="w-xl">
//                 <DialogHeader>
//                     <DialogTitle>{selectedClass?.title}</DialogTitle>
//                     <DeleteDialog open={open3} setOpen={setOpen3} deleteFunc={() => showPromise(deleteSubject(), "Materia eliminada")} text="Eliminar materia" />
//                     <DeleteDialog open={open4} setOpen={setOpen4} deleteFunc={() => showPromise(deleteStudent(), "Estudiante dado de baja")} text="Dar de baja alumno" />
//                 </DialogHeader>

//                 <div className="grid grid-cols-2 gap-2">
//                     <div>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Estudiantes</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {students?.map((student: any, i: number) => (
//                                     <TableRow key={student.id}>
//                                         <TableCell>{student.name}</TableCell>
//                                         <TableCell className="w-0">
//                                             <Button
//                                                 variant={"outline"}
//                                                 size={"icon"}
//                                                 onClick={() => {
//                                                     setSelectedStudent(students[i]);
//                                                     setOpen4(true);
//                                                 }}
//                                             >
//                                                 <UserMinus className="size-4 " />
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>

//                     <div>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Materias</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {subjects?.map((subject: any, i: number) => (
//                                     <TableRow key={subject.id}>
//                                         <TableCell>{subject.title}</TableCell>
//                                         <TableCell className="w-0">
//                                             <Button
//                                                 variant={"outline"}
//                                                 size={"icon"}
//                                                 onClick={() => {
//                                                     setSelectedSubject(subjects[i]);
//                                                     setOpen3(true);
//                                                 }}
//                                             >
//                                                 <Trash className="size-4 " />
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </div>

//                 <DialogFooter className="block">
//                     <div className="grid gap-2 grid-cols-2">
//                         <StudentsForm open={open1} setOpen={setOpen1} reload={fetchData} classId={selectedClass?.id} />
//                         <SubjectsForm open={open2} setOpen={setOpen2} reload={fetchData} classId={selectedClass?.id} />
//                     </div>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default ClassesCard;
