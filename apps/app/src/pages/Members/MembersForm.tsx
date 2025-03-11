import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { formatToTZ, formatToUTC } from '@/lib/timeFunctions';
import { useMemberSchema, type MemberSchema } from './members.models';
import DatePicker from '@/components/common/DatePicker';
import { useQuery } from '@tanstack/react-query';
import { useQueryStore } from '@/lib/store';
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const MembersForm = ({ id, open, setOpen }: props) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const membersForm = useMemberSchema();

    const { data: member } = useQuery({
        queryKey: ['member', id],
        queryFn: async () => (await api.get(`/members/${id}`)).data,
        initialData: {},
        enabled: !!id,
    });

    const handleSubmit = async (values: z.infer<typeof MemberSchema>) => {
        values.birthday = values.id ? formatToUTC(values.birthday) || values.birthday : values.birthday;
        values.joinDate = values.id ? formatToUTC(values.joinDate) || values.joinDate : values.joinDate;
        if (id) {
            await api.put('/members', values);
        } else {
            await api.post('/members', values);
        }

        client.refetchQueries({ queryKey: ['members'] });
        setOpen(false);
        membersForm.reset();
    };

    useEffect(() => {
        if (member) {
            membersForm.setValue('name', member.name);
            membersForm.setValue('baptized', member.baptized?.toString());
            membersForm.setValue('birthday', member.birthday ? formatToTZ(member.birthday) || '' : '');
            membersForm.setValue('joinDate', member.joinDate ? formatToTZ(member.joinDate) || '' : '');
            membersForm.setValue('cellphone', member.cellphone);
            membersForm.setValue('civilStatus', member.civilStatus);
            membersForm.setValue('email', member.email);
            membersForm.setValue('genre', member.genre);
            membersForm.setValue('positionId', member.positionId?.toString());
            membersForm.setValue('id', member.id);
        }
    }, [member]);

    const { data: positions } = useQuery({
        queryKey: ['positions'],
        queryFn: async () => (await api.get('/options/positions')).data,
    });

    const submit = membersForm.handleSubmit((values: z.infer<typeof MemberSchema>) =>
        showPromise(handleSubmit(values), id ? 'Información actualizada' : 'Miembro registrado')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Registrar miembro</RegisterButton>
            </SheetTrigger>
            <SheetContent>
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>{id ? 'Actualizar miembro' : 'Registrar nuevo miembro'}</SheetTitle>
                    </SheetHeader>

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

export default MembersForm;
