"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Save, X, Link2, AlertTriangle } from "lucide-react";
import { useDiagram } from "@/providers/DiagramContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const RelationshipList = () => {
  const { relationships, tables, updateRelationship, removeRelationship } =
    useDiagram();
  const [editingRelationship, setEditingRelationship] = useState<{
    id: string | null;
    draft: Partial<(typeof relationships)[0]>;
  }>({
    id: null,
    draft: {},
  });
  const [deletingRelationshipId, setDeletingRelationshipId] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  const startEditing = (relationship: (typeof relationships)[0]) => {
    setEditingRelationship({
      id: relationship.id,
      draft: { ...relationship },
    });
  };

  const handleUpdateDraft = (updates: Partial<(typeof relationships)[0]>) => {
    setEditingRelationship((prev) => ({
      ...prev,
      draft: { ...prev.draft, ...updates },
    }));
  };

  const saveRelationship = () => {
    if (editingRelationship.id) {
      updateRelationship(editingRelationship.id, editingRelationship.draft);
      setEditingRelationship({ id: null, draft: {} });
    }
  };

  const cancelEditing = () => {
    setEditingRelationship({ id: null, draft: {} });
  };

  const confirmDelete = (relationshipId: string) => {
    removeRelationship(relationshipId);
    setDeletingRelationshipId(null);
    toast({
      title: "Delete",
      description: "deleted sucessfully",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b">
        <CardTitle className="flex items-center">
          <Link2 className="mr-3 text-gray-600 dark:text-white" size={24} />
          Relationships
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion
          type="single"
          collapsible
          className="w-full divide-y divide-gray-100"
        >
          {relationships.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No relationships defined yet
            </div>
          ) : (
            relationships.map((relationship) => (
              <React.Fragment key={relationship.id}>
                <AlertDialog
                  open={deletingRelationshipId === relationship.id}
                  onOpenChange={() => setDeletingRelationshipId(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center">
                        <AlertTriangle
                          className="mr-2 text-yellow-500"
                          size={24}
                        />
                        Delete Relationship
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the relationship &quot;
                        {relationship.name}&quot;? This action cannot be undone
                        and may affect your database schema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => confirmDelete(relationship.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AccordionItem
                  value={relationship.id}
                  className="hover:bg-gray-50 dark:hover:bg-black transition-colors"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <Link2 size={16} className="text-gray-500" />
                      <span>{relationship.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {editingRelationship.id === relationship.id ? (
                      <div className="space-y-4 p-2 bg-gray-50 dark:bg-gray-950 rounded-md">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Relationship Name
                          </label>
                          <Input
                            value={
                              editingRelationship.draft.name ||
                              relationship.name
                            }
                            onChange={(e) =>
                              handleUpdateDraft({ name: e.target.value })
                            }
                            placeholder="Relationship name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Relationship Type
                          </label>
                          <Select
                            value={
                              editingRelationship.draft.type ||
                              relationship.type
                            }
                            onValueChange={(value) =>
                              handleUpdateDraft({ type: value as any })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Relationship type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one-to-one">
                                One-to-One
                              </SelectItem>
                              <SelectItem value="one-to-many">
                                One-to-Many
                              </SelectItem>
                              <SelectItem value="many-to-many">
                                Many-to-Many
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Source Table
                          </label>
                          <Select
                            value={
                              editingRelationship.draft.sourceTableId ||
                              relationship.sourceTableId
                            }
                            onValueChange={(value) =>
                              handleUpdateDraft({ sourceTableId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Source table" />
                            </SelectTrigger>
                            <SelectContent>
                              {tables.map((table: any) => (
                                <SelectItem key={table.id} value={table.id}>
                                  {table.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Target Table
                          </label>
                          <Select
                            value={
                              editingRelationship.draft.targetTableId ||
                              relationship.targetTableId
                            }
                            onValueChange={(value) =>
                              handleUpdateDraft({ targetTableId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Target table" />
                            </SelectTrigger>
                            <SelectContent>
                              {tables.map((table: any) => (
                                <SelectItem key={table.id} value={table.id}>
                                  {table.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={cancelEditing}>
                            <X size={16} className="mr-2" /> Cancel
                          </Button>
                          <Button onClick={saveRelationship}>
                            <Save size={16} className="mr-2" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Type:</div>
                          <div className="font-medium">{relationship.type}</div>

                          <div className="text-gray-600">Source:</div>
                          <div className="font-medium">
                            {
                              tables.find(
                                (t: { id: any }) =>
                                  t.id === relationship.sourceTableId
                              )?.name
                            }
                          </div>

                          <div className="text-gray-600">Target:</div>
                          <div className="font-medium">
                            {
                              tables.find(
                                (t: { id: any }) =>
                                  t.id === relationship.targetTableId
                              )?.name
                            }
                          </div>
                        </div>

                        <div className="flex space-x-2 border-t pt-2 mt-2">
                          <Button
                            onClick={() => startEditing(relationship)}
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Pencil size={16} className="mr-2" /> Edit
                          </Button>
                          <Button
                            onClick={() =>
                              setDeletingRelationshipId(relationship.id)
                            }
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Trash size={16} className="mr-2" /> Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </React.Fragment>
            ))
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default RelationshipList;
