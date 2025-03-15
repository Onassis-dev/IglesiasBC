import { api2, tsr } from '@/lib/boilerplate';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { z } from 'zod';
import { DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { PostPermissionSchema } from '@iglesiasbc/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const UserInvite = () => {
    const [open, setOpen] = useState(false);
    const inviteForm = useForm<z.infer<typeof PostPermissionSchema>>({
        resolver: zodResolver(PostPermissionSchema),
    });
    const client = tsr.useQueryClient();

    const handleSubmit = async (values: z.infer<typeof PostPermissionSchema>) => {
        await api2(tsr.permissions.create, values);
        client.refetchQueries({ queryKey: ['permissions'] });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <RegisterButton>Invitar usuario</RegisterButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar miembro</DialogTitle>
                </DialogHeader>

                <Form {...inviteForm}>
                    <form
                        onSubmit={inviteForm.handleSubmit((values: z.infer<typeof PostPermissionSchema>) =>
                            showPromise(handleSubmit(values), 'Usuario agregado')
                        )}
                    >
                        <FormField
                            control={inviteForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input className="w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Agregar</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UserInvite;
