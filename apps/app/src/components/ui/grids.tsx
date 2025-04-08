import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

interface props {
    className?: string;
    children: any;
}

const StatsGrid = ({ className, children }: props) => {
    return (
        <>
            <div className={cn('w-full hidden md:grid grid-cols-3 gap-6 justify-stretch mb-8', className)}>{children}</div>
            <Carousel className="w-full md:hidden">
                <CarouselContent>{children?.map((child: any) => <CarouselItem key={child.id}>{child}</CarouselItem>)}</CarouselContent>
            </Carousel>
        </>
    );
};

const OptionsGrid = ({ className, children }: props) => {
    return <div className={cn('flex justify-between gap-2', className)}>{children}</div>;
};

export { StatsGrid, OptionsGrid };
