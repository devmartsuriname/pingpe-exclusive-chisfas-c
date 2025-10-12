import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface OccupancyChartProps {
  data: Array<{ property: string; occupancy: number }>;
}

export default function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="property" stroke="hsl(var(--foreground))" />
        <YAxis stroke="hsl(var(--foreground))" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))", 
            border: "1px solid hsl(var(--border))" 
          }}
          formatter={(value: number) => `${value}%`}
        />
        <Legend />
        <Line type="monotone" dataKey="occupancy" stroke="hsl(var(--primary))" name="Occupancy %" />
      </LineChart>
    </ResponsiveContainer>
  );
}
