// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { api } from '@/lib/boilerplate';
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import type { z } from 'zod';
// import { DialogHeader } from '@/components/ui/dialog';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { useState } from 'react';
// import { showPromise } from '@/lib/showFunctions.tsx';
// import { Button, RegisterButton } from '@/components/ui/button';
// import { ChevronDown } from 'lucide-react';
// import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { useCertificateSchema, type CertificateSchema } from './certificates.models';
// import { useQuery } from '@tanstack/react-query';

// import DatePicker from '@/components/common/DatePicker';

// interface props {
//     open: boolean;
//     setOpen: (open: boolean) => void;
// }

// const CertificatesForm = ({ open, setOpen }: props) => {
//     const membersForm = useCertificateSchema();

//     const [certificateId, setCertificateId] = useState('');

//     const [open1, setOpen1] = useState(false);
//     const [open2, setOpen2] = useState(false);
//     const [open3, setOpen3] = useState(false);
//     const [open4, setOpen4] = useState(false);

//     const handleSubmit = async (values: z.infer<typeof CertificateSchema>) => {
//         await api.post('/certificates', values);
//         ({ queryKey: ['certificates'] });
//         setOpen(false);
//     };

//     const { data: certificates } = useQuery({
//         queryKey: ['certificatesOptions'],
//         queryFn: async () => (await api.get('/options/certificates')).data,
//     });

//     const { data: members } = useQuery({
//         queryKey: ['membersOptions'],
//         queryFn: async () => (await api.get('/certificates/members?name=1')).data,
//     });

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <RegisterButton>Crear certificado</RegisterButton>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Crear certificado</DialogTitle>
//                 </DialogHeader>

//                 <Form {...membersForm}>
//                     <form
//                         onSubmit={membersForm.handleSubmit((values: z.infer<typeof CertificateSchema>) =>
//                             showPromise(handleSubmit(values), 'Certificado creado')
//                         )}
//                         className="grid grid-cols-2 gap-x-6"
//                     >
//                         <FormField
//                             control={membersForm.control}
//                             name="certificateTypeId"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Tipo de certificado</FormLabel>
//                                     <FormControl>
//                                         <Select
//                                             value={field.value}
//                                             onValueChange={(v) => {
//                                                 field.onChange(v);
//                                                 setCertificateId(v);
//                                             }}
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Elige una opción" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {(certificates || []).map((v: any) => (
//                                                     <SelectItem key={v.id} value={v.id?.toString()}>
//                                                         {v.value}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={membersForm.control}
//                             name="expeditionDate"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Fecha de expedición</FormLabel>
//                                     <FormControl>
//                                         <DatePicker field={field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={membersForm.control}
//                             name="member"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Miembro</FormLabel>
//                                     <FormControl>
//                                         <Popover open={open1} onOpenChange={setOpen1}>
//                                             <PopoverTrigger asChild>
//                                                 <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
//                                                     {field.value
//                                                         ? members.find((member: any) => member.name === field.value)?.name
//                                                         : 'Elige un miembro'}
//                                                     <ChevronDown className="h-4 w-4 opacity-50" />
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-full p-0">
//                                                 <Command>
//                                                     <CommandInput placeholder="Elige un miembro" />
//                                                     <CommandList>
//                                                         <CommandGroup>
//                                                             {members.map((member: any) => (
//                                                                 <CommandItem
//                                                                     key={member.id.toString()}
//                                                                     value={member.name}
//                                                                     onSelect={(currentValue) => {
//                                                                         setOpen1(false);
//                                                                         membersForm.setValue(
//                                                                             'member',
//                                                                             members.find((member: any) => member.name === currentValue)?.name
//                                                                         );
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

//                         {certificateId === '4' && (
//                             <FormField
//                                 control={membersForm.control}
//                                 name="member2"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Segundo miembro</FormLabel>

//                                         <FormControl>
//                                             <Popover open={open2} onOpenChange={setOpen2}>
//                                                 <PopoverTrigger asChild>
//                                                     <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
//                                                         {field.value
//                                                             ? members.find((member: any) => member.name === field.value)?.name
//                                                             : 'Elige un miembro'}
//                                                         <ChevronDown className="h-4 w-4 opacity-50" />
//                                                     </Button>
//                                                 </PopoverTrigger>
//                                                 <PopoverContent className="w-full p-0">
//                                                     <Command>
//                                                         <CommandInput placeholder="Elige un miembro" />
//                                                         <CommandList>
//                                                             <CommandGroup>
//                                                                 {members.map((member: any) => (
//                                                                     <CommandItem
//                                                                         key={member.id.toString()}
//                                                                         value={member.name}
//                                                                         onSelect={(currentValue) => {
//                                                                             setOpen2(false);
//                                                                             membersForm.setValue(
//                                                                                 'member2',
//                                                                                 members.find((member: any) => member.name === currentValue)?.name
//                                                                             );
//                                                                         }}
//                                                                     >
//                                                                         {member.name}
//                                                                     </CommandItem>
//                                                                 ))}
//                                                             </CommandGroup>
//                                                         </CommandList>
//                                                     </Command>
//                                                 </PopoverContent>
//                                             </Popover>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         )}

//                         <FormField
//                             control={membersForm.control}
//                             name="pastor"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Oficiante</FormLabel>
//                                     <FormControl>
//                                         <Popover open={open3} onOpenChange={setOpen3}>
//                                             <PopoverTrigger asChild>
//                                                 <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
//                                                     {field.value
//                                                         ? members.find((member: any) => member.name === field.value)?.name
//                                                         : 'Elige un miembro'}
//                                                     <ChevronDown className="h-4 w-4 opacity-50" />
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-full p-0">
//                                                 <Command>
//                                                     <CommandInput placeholder="Elige un miembro" />
//                                                     <CommandList>
//                                                         <CommandGroup>
//                                                             {members.map((member: any) => (
//                                                                 <CommandItem
//                                                                     key={member.id.toString()}
//                                                                     value={member.name}
//                                                                     onSelect={(currentValue) => {
//                                                                         setOpen3(false);
//                                                                         membersForm.setValue(
//                                                                             'pastor',
//                                                                             members.find((member: any) => member.name === currentValue)?.name
//                                                                         );
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

//                         <FormField
//                             control={membersForm.control}
//                             name="pastor2"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Segundo oficiante</FormLabel>
//                                     <FormControl>
//                                         <Popover open={open4} onOpenChange={setOpen4}>
//                                             <PopoverTrigger asChild>
//                                                 <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
//                                                     {field.value
//                                                         ? members.find((member: any) => member.name === field.value)?.name
//                                                         : 'Elige un miembro'}
//                                                     <ChevronDown className="h-4 w-4 opacity-50" />
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-full p-0">
//                                                 <Command>
//                                                     <CommandInput placeholder="Elige un miembro" />
//                                                     <CommandList>
//                                                         <CommandGroup>
//                                                             {members.map((member: any) => (
//                                                                 <CommandItem
//                                                                     key={member.id.toString()}
//                                                                     value={member.name}
//                                                                     onSelect={(currentValue) => {
//                                                                         setOpen4(false);
//                                                                         membersForm.setValue(
//                                                                             'pastor2',
//                                                                             members.find((member: any) => member.name === currentValue)?.name
//                                                                         );
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
//                             Crear
//                         </Button>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default CertificatesForm;
