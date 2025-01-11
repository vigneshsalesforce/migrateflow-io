import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { api } from "../utils/api";
import { MIGRATE_START_URL, BACKEND_URL } from '../config/apiConstants';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNavigate } from "react-router-dom";

interface SalesforceObject {
    name: string;
    value: string
}
interface RelatedObject {
    name: string;
    value: string
}

interface MigrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStartMigration: () => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({
    open,
    onOpenChange,
    onStartMigration,
}) => {
    const [salesforceObjects, setSalesforceObjects] = useState<SalesforceObject[]>([]);
    const [relatedObjects, setRelatedObjects] = useState<RelatedObject[]>([]);
    const [selectedObject, setSelectedObject] = useState<string>("");
    const [selectedRelatedObjects, setSelectedRelatedObjects] = useState<string[]>([]);
    const [selectedSource, setSelectedSource] = useState<string>("");
    const [objectsLoading, setObjectsLoading] = useState(false);
    const [relatedObjectsLoading, setRelatedObjectsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchSalesforceObjects = async () => {
        try {
            setObjectsLoading(true);
            const response = await api(`${BACKEND_URL}/migration/objects`, 'get');
            setSalesforceObjects(response.objects);
            setObjectsLoading(false);
        } catch (error) {
            console.error("Failed to fetch salesforce objects:", error);
            setObjectsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSource === 'salesforce') {
            fetchSalesforceObjects()
        } else {
            setSalesforceObjects([])
            setRelatedObjects([])
            setSelectedObject('')
            setSelectedRelatedObjects([])
        }
    }, [selectedSource]);

    const handleObjectSelection = async (object: string) => {
        setSelectedObject(object);
        try {
            setRelatedObjectsLoading(true);
            const response = await api(`${BACKEND_URL}/migration/related-objects`, 'post', {}, { selectedObject: object });
            setRelatedObjects(response.relatedObjects);
            setRelatedObjectsLoading(false);
        } catch (error) {
            console.error("Failed to fetch related objects:", error);
            setRelatedObjectsLoading(false);
        }

    };

    const handleRelatedObjectChange = (obj: string) => {
        setSelectedRelatedObjects((prev) =>
            prev.includes(obj) ? prev.filter((o) => o !== obj) : [...prev, obj]
        );
    };
    const handleSourceSelection = (source: string) => {
        setSelectedSource(source)
    }

    const handleStart = async () => {
        try {
            onStartMigration();
            const payload = {
                selectedObject,
                relatedObjects: selectedRelatedObjects
            }
            const response =await api(MIGRATE_START_URL, 'post', {}, payload)
            const { migrationId } = response;
            setTimeout(() => {
              onOpenChange(false);
              navigate(`/active?migrationId=${migrationId}`);
            }, 200);
        } catch (error) {
            console.error('Error starting migration:', error);
        }
    };



    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {/* <Button >Start New Migration</Button> */}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Start New Migration</AlertDialogTitle>
                    <AlertDialogDescription>
                        Choose the salesforce object and related objects to start the migration
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="migration-source">Source</Label>
                        <RadioGroup onValueChange={handleSourceSelection} value={selectedSource}>
                            <div className="flex gap-2">
                                <RadioGroupItem value="salesforce" id="salesforce" />
                                <Label htmlFor="salesforce">Salesforce</Label>
                            </div>
                            <div className="flex gap-2">
                                <RadioGroupItem value="sharepoint" id="sharepoint" />
                                <Label htmlFor="sharepoint">Sharepoint</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {selectedSource === 'salesforce' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="salesforce-objects">Salesforce Object</Label>
                                {objectsLoading ? (
                                    <div className="flex justify-center py-2">  <Spinner /> </div>
                                ) : (
                                    <Select onValueChange={handleObjectSelection} value={selectedObject}>
                                        <SelectTrigger id="salesforce-objects">
                                            <SelectValue placeholder="Select salesforce object" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {salesforceObjects.map((object) => (
                                                <SelectItem value={object.value} key={object.value}>{object.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            {relatedObjects && relatedObjects.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Related Objects</Label>
                                    {relatedObjectsLoading ? (
                                        <div className="flex justify-center py-2">  <Spinner /> </div>
                                    ) : (
                                        <ScrollArea className="h-[200px] border rounded-md p-2">
                                            {relatedObjects.map((obj) => (
                                                <div key={obj.name} className="flex items-center py-1">
                                                    <Checkbox
                                                        id={obj.name}
                                                        checked={selectedRelatedObjects.includes(obj.value)}
                                                        onCheckedChange={() => handleRelatedObjectChange(obj.value)}
                                                    />
                                                    <Label htmlFor={obj.value} className="ml-2 text-sm">
                                                        {obj.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={!selectedObject} onClick={handleStart}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};