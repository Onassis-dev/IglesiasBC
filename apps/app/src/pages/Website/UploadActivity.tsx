import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { z } from 'zod';
import { showPromise } from '@/lib/showFunctions.tsx';
import { api, tsr } from '@/lib/boilerplate';
import { PlusIcon } from 'lucide-react';
import { PostActivitySchema } from '@iglesiasbc/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const UploadActivity = ({ activity }: any) => {
    const client = tsr.useQueryClient();
    const activitiesForm = useForm<z.infer<typeof PostActivitySchema>>({
        resolver: zodResolver(PostActivitySchema),
    });

    const [selectedFile, setSelectedFile]: any = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!activity) return;
        activitiesForm.reset({ ...activity });
    }, [activity]);

    const handleFile = (e: any) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async (values: z.infer<typeof PostActivitySchema>) => {
        if (activity) {
            await api(tsr.builder.editActivity, {
                ...values,
                id: String(activity.id),
                image: selectedFile,
            });
        } else {
            if (!selectedFile) throw new Error('No se seleccionó una imagen');

            await api(tsr.builder.uploadActivity, {
                ...values,
                image: selectedFile,
            });
        }

        setOpen(false);
        client.refetchQueries({ queryKey: ['activities'] });
        setSelectedFile(null);
    };

    const submit = activitiesForm.handleSubmit((values: z.infer<typeof PostActivitySchema>) =>
        showPromise(handleSubmit(values), activity ? 'Información actualizada' : 'Actividad registrada')
    );

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
                                    <Input type="file" accept="image/*" id="username" onChange={(e) => handleFile(e)} />
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
