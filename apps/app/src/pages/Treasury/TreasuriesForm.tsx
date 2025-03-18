import { api, tsr } from '@/lib/boilerplate';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { z } from 'zod';
import { DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostTreasurySchema } from '@iglesiasbc/schemas';
import { useQueryStore } from '@/lib/store';

interface Props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const TreasuriesForm = ({ open, setOpen, id }: Props) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const treasuryForm = useForm<z.infer<typeof PostTreasurySchema>>({
        resolver: zodResolver(PostTreasurySchema),
    });

    const { data: { body: item } = {} } = tsr.treasuries.getOne.useQuery({
        queryKey: ['treasuryData', id],
        enabled: !!id,
        queryData: {
            params: {
                id: String(id),
            },
        },
    });

    const handleSubmit = async (values: z.infer<typeof PostTreasurySchema>) => {
        if (id) {
            await api(tsr.treasuries.put, { ...values, id: Number(id) });
        } else {
            await api(tsr.treasuries.post, values);
        }

        client.refetchQueries({ queryKey: ['treasuries'] });
        setOpen(false);
    };

    useEffect(() => {
        if (!item) return;

        treasuryForm.setValue('name', item.name);
    }, [item]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <RegisterButton>Registrar tesorería</RegisterButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{id ? 'Actualizar tesorería' : 'Registrar nueva tesorería'}</DialogTitle>
                </DialogHeader>

                <Form {...treasuryForm}>
                    <form
                        onSubmit={treasuryForm.handleSubmit((values: z.infer<typeof PostTreasurySchema>) =>
                            showPromise(handleSubmit(values), id ? 'Información actualizada' : 'Tesorería registrada')
                        )}
                        className="flex flex-col gap-4"
                    >
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

                        <Button className="col-span-2" type="submit">
                            Registrar
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default TreasuriesForm;
