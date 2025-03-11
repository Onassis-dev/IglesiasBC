import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface props {
    title: string;
    description?: string;
    data: any[];
    config: ChartConfig;
    lines: { key: string; color: string }[];
}

const AreaGraph = ({ title, description, data, config, lines }: props) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="min-h-40 max-h-80 w-full" config={config}>
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 4,
                            right: 4,
                            top: 4,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis axisLine={false} tickLine={false} />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={({ x, y, payload, index }) => {
                                let dx = 0;
                                let textAnchor = "middle";

                                if (index === 0) {
                                    dx = 0;
                                    textAnchor = "start";
                                } else if (index === data.length - 1) {
                                    dx = 0;
                                    textAnchor = "end";
                                }

                                return (
                                    <text x={x + dx} y={y} fill="black" textAnchor={textAnchor} fontSize={12}>
                                        {payload.value}
                                    </text>
                                );
                            }}
                            interval={0}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        {lines.map((line) => (
                            <Area dataKey={line.key} animationDuration={800} dot={false} type="monotone" fill={`var(--${line.color}-background)`} stroke={`var(--${line.color})`}></Area>
                        ))}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default AreaGraph;
