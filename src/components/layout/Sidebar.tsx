import { Home, History, Activity, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { APP_CONSTANTS } from "@/constants";

const menuItems = [
  { icon: Home, label: "Dashboard", path: APP_CONSTANTS.ROUTES.DASHBOARD },
  { icon: Activity, label: "Active Migrations", path: APP_CONSTANTS.ROUTES.ACTIVE_MIGRATIONS },
  { icon: History, label: "History", path: APP_CONSTANTS.ROUTES.HISTORY },
  { icon: Link, label: "Connections", path: APP_CONSTANTS.ROUTES.CONNECTIONS },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="pb-12 h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path && "bg-migration-secondary/10"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};