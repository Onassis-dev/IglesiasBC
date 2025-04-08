import { api, tsr } from '@/lib/boilerplate';
import { Sheet, SheetContent, SheetBody } from '@/components/ui/sheet';
import type { z } from 'zod';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
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
    const defaultValues: z.infer<typeof EditPermissionSchema> = {
        id: 0,
        perm_members: false,
        perm_inventory: false,
        perm_certificates: false,
        perm_blog: false,
        perm_finances: false,
        perm_website: false,
        perm_presentations: false,
    };

    const userForm = useForm<z.infer<typeof EditPermissionSchema>>({
        resolver: zodResolver(EditPermissionSchema),
        defaultValues: defaultValues,
    });
    const client = tsr.useQueryClient();

    const handleSubmit = async (values: z.infer<typeof EditPermissionSchema>) => {
        await api(tsr.permissions.edit, values);
        client.refetchQueries({ queryKey: ['permissions'] });
        setOpen(false);
    };

    useEffect(() => {
        if (!open) {
            userForm.reset(defaultValues);
            return;
        }

        if (!user) return;

        userForm.reset({
            ...user,
        });
    }, [user, open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
                className="max-w-4xl"
                onSubmit={userForm.handleSubmit((values: z.infer<typeof EditPermissionSchema>) =>
                    showPromise(handleSubmit(values), 'Información actualizada')
                )}
            >
                <SheetHeader>
                    <SheetTitle>Actualizar usuario</SheetTitle>
                </SheetHeader>

                <SheetBody>
                    <Form {...userForm}>
                        <form
                            onSubmit={userForm.handleSubmit((values: z.infer<typeof EditPermissionSchema>) =>
                                showPromise(handleSubmit(values), 'Información actualizada')
                            )}
                        >
                            <FormField
                                control={userForm.control}
                                name="perm_members"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                        <div className="grid">
                                            <FormLabel className="mb-2">Permiso de miembros</FormLabel>
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
                                            <FormLabel className="mb-2">Permiso de inventarios</FormLabel>
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
                                name="perm_certificates"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                        <div className="grid">
                                            <FormLabel className="mb-2">Permiso de certificados</FormLabel>
                                            <span className="text-secondary font-medium text-xs">
                                                Permite crear y gestionar los certificados de la iglesia.
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
                                            <FormLabel className="mb-2">Permiso de Blog</FormLabel>
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
                                            <FormLabel className="mb-2">Permiso de finanzas</FormLabel>
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
                                            <FormLabel className="mb-2">Permiso de página</FormLabel>
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
                            <FormField
                                control={userForm.control}
                                name="perm_presentations"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-[auto,2.5rem] gap-4">
                                        <div className="grid">
                                            <FormLabel className="mb-2">Permiso de presentaciones</FormLabel>
                                            <span className="text-secondary font-medium text-xs">
                                                Permite gestionar las presentaciones de la iglesia.
                                            </span>
                                        </div>

                                        <FormControl>
                                            <Switch className="translate-y-1" checked={field.value} onCheckedChange={field.onChange} />
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

export default UserForm;
