import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Cloud, Database } from "lucide-react";

export default function Connections() {
  const [salesforceConnected, setSalesforceConnected] = useState(false);
  const [sharepointConnected, setSharepointConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = (service: "salesforce" | "sharepoint") => {
    if (service === "salesforce") {
      setSalesforceConnected(true);
      toast({
        title: "Salesforce Connected",
        description: "Successfully connected to Salesforce.",
      });
    } else {
      setSharepointConnected(true);
      toast({
        title: "SharePoint Connected",
        description: "Successfully connected to SharePoint.",
      });
    }
  };

  const handleDisconnect = (service: "salesforce" | "sharepoint") => {
    if (service === "salesforce") {
      setSalesforceConnected(false);
      toast({
        title: "Salesforce Disconnected",
        description: "Successfully disconnected from Salesforce.",
      });
    } else {
      setSharepointConnected(false);
      toast({
        title: "SharePoint Disconnected",
        description: "Successfully disconnected from SharePoint.",
      });
    }
  };

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
                {salesforceConnected
                  ? "Connected to Salesforce"
                  : "Not connected to Salesforce"}
              </p>
              <Button
                variant={salesforceConnected ? "destructive" : "default"}
                onClick={() =>
                  salesforceConnected
                    ? handleDisconnect("salesforce")
                    : handleConnect("salesforce")
                }
                className="w-full"
              >
                {salesforceConnected ? "Disconnect" : "Connect"}
              </Button>
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
                {sharepointConnected
                  ? "Connected to SharePoint"
                  : "Not connected to SharePoint"}
              </p>
              <Button
                variant={sharepointConnected ? "destructive" : "default"}
                onClick={() =>
                  sharepointConnected
                    ? handleDisconnect("sharepoint")
                    : handleConnect("sharepoint")
                }
                className="w-full"
              >
                {sharepointConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}