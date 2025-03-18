// import { api } from "@/lib/boilerplate";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import type { z } from "zod";
// import { DialogHeader } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useEffect } from "react";
// import { showPromise } from "@/lib/showFunctions.tsx";
// // import { Button, RegisterButton } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { SubjectSchema, useSubjectSchema } from "./classes.models";

// interface props {
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     reload: any;
//     classId?: number | null;
// }

// const SubjectsForm = ({ open, setOpen, reload, classId }: props) => {
//     const membersForm = useSubjectSchema();

//     const handleSubmit = async (values: z.infer<typeof SubjectSchema>) => {
//         await api.post("/classes/subjects", { ...values, classId });
//         reload();
//         setOpen(false);
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {};

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <RegisterButton>Registrar materia</RegisterButton>
//             </DialogTrigger>
//             <DialogContent >
//                 <DialogHeader>
//                     <DialogTitle>Crear materia</DialogTitle>
//                 </DialogHeader>

//                 <Form {...membersForm}>
//                     <form onSubmit={membersForm.handleSubmit((values: z.infer<typeof SubjectSchema>) => showPromise(handleSubmit(values), "materia creada"))} className="flex flex-col gap-4">
//                         <FormField
//                             control={membersForm.control}
//                             name="title"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Materia</FormLabel>
//                                     <FormControl>
//                                         <Input {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <Button className="col-span-2" type="submit">
//                             Crear
//                         </Button>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default SubjectsForm;
