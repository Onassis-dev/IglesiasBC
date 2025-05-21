import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions';
import { useQueryStore } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';

type DeleteMethodPaths = {
    [method in keyof typeof tsr]: (typeof tsr)[method] extends { delete: any } ? method : never;
}[keyof typeof tsr];

type props = {
    text: string;
    open: boolean;
    setOpen: any;
    path?: DeleteMethodPaths;
    id?: string | number;
    successMessage: string;
    func?: () => Promise<any>;
    queryKey?: string;
};

const DeleteDialog = ({ text, setOpen, open, id, successMessage, path, func, queryKey }: props) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const fetchDelete = async () => {
        if (func) {
            await func();
            client.refetchQueries({ queryKey: [queryKey] });
        } else {
            if (!path || !id) return;
            await tsr[path].delete.mutate({ params: { id: String(id) } });
            client.refetchQueries({ queryKey: [path] });
        }
    };

    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent>
                <div className="w-full flex-none flex flex-col  items-center gap-6 mb-2">
                    <AlertTriangle className="text-destructive bg-destructive-background p-3 size-20 rounded-xl" />
                    <AlertDialogDescription className="text-md text-foreground text-center">{text}</AlertDialogDescription>
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
