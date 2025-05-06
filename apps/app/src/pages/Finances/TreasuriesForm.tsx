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
import { PostTreasurySchema } from '@iglesiasbc/schemas';

interface props {
    treasury?: Record<string, any>;
    open: boolean;
    setOpen: (open: boolean) => void;
    setSelectedTreasury: (treasury: Record<string, any>) => void;
}

const defaultValues: z.infer<typeof PostTreasurySchema> = {
    name: '',
};

const TreasuriesForm = ({ treasury, open, setOpen, setSelectedTreasury }: props) => {
    const client = tsr.useQueryClient();
    const treasuryForm = useForm<z.infer<typeof PostTreasurySchema>>({
        resolver: zodResolver(PostTreasurySchema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        if (treasury?.id) {
            treasuryForm.reset({
                ...treasury,
            });
        } else {
            treasuryForm.reset(defaultValues);
        }
    }, [treasury, treasuryForm]);

    const handleSubmit = async (values: z.infer<typeof PostTreasurySchema>) => {
        if (treasury?.id) await api(tsr.treasuries.put, { ...values, id: Number(treasury.id) });
        if (!treasury?.id) await api(tsr.treasuries.post, values);

        client.invalidateQueries({ queryKey: ['treasuries'] });
        setOpen(false);
    };

    const submit = treasuryForm.handleSubmit((values: z.infer<typeof PostTreasurySchema>) =>
        showPromise(handleSubmit(values), treasury?.id ? 'Información actualizada' : 'Tesorería registrada')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton
                    onClick={() => {
                        setSelectedTreasury({});
                    }}
                >
                    Registrar tesorería
                </RegisterButton>
            </SheetTrigger>
            <SheetContent submit={submit}>
                <SheetHeader>
                    <SheetTitle>{treasury?.id ? 'Editar tesorería' : 'Registrar tesorería'}</SheetTitle>
                </SheetHeader>
                <SheetBody>
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
            </SheetContent>
        </Sheet>
    );
};

export default TreasuriesForm;
