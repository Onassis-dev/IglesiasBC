import { Button } from '@/components/ui/button';
import { api, tsr } from '@/lib/boilerplate';
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
import { Card } from '@/components/ui/card';
import { useQueryStore } from '@/lib/store';
import { displayDate } from '@/lib/timeFunctions';

const Event = ({ event }: any) => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const deleteEvents = async (id: string) => {
        await api(tsr.builder.deleteEvent, { eventId: Number(id) });
        client.refetchQueries({ queryKey: ['events'] });
    };

    return (
        <Card className="flex flex-col rounded-lg w-full p-4">
            <div className="overflow-hidden rounded-lg">{event.img && <img src={event.img} alt="card-image" className="object-cover w-full" />}</div>
            <b>{event.title}</b>
            <p>{displayDate(event.date, 'PPP')}</p>

            <div className="mt-3 flex justify-between items-center">
                <AlertDialog>
                    <AlertDialogTrigger className="mx-0" asChild>
                        <Button>Eliminar</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que quieres borrar este evento?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción no es reversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => showPromise(deleteEvents(event.id), 'Evento eliminado')}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* <Share event={event}></Share> */}
            </div>
        </Card>
    );
};

export default Event;
