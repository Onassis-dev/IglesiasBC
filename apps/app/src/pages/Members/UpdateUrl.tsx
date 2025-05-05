import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions';
import { useQueryStore } from '@/lib/store';
interface UpdateUrlProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UpdateUrl = ({ open, onOpenChange }: UpdateUrlProps) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[500px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Actualizar enlace de formulario?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="space-y-4">
                            <p>Al actualizar el enlace del formulario, se generará un nuevo enlace único y el enlace anterior dejará de funcionar.</p>
                            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                                <AlertCircle className="size-4 text-amber-800" />
                                <AlertTitle>¿Por qué actualizar el enlace?</AlertTitle>
                                <AlertDescription>
                                    Actualice el enlace si sospecha que personas no autorizadas tienen acceso al enlace actual.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="mt-0">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            const result = await showPromise(tsr.forms.updateUrl.mutate(), 'Enlace actualizado');
                            client.setQueryData(['formUrl'], result);
                        }}
                    >
                        Actualizar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UpdateUrl;
