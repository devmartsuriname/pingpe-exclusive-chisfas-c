import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BookingStatusChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function BookingStatusChart({ data }: BookingStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
        <YAxis stroke="hsl(var(--foreground))" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--background))", 
            border: "1px solid hsl(var(--border))" 
          }} 
        />
        <Legend />
        <Bar dataKey="value" fill="hsl(var(--primary))" name="Bookings" />
      </BarChart>
    </ResponsiveContainer>
  );
}
