import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
const data = [
    { month: "Enero", miembros: 10 },
    { month: "Febrero", miembros: 12 },
    { month: "Marzo", miembros: 8 },
    { month: "Abril", miembros: 11 },
    { month: "Mayo", miembros: 10 },
    { month: "Junio", miembros: 16 },
];

const lines = [{ key: "miembros", color: "purple" }];

const chartConfig = {
    miembros: {},
} satisfies ChartConfig;

const Graph1 = () => (
    <ChartContainer className="w-full" config={chartConfig}>
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
            <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
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
            {lines.map((line, i) => (
                <Area key={i} dataKey={line.key} animationBegin={200} animationDuration={1000} dot={false} type="monotone" fill={`var(--${line.color}-background)`} stroke={`var(--${line.color})`} />
            ))}
        </AreaChart>
    </ChartContainer>
);
export default Graph1;
