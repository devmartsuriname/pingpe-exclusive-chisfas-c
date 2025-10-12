import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";

const permissions = [
  { action: "View Dashboard", admin: true, host: true, guest: false },
  { action: "Manage All Inventory", admin: true, host: false, guest: false },
  { action: "Manage Own Inventory", admin: true, host: true, guest: false },
  { action: "View All Bookings", admin: true, host: false, guest: false },
  { action: "View Own Bookings", admin: true, host: true, guest: true },
  { action: "Approve Bookings", admin: true, host: true, guest: false },
  { action: "Manage Users", admin: true, host: false, guest: false },
  { action: "Assign Roles", admin: true, host: false, guest: false },
  { action: "Manage Partners", admin: true, host: false, guest: false },
  { action: "View Reports", admin: true, host: false, guest: false },
  { action: "Manage Settings", admin: true, host: false, guest: false },
  { action: "Process Refunds", admin: true, host: false, guest: false },
  { action: "Create Bookings", admin: true, host: true, guest: true },
  { action: "Cancel Own Bookings", admin: true, host: true, guest: true },
  { action: "Upload Media", admin: true, host: true, guest: false },
];

export default function RoleMatrix() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Permission</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-center">Host</TableHead>
              <TableHead className="text-center">Guest</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{permission.action}</TableCell>
                <TableCell className="text-center">
                  {permission.admin ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {permission.host ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {permission.guest ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h4 className="font-semibold mb-2">Admin Role</h4>
          <p className="text-sm text-muted-foreground">
            Full platform access with all permissions including user management, settings, and reports.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h4 className="font-semibold mb-2">Host Role</h4>
          <p className="text-sm text-muted-foreground">
            Can manage their own inventory, view and approve bookings, and upload media.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h4 className="font-semibold mb-2">Guest Role</h4>
          <p className="text-sm text-muted-foreground">
            Can create bookings, view their own bookings, and manage their profile.
          </p>
        </div>
      </div>
    </div>
  );
}
