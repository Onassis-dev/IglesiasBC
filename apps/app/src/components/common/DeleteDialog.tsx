import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { api } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions';
import { useQueryStore } from '@/lib/store';

import { AlertTriangle } from 'lucide-react';

interface props {
    text: string;
    onClick?: () => any;
    open: boolean;
    setOpen: any;
    path: string;
    id: string | number;
    successMessage: string;
}

const DeleteDialog = ({ text, setOpen, open, path, id, successMessage }: props) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const fetchDelete = async () => {
        await api.delete(`/${path}/${id}`);

        client.refetchQueries({ queryKey: [path] });
    };

    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent>
                <div className="w-full flex-none flex flex-col  items-center gap-6 mb-2">
                    <AlertTriangle className="text-destructive bg-destructive-background p-3 size-20 rounded-xl" />
                    <AlertDialogDescription className="text-md text-foreground">{text}</AlertDialogDescription>
                </div>
                <AlertDialogFooter className="sm:justify-center sm:gap-4 sm:space-x-0">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => showPromise(fetchDelete(), successMessage)}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;
