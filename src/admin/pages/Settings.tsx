import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlatformSettings from "./settings/PlatformSettings";
import NotificationSettings from "./settings/NotificationSettings";
import RoleSettings from "./settings/RoleSettings";
import IntegrationSettings from "./settings/IntegrationSettings";
import PaymentSettings from "./settings/PaymentSettings";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Global configuration and settings</p>
      </div>

      <Tabs defaultValue="platform" className="w-full">
        <TabsList>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <PlatformSettings />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="email">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="roles">
          <RoleSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
