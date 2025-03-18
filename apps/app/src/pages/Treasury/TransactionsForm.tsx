import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, tsr } from '@/lib/boilerplate';
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { formatToTZ, formatToUTC } from '@/lib/timeFunctions';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from '@/components/common/DatePicker';
import { PostTransactionSchema } from '@iglesiasbc/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
    transaction: (z.infer<typeof PostTransactionSchema> & { id?: number }) | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const TransactionsForm = ({ transaction, open, setOpen }: Props) => {
    const client = tsr.useQueryClient();
    const transactionForm = useForm<z.infer<typeof PostTransactionSchema>>({
        resolver: zodResolver(PostTransactionSchema),
    });

    const [categories, setCategories] = useState<{ name: string; isIncome: boolean; id: number }[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
    const [isIncome, setIsIncome] = useState<boolean | undefined>();

    const handleSubmit = async (values: z.infer<typeof PostTransactionSchema>) => {
        const data = { ...values, date: formatToUTC(values.date) || values.date };

        if (transaction?.id) await api(tsr.transactions.put, { ...data, id: transaction.id });
        if (!transaction?.id) await api(tsr.transactions.post, { ...data });
        client.refetchQueries({ queryKey: ['transactions'] });
        setOpen(false);
    };

    useEffect(() => {
        if (!transaction) return;

        transactionForm.reset({
            ...transaction,
            date: transaction.date ? formatToTZ(transaction.date) || '' : '',
            categoryId: transaction.categoryId?.toString(),
        });

        setIsIncome(categories.filter((v) => v.id === parseInt(transaction.categoryId))[0]?.isIncome);
    }, [transaction]);

    useEffect(() => {
        setFilteredCategories(categories.filter((v) => v.isIncome === isIncome));
        if (categories.filter((v) => v.id === parseInt(transactionForm.getValues('categoryId')))[0]?.isIncome !== isIncome) {
            transactionForm.setValue('categoryId', '');
        }
    }, [isIncome]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setCategories((await tsr.options.getCategories.query()).body as any);
    };

    const submit = transactionForm.handleSubmit((values: z.infer<typeof PostTransactionSchema>) => {
        showPromise(handleSubmit(values), transaction ? 'Información actualizada' : 'Transacción registrada');
    });

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

                    <Form {...transactionForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={transactionForm.control}
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
                                control={transactionForm.control}
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
                                control={transactionForm.control}
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
                                control={transactionForm.control}
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
                                control={transactionForm.control}
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
