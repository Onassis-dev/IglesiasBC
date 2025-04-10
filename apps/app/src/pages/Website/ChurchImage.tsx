import { api, tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { XIcon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface props {
    url: string;
    fetchData: () => void;
}

const ChurchImage = ({ url, fetchData }: props) => {
    const deleteImage = async (url: string) => {
        await api(tsr.builder.deleteChurchImage, { imageUrl: url });

        fetchData();
    };

    return (
        <div className="relative">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="rounded-lg aspect-square p-1 absolute top-1 right-1">
                        <XIcon />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que quieres borrar esta imagen?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no es reversible.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => showPromise(deleteImage(url), 'Imagen eliminada')}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <img src={url} alt="" className="object-cover aspect-square w-full rounded-lg" />
        </div>
    );
};

export default ChurchImage;
