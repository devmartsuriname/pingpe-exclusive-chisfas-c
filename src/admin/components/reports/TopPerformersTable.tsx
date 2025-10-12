import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Performer {
  name: string;
  revenue: number;
  bookings: number;
}

interface TopPerformersTableProps {
  data: Performer[];
}

export default function TopPerformersTable({ data }: TopPerformersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Host</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Bookings</TableHead>
          <TableHead>Avg/Booking</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No performance data available
            </TableCell>
          </TableRow>
        ) : (
          data.map((performer, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">#{index + 1}</TableCell>
              <TableCell>{performer.name}</TableCell>
              <TableCell>${performer.revenue.toLocaleString()}</TableCell>
              <TableCell>{performer.bookings}</TableCell>
              <TableCell>${(performer.revenue / performer.bookings).toFixed(2)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
