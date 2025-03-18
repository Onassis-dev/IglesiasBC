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
import { PostTreasurySchema } from '@iglesiasbc/schemas';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const TreasuriesForm = ({ open, setOpen, id }: props) => {
    const client = tsr.useQueryClient();
    const treasuryForm = useForm<z.infer<typeof PostTreasurySchema>>({
        resolver: zodResolver(PostTreasurySchema),
    });

    const { data: { body: item } = {} } = tsr.treasuries.getOne.useQuery({
        queryKey: ['treasuryData', id],
        enabled: !!id && open,
        queryData: {
            params: {
                id: String(id),
            },
        },
    });

    const handleSubmit = async (values: z.infer<typeof PostTreasurySchema>) => {
        if (id) await api(tsr.treasuries.put, { ...values, id: Number(id) });
        if (!id) await api(tsr.treasuries.post, values);

        client.invalidateQueries({ queryKey: ['treasuries'] });
        setOpen(false);
    };

    useEffect(() => {
        if (!item) return;
        treasuryForm.reset({ ...item });
    }, [item]);

    const submit = treasuryForm.handleSubmit((values: z.infer<typeof PostTreasurySchema>) =>
        showPromise(handleSubmit(values), id ? 'Información actualizada' : 'Tesorería registrada')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Registrar tesorería</RegisterButton>
            </SheetTrigger>
            <SheetContent>
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>{id ? 'Actualizar tesorería' : 'Registrar nueva tesorería'}</SheetTitle>
                    </SheetHeader>

                    <Form {...treasuryForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={treasuryForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre" {...field} />
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

export default TreasuriesForm;
