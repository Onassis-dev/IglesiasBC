import { api, tsr } from '@/lib/boilerplate';
import { Modal, ModalContent, ModalTitle, ModalTrigger } from '@/components/ui/auto-modal';
import type { z } from 'zod';
import { ModalHeader } from '@/components/ui/auto-modal';
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
        await api(tsr.permissions.create, values);
        client.refetchQueries({ queryKey: ['permissions'] });
        setOpen(false);
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
                <RegisterButton>Invitar usuario</RegisterButton>
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Agregar miembro</ModalTitle>
                </ModalHeader>

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
            </ModalContent>
        </Modal>
    );
};

export default UserInvite;
