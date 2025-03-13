import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { api, tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { useEffect, useState } from 'react';
import '@/lib/boilerplate';
import { Input } from '@/components/ui/input';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CircleMinus, CircleCheck, EditIcon, MoreHorizontal, Trash, Award } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import UserForm from './UserForm';
import UserInvite from './UserInvite';
import { SettingsSchema, UserSchema, useSettingsSchema } from './settings.models';
import { Link } from 'react-router';
import { displayDate } from '@/lib/timeFunctions';

const planNames = ['Plan Gratuito', 'Plan básico', 'Plan avanzado'];

const Settings = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [selectedUser, setSelectedUser] = useState<z.infer<typeof UserSchema>>();

    const settingsForm = useSettingsSchema();

    const { data: { body: church } = {} } = tsr.churches.get.useQuery({
        queryKey: ['churches'],
    });

    useEffect(() => {
        settingsForm.setValue('name', church?.name);
    }, [church]);

    const { data: { body: users } = {} } = tsr.permissions.get.useQuery({
        queryKey: ['permissions'],
    });

    const handlePortal = async () => {
        const { data } = await api.post('/payments/portal');
        window.location.href = data.url;
    };

    const handleSubmit: any = async (values: z.infer<typeof SettingsSchema>) => {
        await api.put('/churches', values);
    };

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
                                onSubmit={settingsForm.handleSubmit((values: z.infer<typeof SettingsSchema>) =>
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

            <Card className="w-full">
                <CardHeader className="flex gap-2 flex-row justify-between items-center">
                    <CardTitle>Usuarios</CardTitle>
                    <UserInvite />
                </CardHeader>

                <CardContent className="w-full overflow-auto max-w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead className="text-center">Perm. Miembros</TableHead>
                                <TableHead className="text-center">Perm. Finanzas</TableHead>
                                <TableHead className="text-center">Perm. Inventarios</TableHead>
                                {/* <TableHead className="text-center">
                  Perm. Certificados
                </TableHead> */}
                                {/* <TableHead className="text-center">Perm. Clases</TableHead> */}
                                <TableHead className="text-center">Perm. Pagina</TableHead>
                                <TableHead className="text-center">Perm. Blog</TableHead>
                                <TableHead className="text-center"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map((user: any, i: number) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="p-0 rounded-full" variant={user.perm_members ? 'green' : 'orange'}>
                                            {user.perm_members ? <CircleCheck /> : <CircleMinus />}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="p-0 rounded-full" variant={user.perm_finances ? 'green' : 'orange'}>
                                            {user.perm_finances ? <CircleCheck /> : <CircleMinus />}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="p-0 rounded-full" variant={user.perm_inventory ? 'green' : 'orange'}>
                                            {user.perm_inventory ? <CircleCheck /> : <CircleMinus />}
                                        </Badge>
                                    </TableCell>
                                    {/* <TableCell className="text-center">
                                        <Badge className="p-0 rounded-full" variant={user.perm_certificates ? 'green' : 'orange'}>
                                            {user.perm_certificates ? <CircleCheck /> : <CircleMinus />}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="p-0 rounded-full" variant={user.perm_classes ? 'green' : 'orange'}>
                                            {user.perm_classes ? <CircleCheck /> : <CircleMinus />}
                                        </Badge>
                                    </TableCell> */}
                                    <TableCell className="text-center">
                                        <Badge className="p-0 rounded-full" variant={user.perm_website ? 'green' : 'orange'}>
                                            {user.perm_website ? <CircleCheck /> : <CircleMinus />}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="p-0 rounded-full" variant={user.perm_blog ? 'green' : 'orange'}>
                                            {user.perm_blog ? <CircleCheck /> : <CircleMinus />}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="w-0 space-x-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setSelectedUser(users[i]);
                                                    }}
                                                >
                                                    <EditIcon className="size-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(users[i]);
                                                        setOpen1(true);
                                                    }}
                                                >
                                                    <Trash className="size-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
