import { ReactNode } from "react";
import { BackButton } from "./BackButton";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBack?: boolean;
  backTo?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, showBack, backTo, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {showBack && <BackButton to={backTo} />}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
