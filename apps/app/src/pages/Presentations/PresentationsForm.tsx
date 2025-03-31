import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { api, tsr } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostPresentationSchema } from '@iglesiasbc/schemas';
import ColorPicker2 from '@/components/common/ColorPicker2';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
    trigger?: boolean;
}

const PresentationsForm = ({ open, setOpen, id, trigger = true }: props) => {
    const client = tsr.useQueryClient();
    const presentationForm = useForm<z.infer<typeof PostPresentationSchema>>({
        resolver: zodResolver(PostPresentationSchema),
        defaultValues: {
            background: '#000000',
            text: '#FFFFFF',
        },
    });

    const { data: { body: item } = {} } = tsr.presentations.getOne.useQuery({
        queryKey: ['presentationsData', id],
        enabled: !!id && open,
        queryData: {
            params: {
                id: String(id),
            },
        },
    });

    const handleSubmit = async (values: z.infer<typeof PostPresentationSchema>) => {
        if (id) {
            await api(tsr.presentations.put, { ...values, id: Number(id) });
            client.invalidateQueries({ queryKey: ['presentations'] });
            client.refetchQueries({ queryKey: ['slides', String(id)] });
        } else {
            await api(tsr.presentations.post, values);
            client.invalidateQueries({ queryKey: ['presentations'] });
        }

        setOpen(false);
    };

    useEffect(() => {
        if (!item) return;
        presentationForm.reset({ ...item });
    }, [item]);

    const submit = presentationForm.handleSubmit((values: z.infer<typeof PostPresentationSchema>) =>
        showPromise(handleSubmit(values), id ? 'Presentación actualizada' : 'Presentación creada')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && (
                <SheetTrigger asChild>
                    <RegisterButton>Crear presentación</RegisterButton>
                </SheetTrigger>
            )}
            <SheetContent>
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>{id ? 'Actualizar presentación' : 'Crear presentación'}</SheetTitle>
                    </SheetHeader>

                    <Form {...presentationForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={presentationForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titulo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Titulo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={presentationForm.control}
                                name="background"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fondo</FormLabel>
                                        <FormControl>
                                            <ColorPicker2 {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={presentationForm.control}
                                name="text"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Texto</FormLabel>
                                        <FormControl>
                                            <ColorPicker2 {...field} />
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

export default PresentationsForm;
