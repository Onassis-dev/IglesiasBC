import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/boilerplate';
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { formatToTZ, formatToUTC } from '@/lib/timeFunctions';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { TransactionSchema, useTransactionSchema } from '../Finances/finances.models';
import DatePicker from '@/components/common/DatePicker';
import { useQueryStore } from '@/lib/store';

interface Props {
    transaction: z.infer<typeof TransactionSchema> | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const TransactionsForm = ({ transaction, open, setOpen }: Props) => {
    const transactionsForm = useTransactionSchema();
    const [categories, setCategories] = useState<{ name: string; isIncome: boolean; id: number }[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
    const [isIncome, setIsIncome] = useState<boolean | undefined>();
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const handleSubmit = async (values: z.infer<typeof TransactionSchema>) => {
        values.date = values.id ? formatToUTC(values.date) || values.date : values.date;
        console.log(transaction);
        if (transaction?.id) {
            await api.put('/transactions', { ...values, categoryId: parseFloat(values.categoryId) });
        } else {
            const queryParams = new URLSearchParams(window.location.search);
            const id = queryParams.get('id');
            await api.post('/transactions', { ...values, categoryId: parseFloat(values.categoryId), treasuryId: parseInt(id || '') });
        }
        client.refetchQueries({ queryKey: ['transactions'] });
        setOpen(false);
    };

    useEffect(() => {
        if (transaction) {
            transactionsForm.setValue('date', transaction.date ? formatToTZ(transaction.date) || '' : '');
            transactionsForm.setValue('notes', transaction.notes);
            transactionsForm.setValue('amount', transaction.amount);
            transactionsForm.setValue('concept', transaction.concept);
            transactionsForm.setValue('categoryId', transaction.categoryId?.toString());
            transactionsForm.setValue('id', transaction.id);
            setIsIncome(categories.filter((v) => v.id === parseInt(transaction.categoryId))[0]?.isIncome);
        }
    }, [transaction]);

    useEffect(() => {
        setFilteredCategories(categories.filter((v) => v.isIncome === isIncome));
        if (categories.filter((v) => v.id === parseInt(transactionsForm.getValues('categoryId')))[0]?.isIncome !== isIncome) {
            transactionsForm.setValue('categoryId', '');
        }
    }, [isIncome]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setCategories((await api.get('/options/categories')).data);
    };

    const submit = transactionsForm.handleSubmit((values: z.infer<typeof TransactionSchema>) =>
        showPromise(handleSubmit(values), transaction ? 'Información actualizada' : 'Transacción registrada')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Registrar transacción</RegisterButton>
            </SheetTrigger>
            <SheetContent>
                <SheetBody>
                    <SheetHeader>
                        <SheetTitle>{transaction ? 'Actualizar transacción' : 'Registrar nueva transacción'}</SheetTitle>
                    </SheetHeader>

                    <Form {...transactionsForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={transactionsForm.control}
                                name="concept"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Concepto</FormLabel>
                                        <FormControl>
                                            <Input value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <FormControl>
                                    <Select value={isIncome?.toString()} onValueChange={(v) => setIsIncome(v === 'true')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Ingreso</SelectItem>
                                            <SelectItem value="false">Egreso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <FormField
                                control={transactionsForm.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(filteredCategories || []).map((v) => (
                                                        <SelectItem key={v.id} value={v.id?.toString()}>
                                                            {v.value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={transactionsForm.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad</FormLabel>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={transactionsForm.control}
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
                            <FormField
                                control={transactionsForm.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notas</FormLabel>
                                        <FormControl>
                                            <Textarea value={field.value || ''} onChange={field.onChange} className="resize-none" />
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

export default TransactionsForm;
