import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { z } from 'zod';
import { showPromise } from '@/lib/showFunctions.tsx';
import { api, tsr } from '@/lib/boilerplate';
import { format } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import DatePicker from '@/components/common/DatePicker';
import { UploadEventSchema } from '@iglesiasbc/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

const UploadEvent = () => {
    const client = tsr.useQueryClient();
    const eventsForm = useForm<z.infer<typeof UploadEventSchema>>({
        resolver: zodResolver(UploadEventSchema),
    });

    const [selectedFile, setSelectedFile]: any = useState(null);
    const [open, setOpen] = useState(false);

    const handleFile = (e: any) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async (values: z.infer<typeof UploadEventSchema>) => {
        await api(tsr.builder.uploadEvent, {
            title: values.title,
            date: format(values.date, 'yyyy-MM-dd'),
            description: values.description || '',
            image: selectedFile,
        });

        setOpen(false);
        client.refetchQueries({ queryKey: ['events'] });
        setSelectedFile(null);
    };

    const submit = eventsForm.handleSubmit((values: z.infer<typeof UploadEventSchema>) => showPromise(handleSubmit(values), 'Evento subido'));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="rounded-xl h-36 border-input border justify-center items-center text-muted-foreground shadow-sm flex flex-col col-span-2">
                    <PlusIcon className="size-10" strokeWidth={1.7} />
                    <p>Nuevo evento</p>
                </button>
            </SheetTrigger>
            <SheetContent submit={submit} className="sm:max-w-[425px]">
                <SheetHeader>
                    <SheetTitle>Subir evento</SheetTitle>
                </SheetHeader>
                <SheetBody>
                    <Form {...eventsForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={eventsForm.control}
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
                                control={eventsForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descripción"
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={eventsForm.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha</FormLabel>
                                        <FormControl>
                                            <DatePicker field={field} />
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

export default UploadEvent;
