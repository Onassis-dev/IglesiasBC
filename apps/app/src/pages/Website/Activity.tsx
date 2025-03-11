import { Button } from '@/components/ui/button';
import { showPromise } from '@/lib/showFunctions.tsx';
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
import { api } from '@/lib/boilerplate';
import UploadActivity from './UploadActivity';
import { Card } from '@/components/ui/card';
import { useQueryStore } from '@/lib/store';

const Activity = ({ activity }: any) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const deleteEvents = async (id: string) => {
        await api.delete('/builder/activity', {
            data: { id: id },
        });
        client.refetchQueries({ queryKey: ['activities'] });
    };

    return (
        <Card className="flex flex-col rounded-lg w-full p-4">
            <div className="overflow-hidden rounded-lg mb-2">
                <img src={activity.img} alt="card-image" className="object-cover w-full" />
            </div>
            <b>{activity.title}</b>
            <p className="text-sm">{activity.text}</p>

            <div className="pt-4 space-x-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button>Eliminar</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que quieres borrar esta actividad?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción no es reversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => showPromise(deleteEvents(activity.id), 'Actividad eliminada')}>
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <UploadActivity activity={activity}></UploadActivity>
            </div>
        </Card>
    );
};

export default Activity;
