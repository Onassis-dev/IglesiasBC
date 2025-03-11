import { Button } from '@/components/ui/button';
import { api } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { useEffect, useState } from 'react';
import '@/lib/boilerplate';
import { Input } from '@/components/ui/input';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveUserData } from '@/lib/accountFunctions';
import { useUserConfigSchema, type UserConfigSchema } from './config.models';
import CreateChurchDialog from './CreateChurchDialog';

const Account = () => {
    const [churches, setChurches]: any = useState([]);
    const [isOwner, setIsOwner] = useState();
    const userConfigForm = useUserConfigSchema();

    const fetchData = async () => {
        const result = (await api.get('/users')).data;
        console.log(result);
        setChurches(result.churches);

        userConfigForm.setValue('churchId', result.user.churchId ? result.user.churchId.toString() : '0');
        userConfigForm.setValue('username', result.user.username);
        userConfigForm.setValue('email', result.user.email);
        setIsOwner(result.user.isOwner);
    };

    const handleSubmit: any = async (values: z.infer<typeof UserConfigSchema>) => {
        const userData = (await api.put('/users', { ...values })).data;

        saveUserData(userData);

        location.reload();
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log(isOwner);
    }, [isOwner]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuración de cuenta</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...userConfigForm}>
                    <form
                        className="space-y-4"
                        onSubmit={userConfigForm.handleSubmit((values: z.infer<typeof UserConfigSchema>) =>
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={userConfigForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input value={field.value} readOnly />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una iglesia" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {(churches.length &&
                                                        churches.map((church: any, i: number) => (
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
                            {!isOwner && <CreateChurchDialog />}
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
