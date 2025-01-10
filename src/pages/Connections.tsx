import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Cloud, Database } from "lucide-react";
import { api } from '../utils/api';
import { AUTH_SALESFORCE_URL, AUTH_SHAREPOINT_URL, BACKEND_URL, WEBSOCKET_URL } from '../config/apiConstants';
import { Spinner } from "@/components/ui/spinner";

interface Source {
    _id: string;
    name: string;
    type: 'salesforce' | 'sharepoint';
    active: boolean;
}


export default function Connections() {
    const [salesforceSource, setSalesforceSource] = useState<Source | null>(null);
    const [sharepointSource, setSharepointSource] = useState<Source | null>(null);
    const { toast } = useToast();
     const [loading, setLoading] = useState(true);

     const fetchSources = async () => {
         try {
                setLoading(true)
             const response = await api(`${BACKEND_URL}/auth/sources`, 'get');
            const salesforce = response.sources.find((source: Source) => source.type === 'salesforce') || null;
             const sharepoint = response.sources.find((source: Source) => source.type === 'sharepoint') || null;

           setSalesforceSource(salesforce);
            setSharepointSource(sharepoint);
            setLoading(false);
         } catch (error) {
             console.error("Error fetching sources", error);
            setLoading(false);
         }
    };

    useEffect(() => {
        fetchSources();
    }, []);

  const handleConnect = async (service: "salesforce" | "sharepoint") => {
        try {
                if (service === "salesforce") {
                  const response = await api(AUTH_SALESFORCE_URL, 'get');
                  window.location.href = response.authURL;
                   } else {
                 const response = await api(AUTH_SHAREPOINT_URL, 'get')
                  window.location.href = response.authURL;
                }
        } catch (error) {
            console.error('Failed to initiate  connect:', error);
            toast({
              title: "Error",
                description: "Failed to initiate connection",
               variant: 'destructive'
            });
        }
  };


  const handleDisconnect = async (service: "salesforce" | "sharepoint") => {
    try {
        const source = service === 'salesforce' ? salesforceSource : sharepointSource;
         if(source) {
            const response = await api(`${BACKEND_URL}/auth/disconnect/${source._id}`, 'post');
                if (response.success) {
                     if (service === "salesforce") {
                          setSalesforceSource((prev) => prev ? { ...prev, active: false} : null);
                     } else {
                          setSharepointSource((prev) => prev ? { ...prev, active: false} : null);
                     }
                   toast({
                        title:  `${service} Disconnected`,
                        description: `Successfully disconnected from ${service}.`,
                    });
                  }
                }
        } catch (error: any) {
            console.error('Failed to disconnect:', error);
             toast({
              title: "Error",
                 description:  error.message || `Failed to disconnect from ${service}`,
                  variant: 'destructive'
                });
        }
  };

  const handleReauthenticate = async (service: 'salesforce' | 'sharepoint') => {
      try {
            const source = service === 'salesforce' ? salesforceSource : sharepointSource;
         if(source) {
             const response = await api(`${BACKEND_URL}/auth/reauthenticate/${source._id}`, 'post');
                if(response.success) {
                   toast({
                        title: `${service} Reauthenticate`,
                       description: `Successfully set ${service} to reauthenticate.`,
                    });
                 }
            }

        } catch (error: any) {
             console.error(`Failed to set reauthenticate for ${service}:`, error);
            toast({
                title: 'Error',
                description:  error.message || `Failed to reauthenticate ${service}`,
              variant: 'destructive'
            });
        }
    }


    if (loading) {
         return <div className="container mx-auto p-6 flex justify-center"><Spinner /></div>;
    }


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-migration-text mb-8">Connections</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl font-semibold">
                            <div className="flex items-center gap-2">
                                <Database className="h-6 w-6" />
                                Salesforce
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                {salesforceSource?.active
                                    ? "Connected to Salesforce"
                                    : "Not connected to Salesforce"}
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant={salesforceSource?.active ? "destructive" : "default"}
                                    onClick={() =>
                                        salesforceSource?.active
                                            ? handleDisconnect("salesforce")
                                            : handleConnect("salesforce")
                                    }
                                >
                                    {salesforceSource?.active ? "Disconnect" : "Connect"}
                                </Button>
                                {salesforceSource && <Button variant="outline" onClick={()=> handleReauthenticate('salesforce')}>Reauthenticate</Button>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl font-semibold">
                            <div className="flex items-center gap-2">
                                <Cloud className="h-6 w-6" />
                                SharePoint
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                {sharepointSource?.active
                                    ? "Connected to SharePoint"
                                    : "Not connected to SharePoint"}
                            </p>
                              <div className="flex justify-end gap-2">
                                   <Button
                                        variant={sharepointSource?.active ? "destructive" : "default"}
                                        onClick={() =>
                                            sharepointSource?.active
                                                ? handleDisconnect("sharepoint")
                                                : handleConnect("sharepoint")
                                        }
                                    >
                                        {sharepointSource?.active ? "Disconnect" : "Connect"}
                                    </Button>
                                  {sharepointSource && <Button variant="outline" onClick={()=> handleReauthenticate('sharepoint')}>Reauthenticate</Button>}
                                </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}