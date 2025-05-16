import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group-card';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, tsr } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState, useEffect } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { RegisterButton } from '@/components/ui/button';
import { PostCertificateSchema } from '@iglesiasbc/schemas';
import DatePicker from '@/components/common/DatePicker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatToUTC } from '@/lib/timeFunctions';
import Autocomplete from '@/components/ui/autocomplete';
import { Checkbox } from '@/components/ui/checkbox';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const defaultValues: z.infer<typeof PostCertificateSchema> = {
    certificateTypeId: '',
    expeditionDate: '',
    member: '',
    member2: '',
    pastor: '',
    pastor2: '',
    design: '',
    validate: false,
};

const CertificatesForm = ({ open, setOpen }: props) => {
    const client = tsr.useQueryClient();
    const certificatesForm = useForm<z.infer<typeof PostCertificateSchema>>({
        resolver: zodResolver(PostCertificateSchema),
        defaultValues: defaultValues,
    });

    const [certificateId, setCertificateId] = useState('');

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);

    useEffect(() => {
        if (!open) {
            certificatesForm.reset(defaultValues);
            setCertificateId('');
        }
    }, [open, certificatesForm]);

    const handleSubmit = async (values: z.infer<typeof PostCertificateSchema>) => {
        const result = await api(tsr.certificates.create, {
            ...values,
            expeditionDate: formatToUTC(values.expeditionDate) || values.expeditionDate,
        });
        client.invalidateQueries({ queryKey: ['certificates'] });
        setOpen(false);

        const pdfBlob = new Blob([result as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
    };

    const { data: { body: certificates } = {} } = tsr.options.getCertificateTypes.useQuery({
        queryKey: ['certificatesOptions'],
    });

    const { data: { body: members } = {} } = tsr.certificates.getMembers.useQuery({
        queryKey: ['membersOptions'],
    });

    const submit = certificatesForm.handleSubmit((values: z.infer<typeof PostCertificateSchema>) =>
        showPromise(handleSubmit(values), 'Certificado creado')
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Crear certificado</RegisterButton>
            </SheetTrigger>
            <SheetContent submit={submit}>
                <SheetHeader>
                    <SheetTitle>Crear certificado</SheetTitle>
                </SheetHeader>
                <SheetBody>
                    <Form {...certificatesForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={certificatesForm.control}
                                name="certificateTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de certificado</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={(v) => {
                                                    field.onChange(v);
                                                    setCertificateId(v);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Elige una opción" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(certificates || []).map((v: any) => (
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
                                control={certificatesForm.control}
                                name="expeditionDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de expedición</FormLabel>
                                        <FormControl>
                                            <DatePicker field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={certificatesForm.control}
                                name="member"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Miembro</FormLabel>
                                        <FormControl>
                                            <Autocomplete
                                                open={open1}
                                                setOpen={setOpen1}
                                                rows={members || []}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Elige un miembro"
                                                identifier="member"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {certificateId === '4' && (
                                <FormField
                                    control={certificatesForm.control}
                                    name="member2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Segundo miembro</FormLabel>
                                            <FormControl>
                                                <Autocomplete
                                                    open={open2}
                                                    setOpen={setOpen2}
                                                    rows={members || []}
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                    placeholder="Elige un miembro"
                                                    identifier="member2"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={certificatesForm.control}
                                name="pastor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Oficiante</FormLabel>
                                        <FormControl>
                                            <Autocomplete
                                                open={open3}
                                                setOpen={setOpen3}
                                                rows={members || []}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Elige un oficiante"
                                                identifier="pastor"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={certificatesForm.control}
                                name="pastor2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Segundo oficiante</FormLabel>
                                        <FormControl>
                                            <Autocomplete
                                                open={open4}
                                                setOpen={setOpen4}
                                                rows={members || []}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="Elige un oficiante"
                                                identifier="pastor2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={certificatesForm.control}
                                name="validate"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="flex flex-col">
                                                <FormLabel>Validar certificado</FormLabel>
                                                <p className="text-sm text-muted-foreground">Añade un código QR de verificación</p>
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={certificatesForm.control}
                                name="design"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diseño</FormLabel>
                                        <FormControl {...field} className="grid grid-cols-2 gap-2">
                                            <RadioGroup onValueChange={field.onChange} defaultValue={'1'}>
                                                <RadioGroupItem value="1" className="w-full aspect-[11/8.5] rounded-sm border">
                                                    <img src="/certificates/1.webp" alt="Diseño 1" loading="lazy" />
                                                </RadioGroupItem>
                                                <RadioGroupItem value="2" className="w-full aspect-[11/8.5] rounded-sm border">
                                                    <img src="/certificates/2.webp" alt="Diseño 2" loading="lazy" />
                                                </RadioGroupItem>
                                                <RadioGroupItem value="3" className="w-full aspect-[11/8.5] rounded-sm border">
                                                    <img src="/certificates/3.webp" alt="Diseño 3" loading="lazy" />
                                                </RadioGroupItem>
                                                <RadioGroupItem value="4" className="w-full aspect-[11/8.5] rounded-sm border">
                                                    <img src="/certificates/4.webp" alt="Diseño 4" loading="lazy" />
                                                </RadioGroupItem>
                                                <RadioGroupItem value="5" className="w-full aspect-[11/8.5] rounded-sm border">
                                                    <img src="/certificates/5.webp" alt="Diseño 5" loading="lazy" />
                                                </RadioGroupItem>
                                            </RadioGroup>
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

export default CertificatesForm;
