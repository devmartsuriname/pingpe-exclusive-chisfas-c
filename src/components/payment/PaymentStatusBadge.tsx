import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, AlertCircle, DollarSign } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: string;
  className?: string;
}

export default function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "succeeded":
        return {
          label: "Paid",
          variant: "default" as const,
          icon: CheckCircle2,
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        };
      case "processing":
        return {
          label: "Processing",
          variant: "secondary" as const,
          icon: Clock,
          className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        };
      case "pending":
        return {
          label: "Pending",
          variant: "outline" as const,
          icon: DollarSign,
          className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        };
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          icon: XCircle,
          className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        };
      case "refunded":
        return {
          label: "Refunded",
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          variant: "outline" as const,
          icon: XCircle,
          className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        };
      default:
        return {
          label: status,
          variant: "outline" as const,
          icon: AlertCircle,
          className: "",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
