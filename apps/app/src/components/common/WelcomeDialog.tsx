import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api, tsr } from '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChurchSchema, SelectChurchSchema, useChurchSchema, useSelectChurchSchema } from '@/components/common/church.models';
import type { z } from 'zod';
import { CirclePlus, Copy, LogIn, RotateCcw } from 'lucide-react';
import { saveUserData } from '@/lib/accountFunctions';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useUIStore, useUserStore } from '@/lib/store';

const WelcomeDialog = () => {
    const [show, setShow] = useState(false);
    const [isCreatingChurch, setIsCreatingChurch] = useState(false);
    const [isJoiningChurch, setIsJoiningChurch] = useState(false);
    const churchForm = useChurchSchema();
    const selectChurchForm = useSelectChurchSchema();
    const client = tsr.useQueryClient();
    const user = useUserStore((state) => state.user);
    const { registerOpen: open } = useUIStore((state) => state);

    const createChurch = async (values: any) => {
        const userData: any = await api(tsr.churches.create, values);
        saveUserData(userData);
        location.pathname = '/settings';
    };

    const selectChurch = async (values: any) => {
        if (!values.churchId) throw new Error('No haz seleccionado una iglesia');
        const userData: any = await api(tsr.users.selectChurch, { ...values, churchId: values.churchId });
        saveUserData(userData);
        location.pathname = '/';
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(user?.email || '');
    };

    const { data: { body: data } = {} } = tsr.users.get.useQuery({
        queryKey: ['start'],
        enabled: open,
    });

    useEffect(() => {
        if (!data) return;
        if (!data?.user?.churchId) return setShow(true);
    }, [data]);

    useEffect(() => {
        if (open) setShow(true);
    }, [open]);

    return (
        <>
            <AlertDialog open={show}>
                <AlertDialogContent className="max-w-4xl h-[100dvh] sm:h-[24rem] flex flex-col overflow-y-auto pb-1 sm:pb-6 ">
                    {!isCreatingChurch && !isJoiningChurch && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-3xl font-bold">
                                    Te damos la bienvenida {localStorage.getItem('username')}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center">
                                    Antes de empezar, deberas ser parte de una iglesia.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex flex-col  justify-center sm:flex-row gap-4 w-full pt-4 max-w-full sm:mt-auto mb-10">
                                <Button
                                    className="aspect-video h-40 font-semibold text-md flex flex-col gap-4 w-full sm:w-auto"
                                    variant={'outline'}
                                    onClick={() => setIsCreatingChurch(true)}
                                >
                                    <CirclePlus className="size-8" />
                                    Registrar mi iglesia
                                </Button>
                                <Button
                                    className="aspect-video h-40 font-semibold text-md flex flex-col gap-4 w-full sm:w-auto"
                                    variant={'outline'}
                                    onClick={() => setIsJoiningChurch(true)}
                                >
                                    <LogIn className="size-8" />
                                    Unirme a una Iglesia existente
                                </Button>
                            </div>
                        </>
                    )}

                    {isCreatingChurch && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-bold">Como se llama tu iglesia?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Este nombre se mostrará en la página de tu iglesia y sera visible para los visitantes.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Form {...churchForm}>
                                <form
                                    className="mt-4"
                                    onSubmit={churchForm.handleSubmit((values: z.infer<typeof ChurchSchema>) =>
                                        showPromise(createChurch(values), 'Iglesia registrada')
                                    )}
                                >
                                    <FormField
                                        control={churchForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="max-w-lg" placeholder="Ingresa el nombre de tu iglesia" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                            <AlertDialogFooter className="mt-auto">
                                <AlertDialogAction variant={'outline'} onClick={() => setIsCreatingChurch(false)}>
                                    Volver
                                </AlertDialogAction>
                                <AlertDialogAction
                                    onClick={churchForm.handleSubmit((values: z.infer<typeof ChurchSchema>) =>
                                        showPromise(createChurch(values), 'Iglesia registrada')
                                    )}
                                >
                                    Registrar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    )}

                    {isJoiningChurch && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-bold">Unete a tu iglesia</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Envia tu correo electrónico{' '}
                                    <span
                                        onClick={() => showPromise(copyLink(), 'Correo copiado')}
                                        className="cursor-pointer bg-gray-background rounded-sm px-1"
                                    >
                                        <Copy className="inline-block size-3.5" /> {''}
                                        {user?.email || ''}
                                    </span>{' '}
                                    {''}a tu pastor para que te registre en tu iglesia y luego selecciona la iglesia que quieres unirte.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Form {...selectChurchForm}>
                                <form className="mt-4">
                                    <div className="flex gap-2">
                                        <FormField
                                            control={selectChurchForm.control}
                                            name="churchId"
                                            render={({ field }) => (
                                                <FormItem className="w-full max-w-lg">
                                                    <FormControl>
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        placeholder={
                                                                            data?.churches?.length > 0
                                                                                ? 'Selecciona una iglesia'
                                                                                : 'No tienes ninguna iglesia disponible'
                                                                        }
                                                                    />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {data?.churches?.map((church: any, i: number) => (
                                                                    <SelectItem key={i} value={church.id.toString()}>
                                                                        {church.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                client.invalidateQueries({ queryKey: ['start'] });
                                            }}
                                            variant={'ghost'}
                                            size={'sm'}
                                            className="inline-flex"
                                        >
                                            <RotateCcw className="size-4" />
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                            <AlertDialogFooter className="mt-auto">
                                <AlertDialogAction variant={'outline'} onClick={() => setIsJoiningChurch(false)}>
                                    Volver
                                </AlertDialogAction>
                                <AlertDialogAction
                                    onClick={selectChurchForm.handleSubmit((values: z.infer<typeof SelectChurchSchema>) =>
                                        showPromise(selectChurch(values), 'Iglesia seleccionada')
                                    )}
                                >
                                    Continuar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default WelcomeDialog;
