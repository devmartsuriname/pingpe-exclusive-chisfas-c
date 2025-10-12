import { Outlet } from "react-router-dom";
import AdminSidebar from "@/admin/components/layout/AdminSidebar";
import AdminTopbar from "@/admin/components/layout/AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
