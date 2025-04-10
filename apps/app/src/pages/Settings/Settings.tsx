import { Button } from '@/components/ui/button';
import { api, tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { useEffect, useState } from 'react';
import '@/lib/boilerplate';
import { Input } from '@/components/ui/input';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteDialog from '@/components/common/DeleteDialog';
import UserForm from './UserForm';
import UserInvite from './UserInvite';
import { Link } from 'react-router';
import { displayDate } from '@/lib/timeFunctions';
import { ChurchSchema, EditPermissionSchema } from '@iglesiasbc/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { OptionsGrid } from '@/components/ui/grids';
import { Column, CrudTable } from '@/components/common/CrudTable';
import { Award } from 'lucide-react';

const planNames = ['Plan Gratuito', 'Plan básico', 'Plan avanzado'];

const Settings = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [selectedUser, setSelectedUser] = useState<z.infer<typeof EditPermissionSchema>>();

    const settingsForm = useForm<z.infer<typeof ChurchSchema>>({
        resolver: zodResolver(ChurchSchema),
    });

    const { data: { body: church } = {} } = tsr.churches.get.useQuery({
        queryKey: ['churches'],
    });

    useEffect(() => {
        settingsForm.setValue('name', church?.name);
    }, [church, settingsForm]);

    const { data: { body: users } = {}, status } = tsr.permissions.get.useQuery({
        queryKey: ['permissions'],
    });

    const handlePortal = async () => {
        // @ts-expect-error - The headers are automatically sent by the browser
        const data: { url: string } = await api(tsr.payments.portal, null);
        if (data?.url) window.location.href = data.url;
    };

    const handleSubmit: any = async (values: z.infer<typeof ChurchSchema>) => {
        api(tsr.churches.edit, values);
    };

    const columns: Column[] = [
        { title: 'Usuario', data: 'username' },
        { title: 'Perm. Miembros', data: 'perm_members', checkbox: true },
        { title: 'Perm. Finanzas', data: 'perm_finances', checkbox: true },
        { title: 'Perm. Inventario', data: 'perm_inventory', checkbox: true },
        { title: 'Perm. Certificados', data: 'perm_certificates', checkbox: true },
        { title: 'Perm. Presentaciones', data: 'perm_presentations', checkbox: true },
        { title: 'Perm. Pagina', data: 'perm_website', checkbox: true },
        { title: 'Perm. Blog', data: 'perm_blog', checkbox: true },
    ];

    return (
        <div className="space-y-4 w-full">
            <div className="grid lg:grid-cols-2 gap-4 w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración de tu iglesia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...settingsForm}>
                            <form
                                className="space-y-4"
                                onSubmit={settingsForm.handleSubmit((values: z.infer<typeof ChurchSchema>) =>
                                    showPromise(handleSubmit(values), 'Datos actualizados')
                                )}
                            >
                                <FormField
                                    control={settingsForm.control}
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

                                <Button size="sm" className="!mt-8">
                                    Guardar cambios
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Facturación</CardTitle>
                    </CardHeader>
                    {church?.plan > 0 ? (
                        <CardContent className="flex flex-col h-full items-start gap-4">
                            <p>
                                <span className="font-semibold">Plan activo:</span> {planNames[church?.plan]}
                            </p>
                            <p>
                                <span className="font-semibold">Fecha de expiración:</span> {displayDate(church?.expirationDate)}
                            </p>
                            <Button onClick={handlePortal} size="sm" className="mt-auto">
                                Actualizar el plan
                            </Button>
                        </CardContent>
                    ) : (
                        <CardContent className="flex flex-col h-full items-start gap-4">
                            <p>
                                <span className="font-semibold">Plan activo:</span> {planNames[church?.plan]}
                            </p>

                            <Button asChild size="sm" className="mt-auto text-yellow" variant={'outline'}>
                                <Link to="/pricing">
                                    <Award className="size-4 mr-2" />
                                    Mejorar plan
                                </Link>
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>

            <OptionsGrid className="!mt-8">
                <CardTitle className="pl-1 flex items-center">Usuarios</CardTitle>
                <UserInvite />
            </OptionsGrid>

            <CrudTable
                columns={columns}
                data={users}
                status={status}
                setSelectedRow={setSelectedUser}
                setOpenEdit={setOpen}
                setOpenDelete={setOpen1}
                onRowClick={setOpen}
            />

            <DeleteDialog
                text="¿Estás seguro de que quieres eliminar a este usuario de tu iglesia?"
                open={open1}
                setOpen={setOpen1}
                id={selectedUser?.id || 0}
                successMessage="Miembro eliminado"
                path="permissions"
            />
            <UserForm open={open} setOpen={setOpen} user={selectedUser} />
        </div>
    );
};

export default Settings;
