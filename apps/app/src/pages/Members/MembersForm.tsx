import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, tsr } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { RegisterButton } from '@/components/ui/button';
import { formatToTZ, formatToUTC } from '@/lib/timeFunctions';
import DatePicker from '@/components/common/DatePicker';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PostMemberSchema } from '@iglesiasbc/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import PhoneInput from '@/components/ui/phone-input';

interface props {
    member?: Record<string, any>;
    open: boolean;
    setOpen: (open: boolean) => void;
    setSelectedMember: (member: Record<string, any>) => void;
}

const defaultValues: z.infer<typeof PostMemberSchema> = {
    name: '',
    cellphone: '',
    baptized: '',
    email: '',
    genre: '',
    civilStatus: '',
    positionId: '',
    birthday: '',
    joinDate: '',
    countryCode: '+52',
};

const MembersForm = ({ member, open, setOpen, setSelectedMember }: props) => {
    const client = tsr.useQueryClient();
    const membersForm = useForm<z.infer<typeof PostMemberSchema>>({
        resolver: zodResolver(PostMemberSchema),
        defaultValues: defaultValues,
    });

    async function sendData(values: z.infer<typeof PostMemberSchema>) {
        const body = {
            ...values,
            birthday: formatToUTC(values.birthday) || values.birthday,
            joinDate: formatToUTC(values.joinDate) || values.joinDate,
        };

        if (member?.id) await api(tsr.members.put, { ...body, id: Number(member.id) });
        if (!member?.id) await api(tsr.members.post, body);

        client.invalidateQueries({ queryKey: ['members'] });
        setOpen(false);
    }

    useEffect(() => {
        if (member?.id) {
            membersForm.reset({
                ...member,
                birthday: member.birthday ? formatToTZ(member.birthday) || '' : '',
                joinDate: member.joinDate ? formatToTZ(member.joinDate) || '' : '',
                baptized: member.baptized?.toString(),
                positionId: member.positionId?.toString(),
            });
        } else {
            membersForm.reset(defaultValues);
        }
    }, [member, membersForm]);

    const { data: { body: positions } = {} } = tsr.options.getPositions.useQuery({
        queryKey: ['positionsObj'],
        refetchOnMount: false,
    });

    const submit = membersForm.handleSubmit((values: z.infer<typeof PostMemberSchema>) => {
        if (!values.cellphone) values.countryCode = null;
        showPromise(sendData(values), member?.id ? 'Información actualizada' : 'Miembro registrado');
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton
                    onClick={() => {
                        setSelectedMember({});
                    }}
                >
                    Registrar miembro
                </RegisterButton>
            </SheetTrigger>
            <SheetContent submit={submit}>
                <SheetHeader>
                    <SheetTitle>{member?.id ? 'Editar miembro' : 'Registrar miembro'}</SheetTitle>
                </SheetHeader>
                <SheetBody>
                    <Form {...membersForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={membersForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormLabel>Teléfono</FormLabel>
                            <div className="flex w-full">
                                <FormField
                                    control={membersForm.control}
                                    name="countryCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <PhoneInput
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                    className="pl-2 pr-1 w-[4rem] justify-end rounded-r-none"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={membersForm.control}
                                    name="cellphone"
                                    render={({ field }) => (
                                        <>
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input
                                                        value={field.value || ''}
                                                        onChange={field.onChange}
                                                        className="rounded-l-none border-l-0"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </>
                                    )}
                                />
                            </div>
                            <FormField
                                control={membersForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo</FormLabel>
                                        <FormControl>
                                            <Input value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={membersForm.control}
                                name="baptized"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bautizado(a)</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={'true'}>Bautizado(a)</SelectItem>
                                                    <SelectItem value={'false'}>No bautizado(a)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={membersForm.control}
                                name="genre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Género</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="M">Masculino</SelectItem>
                                                    <SelectItem value="F">Femenino</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={membersForm.control}
                                name="civilStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado civil</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Casado">Casado</SelectItem>
                                                    <SelectItem value="Soltero">Soltero</SelectItem>
                                                    <SelectItem value="Divorciado">Divorciado</SelectItem>
                                                    <SelectItem value="Comprometido">Comprometido</SelectItem>
                                                    <SelectItem value="Unión libre">Unión libre</SelectItem>
                                                    <SelectItem value="Viuda">Viuda</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={membersForm.control}
                                name="positionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cargo</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(positions || []).map((v: any) => (
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
                                name="birthday"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de nacimiento</FormLabel>
                                        <FormControl>
                                            <DatePicker field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={membersForm.control}
                                name="joinDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de membresia</FormLabel>
                                        <FormControl>
                                            <DatePicker field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </SheetBody>
            </SheetContent>
        </Sheet>
    );
};

export default MembersForm;
