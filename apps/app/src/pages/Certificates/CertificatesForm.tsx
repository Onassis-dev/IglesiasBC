import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group-card';
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, tsr } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState, useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PostCertificateSchema } from '@iglesiasbc/schemas';
import DatePicker from '@/components/common/DatePicker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatToUTC } from '@/lib/timeFunctions';
import { cn } from '@/lib/utils';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const CertificatesForm = ({ open, setOpen }: props) => {
    const defaultValues: z.infer<typeof PostCertificateSchema> = {
        certificateTypeId: '',
        expeditionDate: '',
        member: '',
        member2: '',
        pastor: '',
        pastor2: '',
        design: '',
    };

    const client = tsr.useQueryClient();
    const membersForm = useForm<z.infer<typeof PostCertificateSchema>>({
        resolver: zodResolver(PostCertificateSchema),
        defaultValues: defaultValues,
    });

    const [certificateId, setCertificateId] = useState('');

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);

    useEffect(() => {
        if (!open) {
            membersForm.reset(defaultValues);
            setCertificateId('');
        }
    }, [open]);

    const handleSubmit = async (values: z.infer<typeof PostCertificateSchema>) => {
        await api(tsr.certificates.create, {
            ...values,
            expeditionDate: formatToUTC(values.expeditionDate) || values.expeditionDate,
        });
        client.invalidateQueries({ queryKey: ['certificates'] });
        setOpen(false);
    };

    const { data: { body: certificates } = {} } = tsr.options.getCertificateTypes.useQuery({
        queryKey: ['certificatesOptions'],
    });

    const { data: { body: members } = {} } = tsr.certificates.getMembers.useQuery({
        queryKey: ['membersOptions'],
    });

    const submit = membersForm.handleSubmit((values: z.infer<typeof PostCertificateSchema>) =>
        showPromise(handleSubmit(values), 'Certificado creado')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Crear certificado</RegisterButton>
            </SheetTrigger>
            <SheetContent>
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>Crear certificado</SheetTitle>
                    </SheetHeader>

                    <Form {...membersForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={membersForm.control}
                                name="certificateTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de certificado</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={(v) => {
                                                    field.onChange(v);
                                                    setCertificateId(v);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Elige una opción" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(certificates || []).map((v: any) => (
                                                        <SelectItem key={v.id} value={v.id?.toString()}>
                                                            {v.value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={membersForm.control}
                                name="expeditionDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de expedición</FormLabel>
                                        <FormControl>
                                            <DatePicker field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={membersForm.control}
                                name="member"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Miembro</FormLabel>
                                        <FormControl>
                                            <Popover open={open1} onOpenChange={setOpen1}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}
                                                    >
                                                        {field.value
                                                            ? members.find((member: any) => member.name === field.value)?.name
                                                            : 'Elige un miembro'}
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Elige un miembro" />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {members?.map((member: any) => (
                                                                    <CommandItem
                                                                        key={member.id.toString()}
                                                                        value={member.name}
                                                                        onSelect={(currentValue) => {
                                                                            setOpen1(false);
                                                                            membersForm.setValue(
                                                                                'member',
                                                                                members.find((member: any) => member.name === currentValue)?.name,
                                                                                { shouldValidate: true }
                                                                            );
                                                                        }}
                                                                    >
                                                                        {member.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {certificateId === '4' && (
                                <FormField
                                    control={membersForm.control}
                                    name="member2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Segundo miembro</FormLabel>

                                            <FormControl>
                                                <Popover open={open2} onOpenChange={setOpen2}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={open}
                                                            className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}
                                                        >
                                                            {field.value
                                                                ? members.find((member: any) => member.name === field.value)?.name
                                                                : 'Elige un miembro'}
                                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Elige un miembro" />
                                                            <CommandList>
                                                                <CommandGroup>
                                                                    {members?.map((member: any) => (
                                                                        <CommandItem
                                                                            key={member.id.toString()}
                                                                            value={member.name}
                                                                            onSelect={(currentValue) => {
                                                                                setOpen2(false);
                                                                                membersForm.setValue(
                                                                                    'member2',
                                                                                    members.find((member: any) => member.name === currentValue)?.name,
                                                                                    { shouldValidate: true }
                                                                                );
                                                                            }}
                                                                        >
                                                                            {member.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={membersForm.control}
                                name="pastor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Oficiante</FormLabel>
                                        <FormControl>
                                            <Popover open={open3} onOpenChange={setOpen3}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}
                                                    >
                                                        {field.value
                                                            ? members.find((member: any) => member.name === field.value)?.name
                                                            : 'Elige un miembro'}
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Elige un miembro" />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {members?.map((member: any) => (
                                                                    <CommandItem
                                                                        key={member.id.toString()}
                                                                        value={member.name}
                                                                        onSelect={(currentValue) => {
                                                                            setOpen3(false);
                                                                            membersForm.setValue(
                                                                                'pastor',
                                                                                members.find((member: any) => member.name === currentValue)?.name,
                                                                                { shouldValidate: true }
                                                                            );
                                                                        }}
                                                                    >
                                                                        {member.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={membersForm.control}
                                name="pastor2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Segundo oficiante</FormLabel>
                                        <FormControl>
                                            <Popover open={open4} onOpenChange={setOpen4}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}
                                                    >
                                                        {field.value
                                                            ? members.find((member: any) => member.name === field.value)?.name
                                                            : 'Elige un miembro'}
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Elige un miembro" />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {members?.map((member: any) => (
                                                                    <CommandItem
                                                                        key={member.id.toString()}
                                                                        value={member.name}
                                                                        onSelect={(currentValue) => {
                                                                            setOpen4(false);
                                                                            membersForm.setValue(
                                                                                'pastor2',
                                                                                members.find((member: any) => member.name === currentValue)?.name,
                                                                                { shouldValidate: true }
                                                                            );
                                                                        }}
                                                                    >
                                                                        {member.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={membersForm.control}
                                name="design"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diseño</FormLabel>
                                        <FormControl {...field} className="grid grid-cols-2 gap-2">
                                            <RadioGroup onValueChange={field.onChange} defaultValue={'1'}>
                                                <RadioGroupItem value="1" className="w-full aspect-[11/8] rounded-sm border">
                                                    <img src="/certificates/1.webp" alt="Diseño 1" className="" />
                                                </RadioGroupItem>
                                                <RadioGroupItem value="2" className="w-full aspect-[11/8] rounded-sm border">
                                                    <img src="/certificates/2.webp" alt="Diseño 2" className="" />
                                                </RadioGroupItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </SheetBody>
                <SheetFooter>
                    <Button className="w-full sm:w-auto" onClick={submit}>
                        Guardar
                    </Button>
                    <Button asChild variant="outline">
                        <SheetClose className="w-full sm:w-auto">Cerrar</SheetClose>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CertificatesForm;
