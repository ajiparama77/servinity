"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CheckCircle2, Edit2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
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

export default function HolidaysPage() {
  const params = useParams();
  const tenantSlug = params.tenantId as string;

  const [holidays, setHolidays] = useState<{id: string, name: string, date: string, branchId?: string | null, branch?: { name: string } | null}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Add Form states
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [branchId, setBranchId] = useState("");
  const [error, setError] = useState("");

  const [branches, setBranches] = useState<{id: string, name: string}[]>([]);

  // Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editBranchId, setEditBranchId] = useState("");
  const [editError, setEditError] = useState("");

  // Modal states
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", description: "" });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<string | null>(null);

  const fetchHolidays = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/tenants/${tenantSlug}/holidays`);
      if (res.ok) {
        const data = await res.json();
        // format date back to YYYY-MM-DD for UI and inputs
        const formatted = data.map((h: any) => ({
          ...h,
          date: h.date.split('T')[0]
        }));
        setHolidays(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch holidays", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/branches`);
      if (res.ok) {
        const data = await res.json();
        
        // Flatten nested branches so sub-branches appear in the dropdown
        const flattenBranches = (branchesList: any[], prefix = ""): {id: string, name: string}[] => {
          let flat: {id: string, name: string}[] = [];
          branchesList.forEach(b => {
            flat.push({ id: b.id, name: `${prefix}${b.name}` });
            if (b.subBranches && b.subBranches.length > 0) {
              flat = flat.concat(flattenBranches(b.subBranches, `${prefix}${b.name} - `));
            }
          });
          return flat;
        };

        setBranches(flattenBranches(data));
      }
    } catch (error) {
      console.error("Failed to fetch branches", error);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchHolidays();
      fetchBranches();
    }
  }, [tenantSlug]);

  const handleAddHoliday = async () => {
    if (!name.trim() || !date) {
      setError("Please fill in both Holiday Name and Date.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/holidays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          date,
          branchId: branchId || null
        })
      });

      if (res.ok) {
        await fetchHolidays();
        setName("");
        setDate("");
        setBranchId("");
        setError("");
        
        setSuccessMessage({
          title: "Holiday Added!",
          description: "The holiday has been successfully added to your calendar."
        });
        setIsSuccessOpen(true);
      } else {
        setError("Failed to add holiday.");
      }
    } catch (error) {
      setError("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (holiday: { id: string, name: string, date: string, branchId?: string | null }) => {
    setEditId(holiday.id);
    setEditName(holiday.name);
    setEditDate(holiday.date);
    setEditBranchId(holiday.branchId || "");
    setEditError("");
    setIsEditOpen(true);
  };

  const handleEditHoliday = async () => {
    if (!editName.trim() || !editDate) {
      setEditError("Please fill in both Holiday Name and Date.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/holidays/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName.trim(), 
          date: editDate,
          branchId: editBranchId || null
        })
      });

      if (res.ok) {
        await fetchHolidays();
        setIsEditOpen(false);
        
        setSuccessMessage({
          title: "Holiday Updated!",
          description: "The holiday details have been successfully updated."
        });
        setIsSuccessOpen(true);
      } else {
        setEditError("Failed to update holiday.");
      }
    } catch (error) {
      setEditError("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setHolidayToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (holidayToDelete) {
      setIsSaving(true);
      try {
        const res = await fetch(`/api/tenants/${tenantSlug}/holidays/${holidayToDelete}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          await fetchHolidays();
        }
      } catch (error) {
        console.error("Delete error", error);
      } finally {
        setIsSaving(false);
        setHolidayToDelete(null);
        setIsDeleteOpen(false);
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Holidays & Off-Days</h2>
          <p className="text-gray-500 mt-2">Manage days when your business is closed.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Holiday</CardTitle>
          <CardDescription>Appointments cannot be booked on these days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="holidayName">Holiday Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="holidayName" 
                  placeholder="e.g. Independence Day" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="holidayDate">Date <span className="text-red-500">*</span></Label>
                <Input 
                  id="holidayDate" 
                  type="date" 
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="branchSelect">Applicable Branch</Label>
                <select 
                  id="branchSelect"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                >
                  <option value="">All Branches (Global)</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddHoliday} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 gap-2 mb-[2px]">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Add Holiday
              </Button>
            </div>
            {error && (
              <p className="text-sm font-medium text-red-500 mt-1">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Holidays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Holiday Name</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Applicable Branch</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      <Loader2 className="animate-spin mx-auto text-gray-400" size={24} />
                      <p className="mt-2 text-sm">Loading holidays...</p>
                    </td>
                  </tr>
                ) : holidays.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No upcoming holidays.
                    </td>
                  </tr>
                ) : (
                  holidays.map((h) => (
                    <tr key={h.id} className="border-b last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{h.name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(h.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {h.branchId ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                            {/* @ts-ignore */}
                            {h.branch?.name || "Specific Branch"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                            All Branches
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <Button onClick={() => openEdit(h)} variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                          <Edit2 size={16} />
                        </Button>
                        <Button onClick={() => confirmDelete(h.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Holiday</DialogTitle>
            <DialogDescription>
              Update the details of this holiday.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editHolidayName">Holiday Name <span className="text-red-500">*</span></Label>
              <Input 
                id="editHolidayName" 
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  if (editError) setEditError("");
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editHolidayDate">Date <span className="text-red-500">*</span></Label>
              <Input 
                id="editHolidayDate" 
                type="date" 
                value={editDate}
                onChange={(e) => {
                  setEditDate(e.target.value);
                  if (editError) setEditError("");
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBranchSelect">Applicable Branch</Label>
              <select 
                id="editBranchSelect"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editBranchId}
                onChange={(e) => setEditBranchId(e.target.value)}
              >
                <option value="">All Branches (Global)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            {editError && (
              <p className="text-sm font-medium text-red-500">{editError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleEditHoliday} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center pt-8 pb-6 px-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl text-center">{successMessage.title}</DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              {successMessage.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6 w-full">
            <Button onClick={() => setIsSuccessOpen(false)} className="w-full bg-blue-600 hover:bg-blue-700">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the holiday from your calendar. Appointments might become available on this date again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
              {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
