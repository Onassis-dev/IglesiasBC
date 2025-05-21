import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
import { Textarea } from '@/components/ui/textarea';

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
    }, [activity, activitiesForm]);

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
                date: values.date || '',
                id: String(activity.id),
                image: selectedFile,
            });
        } else {
            if (!selectedFile) throw new Error('No se seleccionó una imagen');

            await api(tsr.builder.uploadActivity, {
                ...values,
                date: values.date || '',
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
                    <button className="rounded-xl h-36 border-input border justify-center items-center text-muted-foreground shadow-sm flex flex-col">
                        <PlusIcon className="size-10" strokeWidth={1.7} />
                        <p>Nueva actividad</p>
                    </button>
                )}
            </SheetTrigger>
            <SheetContent submit={submit} className="sm:max-w-[425px]">
                <SheetHeader>
                    <SheetTitle>{activity ? 'Editar actividad' : 'Registrar nueva actividad'}</SheetTitle>
                </SheetHeader>
                <SheetBody>
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
                                            <Textarea placeholder="Texto" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={activitiesForm.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha y hora</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Domigos 11:00am" value={field.value || ''} onChange={field.onChange} />
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
            </SheetContent>
        </Sheet>
    );
};

export default UploadActivity;
