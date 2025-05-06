import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { api, tsr } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { RegisterButton } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostInventorySchema } from '@iglesiasbc/schemas';
import { useForm } from 'react-hook-form';

interface props {
    item?: Record<string, any>;
    open: boolean;
    setOpen: (open: boolean) => void;
    setSelectedItem: (item: Record<string, any>) => void;
}

const defaultValues: z.infer<typeof PostInventorySchema> = {
    name: '',
    brand: '',
    amount: '',
    bill: '',
    model: '',
    price: '',
    serie: '',
    observations: '',
};

const InventoryForm = ({ item, open, setOpen, setSelectedItem }: props) => {
    const client = tsr.useQueryClient();
    const itemForm = useForm<z.infer<typeof PostInventorySchema>>({
        resolver: zodResolver(PostInventorySchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = async (values: z.infer<typeof PostInventorySchema>) => {
        if (item?.id) await api(tsr.inventory.put, { ...values, id: Number(item.id) });
        else await api(tsr.inventory.post, values);

        client.invalidateQueries({ queryKey: ['inventory'] });
        setOpen(false);
    };

    useEffect(() => {
        if (item) {
            itemForm.reset({ ...item });
        } else {
            itemForm.reset(defaultValues);
        }
    }, [item, itemForm]);

    const submit = itemForm.handleSubmit((values: z.infer<typeof PostInventorySchema>) =>
        showPromise(handleSubmit(values), item?.id ? 'Información actualizada' : 'Artículo registrado')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton
                    onClick={() => {
                        setSelectedItem({});
                    }}
                >
                    Registrar articulo
                </RegisterButton>
            </SheetTrigger>
            <SheetContent submit={submit}>
                <SheetHeader>
                    <SheetTitle>{item?.id ? 'Editar articulo' : 'Registrar articulo'}</SheetTitle>
                </SheetHeader>
                <SheetBody>
                    <Form {...itemForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={itemForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={itemForm.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Marca" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={itemForm.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cantidad" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={itemForm.control}
                                name="bill"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Factura</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Factura" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={itemForm.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modelo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Modelo" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={itemForm.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Precio" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={itemForm.control}
                                name="serie"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serie</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Serie" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={itemForm.control}
                                name="observations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observaciones</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Observaciones" value={field.value || ''} onChange={field.onChange} />
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

export default InventoryForm;
