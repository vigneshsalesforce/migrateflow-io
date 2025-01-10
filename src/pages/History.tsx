import { useState } from "react";
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

// Dummy data
const initialHistory = [
  {
    id: 1,
    date: "2024-03-10",
    files: 234,
    status: "completed",
    duration: "1h 23m",
    source: "Sales",
  },
  {
    id: 2,
    date: "2024-03-09",
    files: 567,
    status: "failed",
    duration: "45m",
    source: "Marketing",
  },
  {
    id: 3,
    date: "2024-03-08",
    files: 123,
    status: "completed",
    duration: "2h 15m",
    source: "Finance",
  },
  // Add more history items...
];

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredHistory = initialHistory.filter((item) => {
    const matchesSearch =
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <SelectItem value="failed">Failed</SelectItem>
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
                <TableHead>Source</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.files}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-sm",
                        item.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {item.status}
                    </span>
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
