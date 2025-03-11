import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { api } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { useItemSchema, type ItemSchema } from './inventory.models';
import { useQuery } from '@tanstack/react-query';
import { useQueryStore } from '@/lib/store';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const InventoryForm = ({ id, open, setOpen }: props) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const itemForm = useItemSchema();

    const { data: item } = useQuery({
        queryKey: ['item', id],
        queryFn: async () => (await api.get(`/inventory/${id}`)).data,
        initialData: {},
        enabled: !!id,
    });

    const handleSubmit = async (values: z.infer<typeof ItemSchema>) => {
        if (id) {
            await api.put('/inventory', values);
        } else {
            await api.post('/inventory', values);
        }

        client.refetchQueries({ queryKey: ['inventory'] });
        setOpen(false);
    };

    useEffect(() => {
        if (item) {
            itemForm.setValue('id', item.id);
            itemForm.setValue('name', item.name);
            itemForm.setValue('amount', item.amount);
            itemForm.setValue('price', item.price);
            itemForm.setValue('bill', item.bill);
            itemForm.setValue('brand', item.brand);
            itemForm.setValue('model', item.model);
            itemForm.setValue('serie', item.serie);
            itemForm.setValue('observations', item.observations);
        }
    }, [item]);

    const submit = itemForm.handleSubmit((values: z.infer<typeof ItemSchema>) =>
        showPromise(handleSubmit(values), id ? 'Información actualizada' : 'Artículo registrado')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Registrar articulo</RegisterButton>
            </SheetTrigger>
            <SheetContent>
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>{id ? 'Actualizar articulo' : 'Registrar articulo'}</SheetTitle>
                    </SheetHeader>

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

export default InventoryForm;
