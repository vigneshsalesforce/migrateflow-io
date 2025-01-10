import { useState } from "react";
import { ArrowRight, FileType, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

// Dummy data
const metrics = {
  totalFiles: 1234,
  completedFiles: 890,
  estimatedTime: "2 hours",
  successRate: "98%",
};

const recentMigrations = [
  { id: 1, date: "2024-03-10", status: "completed", files: 234 },
  { id: 2, date: "2024-03-09", status: "failed", files: 567 },
  { id: 3, date: "2024-03-08", status: "completed", files: 123 },
];

export default function Dashboard() {
  const [isStarting, setIsStarting] = useState(false);
  const { toast } = useToast();

  const handleStartMigration = () => {
    setIsStarting(true);
    toast({
      title: "Migration Started",
      description: "Your migration has been initiated successfully.",
    });
    setTimeout(() => {
      setIsStarting(false);
      window.location.href = "/active";
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-migration-text">Dashboard</h1>
        <Button
          onClick={handleStartMigration}
          disabled={isStarting}
          className="bg-gradient-to-r from-migration-primary to-migration-secondary hover:opacity-90 transition-opacity"
        >
          {isStarting ? (
            "Starting Migration..."
          ) : (
            <>
              Start New Migration
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileType className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalFiles}</div>
            <Progress
              value={(metrics.completedFiles / metrics.totalFiles) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Files</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedFiles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.estimatedTime}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Migrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMigrations.map((migration) => (
              <div
                key={migration.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{migration.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {migration.files} files
                  </p>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm",
                    migration.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {migration.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}