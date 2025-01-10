import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { BACKEND_URL } from "@/config/apiConstants";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
     source: {name: string, type: string};
     destination: {name: string, type: string}
    status: string;
    totalFiles: number;
    files?: File[];
    createdAt: string;
}


export default function History() {
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");


    const fetchMigrations = async () => {
        try {
            setLoading(true);
            const response = await api(`${BACKEND_URL}/migration/history`, 'get');
            setMigrations(response);
             setLoading(false);
        } catch (error) {
            console.error('Error fetching migrations:', error);
             setLoading(false);
        }
    };


  useEffect(() => {
       fetchMigrations()
  }, []);

  const filteredMigrations = (migrations && Array.isArray(migrations))
  ? migrations.filter((item) => {
      const matchesSearch =
          item.salesforceObject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          new Date(item.createdAt).toLocaleDateString().includes(searchTerm);

      const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
  })
  : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return <CheckCircle className="h-5 w-5 text-migration-success" />;
        case "partial success":
          return <CheckCircle className="h-5 w-5 text-migration-success" />;
        case "failed":
            return <AlertCircle className="h-5 w-5 text-migration-error" />;
        case "cancelled":
            return <AlertCircle className="h-5 w-5 text-migration-error" />
      default:
        return null;
    }
  };
  if (loading) {
        return <div className="container mx-auto p-6 flex justify-center"><Spinner /></div>;
    }
    if (migrations.length === 0) {
        return <div className="container mx-auto p-6">No History Available.</div>;
    }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-migration-text mb-8">
        Migration History
      </h1>
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by source or date..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="partial success">Partial Success</SelectItem>
                             <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>


      <Card>
          <CardContent className="p-0">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Date</TableHead>
                           <TableHead>Migration Name</TableHead>
                            <TableHead>Source</TableHead>
                          <TableHead>Destination</TableHead>
                           <TableHead>Files</TableHead>
                            <TableHead>Status</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {filteredMigrations?.map((item) => (
                         <TableRow key={item._id}>
                             <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{item.salesforceObject}</TableCell>
                            <TableCell>{item.source.name} ({item.source.type})</TableCell>
                             <TableCell>{item.destination.name} ({item.destination.type})</TableCell>
                              <TableCell>{item.totalFiles}</TableCell>
                               <TableCell>
                                   <span className="flex items-center gap-2">
                                        {getStatusIcon(item.status)}
                                      {item.status}
                                    </span>
                              </TableCell>
                             <TableCell>
                                  <Accordion type="single" collapsible>
                                      <AccordionItem value={item._id}>
                                         <AccordionTrigger>Files</AccordionTrigger>
                                          <AccordionContent>
                                                {item.files && item.files.length > 0 ? (
                                                     <div className="mt-4 space-y-2">
                                                         {item.files.map((file) => (
                                                            <div key={file._id} className="border rounded p-2">
                                                               <div className="flex justify-between text-sm text-muted-foreground">
                                                                    <span>{file.name}</span>
                                                                      <span>Size: {file.size ? Math.round(file.size / 1024) + "KB": "N/A"}</span>
                                                                </div>
                                                               <div className="flex justify-between text-sm text-muted-foreground">
                                                                    <span>Status: {file.status}</span>
                                                                     {file.error && <span className="text-migration-error">Error: {file.error}</span>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                     </div>
                                                 ) : (
                                                    <div className="mt-2"> No files migrated.</div>
                                                )}
                                          </AccordionContent>
                                     </AccordionItem>
                                  </Accordion>
                             </TableCell>
                         </TableRow>
                        ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
}