import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { api, tsr } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { RegisterButton } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostPresentationSchema } from '@iglesiasbc/schemas';
import ColorPicker2 from '@/components/common/ColorPicker2';
import { useFormQuery } from '@/lib/hooks/useFormQuery';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
    trigger?: boolean;
}

const PresentationsForm = ({ open, setOpen, id, trigger = true }: props) => {
    const defaultValues: z.infer<typeof PostPresentationSchema> = {
        title: '',
        background: '#000000',
        text: '#FFFFFF',
    };

    const client = tsr.useQueryClient();
    const presentationForm = useForm<z.infer<typeof PostPresentationSchema>>({
        resolver: zodResolver(PostPresentationSchema),
        defaultValues: defaultValues,
    });

    const item = useFormQuery(tsr.presentations.getOne.useQuery, {
        queryKey: ['presentationsData', id],
        enabled: !!id && open,
        queryData: {
            params: { id: String(id) },
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
        if (item) {
            presentationForm.reset({ ...item });
        } else {
            presentationForm.reset(defaultValues);
        }
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
            <SheetContent onSubmit={submit}>
                <SheetHeader>
                    <SheetTitle>{id ? 'Editar presentación' : 'Crear presentación'}</SheetTitle>
                </SheetHeader>
                <SheetBody>
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
            </SheetContent>
        </Sheet>
    );
};

export default PresentationsForm;
