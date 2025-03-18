import { api, tsr } from '@/lib/boilerplate';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { z } from 'zod';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditPermissionSchema } from '@iglesiasbc/schemas';

interface props {
    user: z.infer<typeof EditPermissionSchema> | undefined;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const UserForm = ({ user, open, setOpen }: props) => {
    const userForm = useForm<z.infer<typeof EditPermissionSchema>>({
        resolver: zodResolver(EditPermissionSchema),
    });
    const client = tsr.useQueryClient();

    const handleSubmit = async (values: z.infer<typeof EditPermissionSchema>) => {
        await api(tsr.permissions.edit, values);
        client.refetchQueries({ queryKey: ['permissions'] });
        setOpen(false);
    };

    useEffect(() => {
        if (!user) return;
        userForm.reset({ ...user });
    }, [user]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Actualizar usuario</DialogTitle>
                </DialogHeader>

                <Form {...userForm}>
                    <form
                        onSubmit={userForm.handleSubmit((values: z.infer<typeof EditPermissionSchema>) =>
                            showPromise(handleSubmit(values), 'Información actualizada')
                        )}
                        className="grid md:grid-cols-2 gap-x-12"
                    >
                        <FormField
                            control={userForm.control}
                            name="perm_members"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                    <div className="grid">
                                        <FormLabel className="font-semibold text-md">Permiso de miembros</FormLabel>
                                        <span className="text-secondary font-medium text-xs">
                                            Controla el acceso y gestión de los miembros de tu iglesia.
                                        </span>
                                    </div>

                                    <FormControl>
                                        <Switch className="translate-y-1" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={userForm.control}
                            name="perm_inventory"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                    <div className="grid">
                                        <FormLabel className="font-semibold text-md">Permiso de inventarios</FormLabel>
                                        <span className="text-secondary font-medium text-xs">
                                            Permite gestionar los inventarios y recursos disponibles.
                                        </span>
                                    </div>

                                    <FormControl>
                                        <Switch className="translate-y-1" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={userForm.control}
                            name="perm_blog"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                    <div className="grid">
                                        <FormLabel className="font-semibold text-md">Permiso de Blog</FormLabel>
                                        <span className="text-secondary font-medium text-xs">
                                            Permite gestionar y publicar contenido en el blog de la iglesia.
                                        </span>
                                    </div>

                                    <FormControl>
                                        <Switch className="translate-y-1" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={userForm.control}
                            name="perm_finances"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                    <div className="grid">
                                        <FormLabel className="font-semibold text-md">Permiso de finanzas</FormLabel>
                                        <span className="text-secondary font-medium text-xs">Controla la gestión financiera y los reportes.</span>
                                    </div>

                                    <FormControl>
                                        <Switch className="translate-y-1" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={userForm.control}
                            name="perm_website"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                    <div className="grid">
                                        <FormLabel className="font-semibold text-md">Permiso de página</FormLabel>
                                        <span className="text-secondary font-medium text-xs">
                                            Permite gestionar el contenido y diseño de la página web de la iglesia.
                                        </span>
                                    </div>

                                    <FormControl>
                                        <Switch className="translate-y-1" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-48 ml-auto md:col-span-2" type="submit">
                            Guardar
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UserForm;
