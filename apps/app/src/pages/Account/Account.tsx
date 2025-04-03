import { Button } from '@/components/ui/button';
import { api, tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import '@/lib/boilerplate';
import { Input } from '@/components/ui/input';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveUserData } from '@/lib/accountFunctions';
import CreateChurchDialog from './CreateChurchDialog';
import { useEffect } from 'react';
import { FrontendUserSchema } from '@iglesiasbc/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/lib/store';
import { updateProfile } from 'firebase/auth';

const Account = () => {
    const userConfigForm = useForm<z.infer<typeof FrontendUserSchema>>({
        resolver: zodResolver(FrontendUserSchema),
    });

    const user = useUserStore((state) => state.user);

    const { data: { body: data } = {} } = tsr.users.get.useQuery({
        queryKey: ['user'],
    });

    useEffect(() => {
        userConfigForm.reset({
            churchId: data?.user?.churchId ? data?.user?.churchId.toString() : '0',
            username: user?.displayName || '',
        });
    }, [data, user]);

    const handleSubmit: any = async (values: z.infer<typeof FrontendUserSchema>) => {
        const userData: any = await api(tsr.users.editUser, { churchId: values.churchId });
        if (user) await updateProfile(user, { displayName: values.username });
        saveUserData(userData);
        location.reload();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuración de tu cuenta</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...userConfigForm}>
                    <form
                        className="space-y-4"
                        onSubmit={userConfigForm.handleSubmit((values: z.infer<typeof FrontendUserSchema>) =>
                            showPromise(handleSubmit(values), 'Datos actualizados')
                        )}
                    >
                        <FormField
                            control={userConfigForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de usuario</FormLabel>
                                    <FormControl>
                                        <Input className="max-w-lg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                                <Input className="max-w-lg" value={user?.email || ''} readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <div className="w-full flex gap-2 sm:items-center items-start flex-col sm:flex-row">
                            <FormField
                                control={userConfigForm.control}
                                name="churchId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Iglesia seleccionada</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.value ? field.onChange : undefined}>
                                                <FormControl>
                                                    <SelectTrigger className="max-w-lg">
                                                        <SelectValue placeholder="Selecciona una iglesia" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {(data?.churches.length &&
                                                        data?.churches.map((church: any, i: number) => (
                                                            <SelectItem key={i} value={church.id.toString()}>
                                                                {church.name}
                                                            </SelectItem>
                                                        ))) || <SelectItem value="0">No tienes ninguna iglesia registrada</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!data?.user?.isOwner && <CreateChurchDialog />}
                        </div>

                        <div className="w-full">{/* <Button variant="outline">Cambiar contraseña</Button> */}</div>
                        <Button className="!mt-8">Guardar cambios</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default Account;
