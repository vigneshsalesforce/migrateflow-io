import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pause, Play, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEBSOCKET_URL, BACKEND_URL } from "../config/apiConstants";
import { api } from '../utils/api';
import { useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

interface File {
    _id: string;
    name: string;
    size: number;
    status: string;
    error?: string;
}

interface Migration {
    _id: string;
    salesforceObject: string;
    source: { name: string, type: string };
    destination: { name: string, type: string }
    progress: number;
    status: string;
    totalFiles: number,
    migratedFiles: number;
    files?: File[];
}

interface FileProgress {
    type: string;
    fileName: string;
    fileId: string;
    fileSize: number;
    status: string;
    error?: string;
    migrationId: string;
}


export default function ActiveMigrations() {
    const [migrations, setMigrations] = useState<Migration[]>([]);
    const { toast } = useToast();
    const wsRef = useRef<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const migrationId = searchParams.get('migrationId');


    const fetchMigrations = async () => {
        try {
            setLoading(true);
            const response = await api(`${BACKEND_URL}/migration`, 'get');
            const filteredMigrations = response.filter((migration: any) => {
               if(migrationId) {
                  return  migration._id === migrationId;
               }
                 return true;
           })
            setMigrations(filteredMigrations.map((migration: any) => ({
                _id: migration._id,
                salesforceObject: migration.salesforceObject,
                source: migration.source,
                destination: migration.destination,
                progress: migration.progress || 0,
                status: migration.status,
                totalFiles: migration.totalFiles,
                migratedFiles: migration.migratedFiles,
                 files: [] // Initialize files array
            })));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching migrations:', error);
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchMigrations();
        // Set up WebSocket
        wsRef.current = new WebSocket(WEBSOCKET_URL);
        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "fileProgress") {
                setMigrations((prev) => {
                   return prev.map((migration) => {
                     if (migration._id === data.migrationId) {
                         const updatedFiles = migration.files
                             ? [...migration.files, { //Append the new file
                                 _id: data.fileId,
                                 name: data.fileName,
                                 size: data.fileSize,
                                 status: data.status,
                                 error: data.error
                             }]
                             : [{
                                 _id: data.fileId,
                                 name: data.fileName,
                                 size: data.fileSize,
                                 status: data.status,
                                 error: data.error
                             }];
                         return { ...migration, files: updatedFiles };
                     }
                     return migration;
                   })
                 });
            } else if (data.type === "progress") {
                setMigrations((prev) => {
                    return prev.map((migration) => {
                        if (migration._id === data.migrationId) {
                            return { ...migration, progress: Math.floor(data.progress) }
                        }
                        return migration;
                    });
                });
            } else if (data.type === "complete") {
                setMigrations((prev) =>
                    prev.map((migration) =>
                        migration._id === data.migrationId
                            ? { ...migration, status: migration.migratedFiles === migration.totalFiles ? "completed" : "partial success", progress: 100 }
                            : migration
                    )
                );
            } else if (data.type === "error") {
                setMigrations((prev) =>
                    prev.map((migration) =>
                        migration._id === data.migrationId
                            ? { ...migration, status: "failed" }
                            : migration
                    )
                );
                toast({
                    title: "Migration Failed",
                    description: data.message,
                    variant: 'destructive'
                });
            }
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [toast, migrationId]);


    const handlePause = (id: string) => {
        setMigrations((prev) =>
            prev.map((migration) =>
                migration._id === id
                    ? { ...migration, status: "paused" }
                    : migration
            )
        );
        toast({
            title: "Migration Paused",
            description: "The migration has been paused successfully.",
        });
    };

    const handleResume = (id: string) => {
        setMigrations((prev) =>
            prev.map((migration) =>
                migration._id === id
                    ? { ...migration, status: "inProgress" }
                    : migration
            )
        );
        toast({
            title: "Migration Resumed",
            description: "The migration has been resumed successfully.",
        });
    };

    const handleCancel = (id: string) => {
        setMigrations((prev) =>
            prev.map((migration) =>
                migration._id === id
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
            case "partial success":
                return <CheckCircle className="h-5 w-5 text-migration-success" />;
            case "failed":
                return <AlertCircle className="h-5 w-5 text-migration-error" />;
            case "paused":
                return <Pause className="h-5 w-5 text-migration-warning" />;
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="container mx-auto p-6 flex justify-center"><Spinner /></div>;
    }

    if (migrations.length === 0) {
        return <div className="container mx-auto p-6">No Active Migrations.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-migration-text mb-8">
                Active Migrations
            </h1>

            <div className="space-y-6">
                {migrations.map((migration) => (
                    <Card key={migration._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">
                                {migration.salesforceObject}
                            </CardTitle>
                            {getStatusIcon(migration.status)}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>ID: {migration._id}</span>
                                    <span>Source: {migration.source.name} ({migration.source.type})</span>
                                    <span>Destination: {migration.destination.name} ({migration.destination.type})</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Total Files: {migration.totalFiles}</span>
                                    <span>Progress: {migration.progress}%</span>
                                </div>

                                <Progress
                                    value={migration.progress}
                                    className={cn(
                                        migration.status === "failed" && "bg-migration-error/20"
                                    )}
                                />

                                {migration.files && migration.files.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <h4 className="text-md font-semibold">Files Progress</h4>
                                        {migration.files.map((file) => (
                                            <div key={file._id} className="border rounded p-2">
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>{file.name}</span>
                                                    <span>Size: {file.size ? Math.round(file.size / 1024) + "KB" : "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>Status: {file.status}</span>
                                                    {file.error && <span className="text-migration-error">Error: {file.error}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                    {migration.status === "inProgress" ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePause(migration._id)}
                                        >
                                            <Pause className="h-4 w-4 mr-1" /> Pause
                                        </Button>
                                    ) : migration.status === "paused" ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleResume(migration._id)}
                                        >
                                            <Play className="h-4 w-4 mr-1" /> Resume
                                        </Button>
                                    ) : null}
                                    {["inProgress", "paused"].includes(migration.status) && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleCancel(migration._id)}
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