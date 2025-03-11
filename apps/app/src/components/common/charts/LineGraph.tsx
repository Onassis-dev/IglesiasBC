import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface props {
    title: string;
    description?: string;
    data: any[];
    config: ChartConfig;
    dataKeys: string[];
    colors: string[];
}

const LineGraph = ({ title, description, data, config, dataKeys, colors }: props) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <span className="text-sm">{title}</span>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="max-h-full" config={config}>
                    <AreaChart
                        className="h-full"
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 4,
                            right: 4,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={6} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Area dataKey={dataKeys[0]} dot={false} type="natural" stroke={`var(--${colors[0]})`} animationDuration={800} />
                        <Area dataKey={dataKeys[0]} dot={false} type="natural" stroke={`var(--${colors[0]})`} animationDuration={800} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default LineGraph;
