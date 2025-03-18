// import { api } from "@/lib/boilerplate";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import type { z } from "zod";
// import { DialogHeader } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useEffect, useState } from "react";
// import { showPromise } from "@/lib/showFunctions.tsx";
// import { Button } from "@/components/ui/button";
// // import { PlusCircleIcon } from "lucide-react";
// import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { StudentSchema, useStudentSchema } from "./classes.models";

// interface props {
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     reload: any;
//     classId?: number | null;
// }

// const StudentsForm = ({ open, setOpen, reload, classId }: props) => {
//     const membersForm = useStudentSchema();
//     const [members, setMembers] = useState<any[]>([]);

//     const [open1, setOpen1] = useState(false);

//     const handleSubmit = async (values: z.infer<typeof StudentSchema>) => {
//         await api.post("/classes/students", { ...values, classId });
//         reload();
//         setOpen(false);
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         setMembers((await api.get("/classes/members")).data);
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button className="h-full gap-2">
//                     <PlusCircleIcon className="h-3.5 w-3.5" />
//                     <span>Registrar alumno</span>
//                 </Button>
//             </DialogTrigger>
//             <DialogContent >
//                 <DialogHeader>
//                     <DialogTitle>Registrar alumno</DialogTitle>
//                 </DialogHeader>

//                 <Form {...membersForm}>
//                     <form onSubmit={membersForm.handleSubmit((values: z.infer<typeof StudentSchema>) => showPromise(handleSubmit(values), "Alumno registrado"))} className="flex flex-col gap-4">
//                         <FormField
//                             control={membersForm.control}
//                             name="memberId"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Estudiante</FormLabel>
//                                     <FormControl>
//                                         <Popover open={open1} onOpenChange={setOpen1}>
//                                             <PopoverTrigger asChild>
//                                                 <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
//                                                     {field.value ? members.find((member) => member.id.toString() === field.value)?.name : "Elige un miembro"}
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-full p-0">
//                                                 <Command>
//                                                     <CommandInput placeholder="Elige un estudiante" />
//                                                     <CommandList>
//                                                         <CommandGroup>
//                                                             {(members || []).map((member) => (
//                                                                 <CommandItem
//                                                                     key={member.id.toString()}
//                                                                     value={member.name}
//                                                                     onSelect={(currentValue) => {
//                                                                         setOpen1(false);
//                                                                         membersForm.setValue("memberId", members.find((member) => member.name === currentValue)?.id.toString());
//                                                                     }}
//                                                                 >
//                                                                     {member.name}
//                                                                 </CommandItem>
//                                                             ))}
//                                                         </CommandGroup>
//                                                     </CommandList>
//                                                 </Command>
//                                             </PopoverContent>
//                                         </Popover>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <Button className="col-span-2" type="submit">
//                             Registrar
//                         </Button>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default StudentsForm;
