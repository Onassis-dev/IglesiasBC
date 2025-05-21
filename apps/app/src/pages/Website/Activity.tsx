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
import { api, tsr } from '@/lib/boilerplate';
import UploadActivity from './UploadActivity';
import { Card } from '@/components/ui/card';
import { useQueryStore } from '@/lib/store';
import { ClockIcon } from 'lucide-react';

const Activity = ({ activity }: any) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const deleteActivity = async (id: string) => {
        await api(tsr.builder.deleteActivity, { id: Number(id) });

        client.refetchQueries({ queryKey: ['activities'] });
    };

    return (
        <Card className="flex flex-col rounded-lg w-full p-4">
            <div className="overflow-hidden rounded-lg mb-2">
                <img src={activity.img} alt="card-image" className="object-cover w-full aspect-video" />
            </div>
            <b>{activity.title}</b>
            <p className="text-sm">{activity.text}</p>

            {activity.date && (
                <p className="text-sm flex items-center gap-1.5 mt-2">
                    <ClockIcon className="size-4 text-primary" />
                    {activity.date}
                </p>
            )}

            <div className="pt-4 space-x-2">
                <UploadActivity activity={activity}></UploadActivity>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">Eliminar</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que quieres borrar esta actividad?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción no es reversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => showPromise(deleteActivity(activity.id), 'Actividad eliminada')}>
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );
};

export default Activity;
