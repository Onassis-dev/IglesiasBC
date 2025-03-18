import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
                <button className="rounded-xl aspect-square  border-input border flex justify-center items-center">
                    <PlusIcon strokeWidth={1} className="w-14 h-14"></PlusIcon>
                </button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[425px]">
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>Subir evento</SheetTitle>
                    </SheetHeader>

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

export default UploadEvent;
