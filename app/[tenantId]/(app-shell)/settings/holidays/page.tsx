"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CheckCircle2, Edit2 } from "lucide-react";
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
  const [holidays, setHolidays] = useState([
    { id: 1, name: "New Year's Day", date: "2024-01-01" },
    { id: 2, name: "Eid al-Fitr", date: "2024-04-10" },
    { id: 3, name: "Christmas Day", date: "2024-12-25" },
  ]);

  // Add Form states
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  // Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editError, setEditError] = useState("");

  // Modal states
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", description: "" });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<number | null>(null);

  const handleAddHoliday = () => {
    // Validation
    if (!name.trim() || !date) {
      setError("Please fill in both Holiday Name and Date.");
      return;
    }

    // Add holiday
    const newHoliday = {
      id: Date.now(),
      name: name.trim(),
      date,
    };

    const updatedHolidays = [...holidays, newHoliday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setHolidays(updatedHolidays);
    setName("");
    setDate("");
    setError("");
    
    setSuccessMessage({
      title: "Holiday Added!",
      description: "The holiday has been successfully added to your calendar."
    });
    setIsSuccessOpen(true);
  };

  const openEdit = (holiday: { id: number, name: string, date: string }) => {
    setEditId(holiday.id);
    setEditName(holiday.name);
    setEditDate(holiday.date);
    setEditError("");
    setIsEditOpen(true);
  };

  const handleEditHoliday = () => {
    if (!editName.trim() || !editDate) {
      setEditError("Please fill in both Holiday Name and Date.");
      return;
    }

    const updatedHolidays = holidays.map(h => {
      if (h.id === editId) {
        return { ...h, name: editName.trim(), date: editDate };
      }
      return h;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setHolidays(updatedHolidays);
    setIsEditOpen(false);
    
    setSuccessMessage({
      title: "Holiday Updated!",
      description: "The holiday details have been successfully updated."
    });
    setIsSuccessOpen(true);
  };

  const confirmDelete = (id: number) => {
    setHolidayToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (holidayToDelete !== null) {
      setHolidays(holidays.filter(h => h.id !== holidayToDelete));
      setHolidayToDelete(null);
    }
    setIsDeleteOpen(false);
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
              <Button onClick={handleAddHoliday} className="bg-blue-600 hover:bg-blue-700 gap-2 mb-[2px]">
                <Plus size={18} />
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
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No holidays added yet.
                    </td>
                  </tr>
                )}
                {holidays.map((h) => (
                  <tr key={h.id} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{h.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(h.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                ))}
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
            {editError && (
              <p className="text-sm font-medium text-red-500">{editError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditHoliday} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
