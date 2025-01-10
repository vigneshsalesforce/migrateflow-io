import { useState, useEffect } from "react";
import { ArrowRight, FileType, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MigrationModal } from "@/components/MigrationModal";
import { api } from "@/utils/api";
import { BACKEND_URL } from "@/config/apiConstants";
import { Spinner } from "@/components/ui/spinner";


interface Metrics {
    totalFiles: number;
    completedFiles: number;
    estimatedTime: string | null;
    successRate: number;
}

interface Migration {
    _id: number;
    date: string;
    status: string;
    files: number;
    salesforceObject: string;
    createdAt: Date;
}

export default function Dashboard() {
  const [isStarting, setIsStarting] = useState(false);
  const [showModal, setShowModal] = useState(false);
    const [metrics, setMetrics] = useState<Metrics | null>(null); // Initialize as null
    const [recentMigrations, setRecentMigrations] = useState<Migration[]>([])
    const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
           setLoading(true);
            const response = await api(`${BACKEND_URL}/dashboard`, 'get');
            setMetrics(response.metrics);
            setRecentMigrations(response.recentMigrations);
             setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
           setLoading(false);
        }
    };

    useEffect(() => {
      fetchDashboardData()
    }, [])


  const handleStartMigration = async () => {
    setIsStarting(true);
    toast({
      title: "Migration Started",
      description: "Your migration has been initiated successfully.",
    });
    try {
       const response = await api(`${BACKEND_URL}/migration/start`, 'post', {}, { selectedObject: 'Account' });
        const { migrationId } = response;
       setTimeout(() => {
      setIsStarting(false);
      navigate(`/active?migrationId=${migrationId}`);
        }, 200);
        } catch (error: any) {
            console.error("Error starting migration:", error);
            setIsStarting(false);
            toast({
              title: "Error",
              description: error.message || "Failed to start migration",
              variant: "destructive",
            });
        }

  };

    if (loading) {
        return <div className="container mx-auto p-6 flex justify-center"><Spinner /></div>;
    }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-migration-text">Dashboard</h1>
         {/* Start Migration Button Here - Conditionally Rendered */}
        <Button
          onClick={() => setShowModal(true)}
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
      {/* metrics cards, progress and recent migrations */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                    <FileType className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalFiles}</div>
                    <Progress
                        value={metrics.totalFiles > 0 ? (metrics.completedFiles / metrics.totalFiles) * 100 : 0}
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
                    <div className="text-2xl font-bold">{metrics?.successRate}</div>
                </CardContent>
            </Card>
      </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Migrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMigrations?.map((migration) => (
              <div
                key={migration._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{format(new Date(migration.createdAt), "dd/MM/yyyy HH:mm")}</p>
                  <p className="text-sm text-muted-foreground">
                    {migration.salesforceObject} 
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

      <MigrationModal
        open={showModal}
        onOpenChange={setShowModal}
        onStartMigration={handleStartMigration}
      />
    </div>
  );
}