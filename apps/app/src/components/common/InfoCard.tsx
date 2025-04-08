import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface props {
    title: string;
    data?: string | number;
    children: React.ReactNode;
    color: string;
    href?: string;
}

const InfoCard = ({ title, data, children, color, href }: props) => {
    const colors: any = {
        purple: 'p-3 rounded-xl size-12 bg-purple-background text-purple',
        cyan: 'p-3 rounded-xl size-12 bg-cyan-background text-cyan',
        orange: 'p-3 rounded-xl size-12 bg-orange-background text-orange',
        blue: 'p-3 rounded-xl size-12 bg-blue-background text-blue',
        green: 'p-3 rounded-xl size-12 bg-green-background text-green',
        yellow: 'p-3 rounded-xl size-12 bg-yellow-background text-yellow',
        gray: 'p-3 rounded-xl size-12 bg-gray-background text-gray',
    };

    return (
        <Card
            className="flex items-center"
            onClick={
                href
                    ? () => {
                          document.getElementById('birthdays')?.scrollIntoView({
                              behavior: 'smooth',
                          });
                      }
                    : undefined
            }
        >
            <CardContent className="flex gap-4 items-center  p-3 lg:p-6">
                <div className={colors[color]}>{children}</div>
                <div>
                    <div className="text-sm text-muted-foreground ">{title}</div>
                    {data ? <div className="text-2xl font-semibold">{data || 0}</div> : <Skeleton className="h-6 my-1 w-16 " />}
                </div>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
