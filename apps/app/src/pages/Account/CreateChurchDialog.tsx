import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api } from '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChurchSchema, useChurchSchema } from '@/components/common/church.models';
import type { z } from 'zod';
import { saveUserData } from '@/lib/accountFunctions';
import { Button } from '@/components/ui/button';

const CreateChurchDialog = () => {
    const churchForm = useChurchSchema();
    const [open, setOpen] = useState(false);

    const createChurch = async (values: any) => {
        const userData = (await api.post('/churches', values)).data;
        saveUserData(userData);
        location.pathname = '/settings';
    };

    useEffect(() => {
        if (!open) return;
    }, [open]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                    }}
                >
                    Crear nueva iglesia
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-4xl sm:h-[24rem] max-h-screen flex flex-col h-screen">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">¿Cómo se llama tu iglesia?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Este nombre se mostrará en la página de tu iglesia y será visible para los visitantes.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...churchForm}>
                    <form
                        className="mt-4"
                        onSubmit={churchForm.handleSubmit((values: z.infer<typeof ChurchSchema>) =>
                            showPromise(createChurch(values), 'Iglesia registrada')
                        )}
                    >
                        <FormField
                            control={churchForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input className="max-w-lg" placeholder="Ingresa el nombre de tu iglesia" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <AlertDialogFooter className="mt-auto">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={churchForm.handleSubmit((values: z.infer<typeof ChurchSchema>) =>
                            showPromise(createChurch(values), 'Iglesia registrada')
                        )}
                    >
                        Registrar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CreateChurchDialog;
