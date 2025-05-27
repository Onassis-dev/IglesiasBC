import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group-card';
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
import { IconInput, Input } from '@/components/ui/input';
import { ChurchSchema, SelectChurchSchema, useChurchSchema, useSelectChurchSchema } from '@/components/common/church.models';
import type { z } from 'zod';
import { LogIn, ChurchIcon, RefreshCcw, Share2, Mail, Plus } from 'lucide-react';
import { saveUserData } from '@/lib/accountFunctions';
import { Button } from '../ui/button';
import { useUIStore, useUserStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Share from './Share';

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

    const { data: { body: data } = {}, isFetching } = tsr.users.get.useQuery({
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
                <AlertDialogContent
                    className={cn(
                        'max-w-2xl h-[100dvh] flex flex-col overflow-y-auto pb-1 sm:pb-6 sm:h-[22rem] sm:overflow-hidden',
                        isJoiningChurch && 'sm:h-[30rem]',
                        isCreatingChurch && 'sm:h-64'
                    )}
                >
                    {!isCreatingChurch && !isJoiningChurch && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-3xl font-bold">
                                    ¡Te damos la bienvenida! {localStorage.getItem('username')}
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
                                    <Plus className="size-10" strokeWidth={1.4} />
                                    Registrar nueva iglesia
                                </Button>
                                <Button
                                    className="aspect-video h-40 font-semibold text-md flex flex-col gap-4 w-full sm:w-auto"
                                    variant={'outline'}
                                    onClick={() => setIsJoiningChurch(true)}
                                >
                                    <LogIn className="size-10" strokeWidth={1.4} />
                                    Unirse a una Iglesia
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
                            <AlertDialogFooter className="mt-auto mb-4 sm:mb-0">
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
                                    Comparte tu correo electrónico con tu pastor para que te registre en tu iglesia y luego selecciona la iglesia que
                                    a la que quieres unirte.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="flex items-center justify-between gap-2">
                                <IconInput readOnly value={user?.email || ''} className="w-full !ring-0">
                                    <Mail className="size-4" />
                                </IconInput>
                                <Share url={user?.email || ''} title="Mi correo electrónico">
                                    <Button size="sm" className="gap-1.5">
                                        <Share2 className="size-4" />
                                        Compartir
                                    </Button>
                                </Share>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">Iglesias disponibles:</span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        client.refetchQueries({ queryKey: ['start'] });
                                    }}
                                    disabled={isFetching}
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 flex"
                                >
                                    <RefreshCcw className={cn('size-4', isFetching && 'animate-spin')} />
                                    Actualizar
                                </Button>
                            </div>

                            <Form {...selectChurchForm}>
                                <FormField
                                    control={selectChurchForm.control}
                                    name="churchId"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex-1 overflow-auto p-[1px]">
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} value={field.value}>
                                                    {!data?.churches?.length && (
                                                        <div className="w-full font-medium text-center rounded-lg border aspect-auto p-2 h-16 items-center flex justify-center">
                                                            No tienes ninguna iglesia disponible
                                                        </div>
                                                    )}
                                                    {data?.churches?.map((church: any) => (
                                                        <RadioGroupItem
                                                            value={String(church.id)}
                                                            className="w-full rounded-lg border aspect-auto p-2 text-left grid grid-cols-[auto_1fr] items-center gap-2"
                                                        >
                                                            <ChurchIcon className="size-8 p-1.5 bg-gray-background rounded-md" />
                                                            <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {church.name}
                                                            </span>
                                                        </RadioGroupItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </Form>
                            <AlertDialogFooter className="mt-auto mb-4 sm:mb-0">
                                <AlertDialogAction variant={'outline'} onClick={() => setIsJoiningChurch(false)}>
                                    Volver
                                </AlertDialogAction>
                                <AlertDialogAction
                                    onClick={selectChurchForm.handleSubmit((values: z.infer<typeof SelectChurchSchema>) =>
                                        showPromise(selectChurch(values), 'Iglesia seleccionada')
                                    )}
                                    disabled={!selectChurchForm.getValues('churchId')}
                                >
                                    Continuar {selectChurchForm.getValues('churchId') ? '' : ''}
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
