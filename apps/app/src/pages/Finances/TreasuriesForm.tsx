import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { api } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { useTreasurySchema, type TreasurySchema } from './finances.models';
import { useQuery } from '@tanstack/react-query';
import { useQueryStore } from '@/lib/store';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const TreasuriesForm = ({ open, setOpen, id }: props) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const treasuryForm = useTreasurySchema();

    const { data: item } = useQuery({
        queryKey: ['treasuryData', id],
        queryFn: async () => (await api.get(`/treasuries/${id}`)).data,
        initialData: {},
        enabled: !!id,
    });

    const handleSubmit = async (values: z.infer<typeof TreasurySchema>) => {
        if (id) {
            await api.put('/treasuries', values);
        } else {
            await api.post('/treasuries', values);
        }

        client.refetchQueries({ queryKey: ['treasuries'] });
        setOpen(false);
    };

    useEffect(() => {
        if (item) {
            treasuryForm.setValue('id', item.id);
            treasuryForm.setValue('name', item.name);
        }
    }, [item]);

    const submit = treasuryForm.handleSubmit((values: z.infer<typeof TreasurySchema>) =>
        showPromise(handleSubmit(values), id ? 'Información actualizada' : 'Tesorería registrada')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Registrar tesorería</RegisterButton>
            </SheetTrigger>
            <SheetContent >
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
