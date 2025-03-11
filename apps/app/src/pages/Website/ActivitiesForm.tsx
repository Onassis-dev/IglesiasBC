import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/boilerplate';
import UploadActivity from './UploadActivity';
import Activity from './Activity';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const ActivitiesForm = () => {
    const limit = 8;

    const { data: activities = [] } = useQuery({
        queryKey: ['activities'],
        queryFn: async () => (await api.get('/builder/activities')).data,
        placeholderData: keepPreviousData,
    });

    return (
        <div>
            <Card className="max-w-full">
                <CardHeader>
                    <CardTitle>Tus actividades</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                    <div className="grid grid-cols-1 gap-1 sm:gap-4">
                        {activities.map((activity: any) => (
                            <Activity key={activity.id} activity={activity} />
                        ))}

                        {activities.length < limit ? <UploadActivity /> : <p>Has alcanzado el límite de actividades</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActivitiesForm;
