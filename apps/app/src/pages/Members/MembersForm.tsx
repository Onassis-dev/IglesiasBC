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
import { useFormQuery } from '@/lib/hooks/useFormQuery';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const MembersForm = ({ id, open, setOpen }: props) => {
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
    };

    const client = tsr.useQueryClient();
    const membersForm = useForm<z.infer<typeof PostMemberSchema>>({
        resolver: zodResolver(PostMemberSchema),
        defaultValues: defaultValues,
    });

    const member = useFormQuery(tsr.members.getOne.useQuery, {
        queryKey: ['member', id],
        enabled: !!id && open,
        queryData: {
            params: {
                id: String(id),
            },
        },
    });

    async function sendData(values: z.infer<typeof PostMemberSchema>) {
        const body = {
            ...values,
            birthday: formatToUTC(values.birthday) || values.birthday,
            joinDate: formatToUTC(values.joinDate) || values.joinDate,
        };

        if (id) await api(tsr.members.put, { ...body, id: Number(id) });
        if (!id) await api(tsr.members.post, body);

        client.invalidateQueries({ queryKey: ['members'] });
        setOpen(false);
    }

    useEffect(() => {
        if (member) {
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
    }, [member]);

    const { data: { body: positions } = {} } = tsr.options.getPositions.useQuery({
        queryKey: ['positionsObj'],
    });

    const submit = membersForm.handleSubmit((values: z.infer<typeof PostMemberSchema>) =>
        showPromise(sendData(values), id ? 'Información actualizada' : 'Miembro registrado')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Registrar miembro</RegisterButton>
            </SheetTrigger>
            <SheetContent onSubmit={submit}>
                <SheetHeader>
                    <SheetTitle>{id ? 'Editar miembro' : 'Registrar miembro'}</SheetTitle>
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
                            <FormField
                                control={membersForm.control}
                                name="cellphone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
