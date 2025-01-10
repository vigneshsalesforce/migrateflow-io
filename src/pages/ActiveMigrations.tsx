import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pause, Play, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data for active migrations
const initialMigrations = [
  {
    id: 1,
    fileName: "Sales_Report_2024.xlsx",
    progress: 45,
    status: "in_progress",
    size: "2.4 MB",
  },
  {
    id: 2,
    fileName: "Customer_Data.csv",
    progress: 78,
    status: "in_progress",
    size: "1.8 MB",
  },
  {
    id: 3,
    fileName: "Marketing_Assets.zip",
    progress: 100,
    status: "completed",
    size: "5.2 MB",
  },
  {
    id: 4,
    fileName: "Financial_Summary.pdf",
    progress: 0,
    status: "error",
    size: "3.1 MB",
  },
];

export default function ActiveMigrations() {
  const [migrations, setMigrations] = useState(initialMigrations);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate progress updates
    const interval = setInterval(() => {
      setMigrations((prev) =>
        prev.map((migration) => {
          if (
            migration.status === "in_progress" &&
            migration.progress < 100
          ) {
            return {
              ...migration,
              progress: migration.progress + 1,
              status: migration.progress + 1 >= 100 ? "completed" : "in_progress",
            };
          }
          return migration;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePause = (id: number) => {
    setMigrations((prev) =>
      prev.map((migration) =>
        migration.id === id
          ? { ...migration, status: "paused" }
          : migration
      )
    );
    toast({
      title: "Migration Paused",
      description: "The migration has been paused successfully.",
    });
  };

  const handleResume = (id: number) => {
    setMigrations((prev) =>
      prev.map((migration) =>
        migration.id === id
          ? { ...migration, status: "in_progress" }
          : migration
      )
    );
    toast({
      title: "Migration Resumed",
      description: "The migration has been resumed successfully.",
    });
  };

  const handleCancel = (id: number) => {
    setMigrations((prev) =>
      prev.map((migration) =>
        migration.id === id
          ? { ...migration, status: "cancelled" }
          : migration
      )
    );
    toast({
      title: "Migration Cancelled",
      description: "The migration has been cancelled successfully.",
      variant: "destructive",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-migration-success" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-migration-error" />;
      case "paused":
        return <Pause className="h-5 w-5 text-migration-warning" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-migration-text mb-8">
        Active Migrations
      </h1>

      <div className="space-y-6">
        {migrations.map((migration) => (
          <Card key={migration.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                {migration.fileName}
              </CardTitle>
              {getStatusIcon(migration.status)}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Size: {migration.size}</span>
                  <span>{migration.progress}%</span>
                </div>
                <Progress
                  value={migration.progress}
                  className={cn(
                    migration.status === "error" && "bg-migration-error/20"
                  )}
                />
                <div className="flex justify-end space-x-2">
                  {migration.status === "in_progress" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePause(migration.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" /> Pause
                    </Button>
                  ) : migration.status === "paused" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResume(migration.id)}
                    >
                      <Play className="h-4 w-4 mr-1" /> Resume
                    </Button>
                  ) : null}
                  {["in_progress", "paused"].includes(migration.status) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(migration.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
