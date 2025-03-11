import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/boilerplate';
import Event from './Event';
import UploadEvent from './UploadEvent';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const EventsForm = () => {
    const limit = 20;

    const { data: events = [] } = useQuery({
        queryKey: ['events'],
        queryFn: async () => (await api.get('/builder/events')).data,
        placeholderData: keepPreviousData,
    });

    return (
        <div>
            <Card className="max-w-full">
                <CardHeader>
                    <CardTitle>Tus eventos</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                    <div className="grid sm:grid-cols-2 gap-1 sm:gap-4">
                        {events.map((event: any, i: any) => (
                            <Event key={i} event={event} />
                        ))}

                        {events.length < limit ? <UploadEvent /> : <p>Has alcanzado el límite de eventos. Elimina uno para seguir publicando.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventsForm;
