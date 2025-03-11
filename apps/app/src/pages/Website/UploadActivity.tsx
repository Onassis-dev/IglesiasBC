import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { z } from 'zod';
import { showPromise } from '@/lib/showFunctions.tsx';
import { api } from '@/lib/boilerplate';
import { PlusIcon } from 'lucide-react';
import { useActivitySchema, type ActivitySchema } from './websites.models';
import { useQueryStore } from '@/lib/store';

const UploadActivity = ({ activity }: any) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const activitiesForm = useActivitySchema();

    const [selectedFile, setSelectedFile]: any = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (activity) {
            activitiesForm.setValue('title', activity.title);
            activitiesForm.setValue('text', activity.text);
        }
    }, []);

    const handleFile = (e: any) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async (values: z.infer<typeof ActivitySchema>) => {
        const formData = new FormData();
        if (activity) {
            formData.append('image', selectedFile);
            await api.put(`/builder/activity?title=${values.title}&text=${values.text}&id=${activity.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setOpen(false);
            client.refetchQueries({ queryKey: ['activities'] });
            setSelectedFile(null);
        } else {
            if (!selectedFile) throw new Error('No se seleccionó una imagen');
            formData.append('image', selectedFile);

            await api.post(`/builder/activity`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: values,
            });

            setOpen(false);
            client.refetchQueries({ queryKey: ['activities'] });
            setSelectedFile(null);
        }
    };

    const submit = activitiesForm.handleSubmit((values: z.infer<typeof ActivitySchema>) => showPromise(handleSubmit(values), activity ? 'Información actualizada' : 'Actividad registrada'));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {activity ? (
                    <Button>Editar</Button>
                ) : (
                    <button className="rounded-xl aspect-square max-w-60 max-h-max-w-60 border-input border flex justify-center items-center">
                        <PlusIcon className="w-14 h-14"></PlusIcon>
                    </button>
                )}
            </SheetTrigger>
            <SheetContent className="sm:max-w-[425px]">
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>{activity ? 'Actualizar actividad' : 'Registrar nueva actividad'}</SheetTitle>
                    </SheetHeader>

                    <Form {...activitiesForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={activitiesForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Título" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={activitiesForm.control}
                                name="text"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Texto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Texto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Imagen</FormLabel>
                                <FormControl>
                                    <Input type="file" accept='image/*' id="username" onChange={(e) => handleFile(e)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
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

export default UploadActivity;
