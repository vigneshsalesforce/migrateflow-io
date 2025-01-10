import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { AUTH_SALESFORCE_URL, AUTH_SHAREPOINT_URL, BACKEND_URL, WEBSOCKET_URL } from '../config/apiConstants';


interface MigrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartMigration: () => void;
}

export function MigrationModal({
  open,
  onOpenChange,
  onStartMigration,
}: MigrationModalProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!source || !destination) {
      toast({
        title: "Error",
        description: "Please select both source and destination",
        variant: "destructive",
      });
      return;
    }
    let selectedObject = 'Account';
    onOpenChange(false);
    navigate('/active');
    onStartMigration();
    await api(`${BACKEND_URL}/migration/start`, 'post', {}, { selectedObject });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Migration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Source</label>
            <Select onValueChange={setSource} value={source}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salesforce">Salesforce</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <Select onValueChange={setDestination} value={destination}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sharepoint">SharePoint</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStart}>Start Migration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}