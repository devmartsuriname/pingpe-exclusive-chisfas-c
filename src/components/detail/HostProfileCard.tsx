import { Link } from "react-router-dom";
import { Star, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface HostProfileCardProps {
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  hostBio?: string;
  joinedDate: string;
  rating?: number;
  responseRate?: number;
  responseTime?: string;
}

export const HostProfileCard = ({
  hostId,
  hostName,
  hostAvatar,
  hostBio,
  joinedDate,
  rating = 4.9,
  responseRate = 98,
  responseTime = "within an hour",
}: HostProfileCardProps) => {
  const initials = hostName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-start gap-4">
        <Link to={`/hosts/${hostId}`}>
          <Avatar className="w-16 h-16">
            <AvatarImage src={hostAvatar} alt={hostName} />
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link to={`/hosts/${hostId}`} className="hover:text-primary">
            <h3 className="font-semibold text-lg">{hostName}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            Joined {format(new Date(joinedDate), "MMMM yyyy")}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {hostBio && (
        <p className="text-sm text-muted-foreground line-clamp-3">{hostBio}</p>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Response rate</span>
          <span className="font-medium">{responseRate}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Response time</span>
          <span className="font-medium">{responseTime}</span>
        </div>
      </div>

      <Button className="w-full">
        <MessageCircle className="w-4 h-4 mr-2" />
        Contact Host
      </Button>
    </div>
  );
};
