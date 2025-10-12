import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Commission {
  partner: string;
  amount: number;
  paid: boolean;
  date?: string;
}

interface CommissionTableProps {
  data: Commission[];
}

export default function CommissionTable({ data }: CommissionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Partner</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No commission data available
            </TableCell>
          </TableRow>
        ) : (
          data.map((commission, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{commission.partner}</TableCell>
              <TableCell>${commission.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={commission.paid ? "default" : "secondary"}>
                  {commission.paid ? "Paid" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>{commission.date || "-"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
