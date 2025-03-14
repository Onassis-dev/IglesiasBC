import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tsr } from '@/lib/boilerplate';
import UploadActivity from './UploadActivity';
import Activity from './Activity';

const ActivitiesForm = () => {
    const limit = 8;

    const { data: { body: activities = [] } = {} } = tsr.builder.getActivities.useQuery({
        queryKey: ['activities'],
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
