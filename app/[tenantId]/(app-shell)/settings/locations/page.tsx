"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, MapPin, Phone, X, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

type DailySchedule = {
  day: string;
  start: string;
  end: string;
  closed: boolean;
};

type Branch = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  schedule: DailySchedule[];
  subBranches: Omit<Branch, 'subBranches'>[];
};

const DEFAULT_SCHEDULE: DailySchedule[] = [
  { day: 'Monday', start: '09:00', end: '17:00', closed: false },
  { day: 'Tuesday', start: '09:00', end: '17:00', closed: false },
  { day: 'Wednesday', start: '09:00', end: '17:00', closed: false },
  { day: 'Thursday', start: '09:00', end: '17:00', closed: false },
  { day: 'Friday', start: '09:00', end: '17:00', closed: false },
  { day: 'Saturday', start: '09:00', end: '17:00', closed: true },
  { day: 'Sunday', start: '09:00', end: '17:00', closed: true },
];

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, maxWidth?: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function LocationsPage() {
  const params = useParams();
  const tenantSlug = params.tenantId as string;

  const [locations, setLocations] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [formMode, setFormMode] = useState<'add-master' | 'add-sub' | 'edit-master' | 'edit-sub'>('add-master');
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', address: '', phone: '', schedule: DEFAULT_SCHEDULE });

  const [deletingType, setDeletingType] = useState<'master' | 'sub' | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);
  const [deletingMasterId, setDeletingMasterId] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/branches`);
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
        
        // Auto-expand first branch if loaded
        if (data.length > 0 && Object.keys(expanded).length === 0) {
          setExpanded({ [data[0].id]: true });
        }
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) fetchLocations();
  }, [tenantSlug]);

  const toggleAccordion = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open Actions
  const openAddMaster = () => {
    setFormMode('add-master');
    setFormData({ name: '', address: '', phone: '', schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)) });
    setIsFormOpen(true);
  };

  const openAddSub = (masterId: string) => {
    setFormMode('add-sub');
    setSelectedMasterId(masterId);
    setFormData({ name: '', address: '', phone: '', schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)) });
    setIsFormOpen(true);
  };

  const openEditMaster = (master: Branch) => {
    setFormMode('edit-master');
    setEditingBranchId(master.id);
    setFormData({ name: master.name, address: master.address || '', phone: master.phone || '', schedule: JSON.parse(JSON.stringify(master.schedule || DEFAULT_SCHEDULE)) });
    setIsFormOpen(true);
  };

  const openEditSub = (sub: any, masterId: string) => {
    setFormMode('edit-sub');
    setEditingBranchId(sub.id);
    setSelectedMasterId(masterId);
    setFormData({ name: sub.name, address: sub.address || '', phone: sub.phone || '', schedule: JSON.parse(JSON.stringify(sub.schedule || DEFAULT_SCHEDULE)) });
    setIsFormOpen(true);
  };

  const openDeleteMaster = (masterId: string) => {
    setDeletingType('master');
    setDeletingBranchId(masterId);
    setIsDeleteOpen(true);
  };

  const openDeleteSub = (subId: string, masterId: string) => {
    setDeletingType('sub');
    setDeletingBranchId(subId);
    setDeletingMasterId(masterId);
    setIsDeleteOpen(true);
  };

  // Handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const isEdit = formMode.includes('edit');
      const method = isEdit ? 'PUT' : 'POST';
      const endpoint = isEdit 
        ? `/api/tenants/${tenantSlug}/branches/${editingBranchId}`
        : `/api/tenants/${tenantSlug}/branches`;

      const payload = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        schedule: formData.schedule,
        parentId: formMode === 'add-sub' ? selectedMasterId : null
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchLocations();
        setIsFormOpen(false);
      } else {
        alert("Failed to save branch");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving branch");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBranchId) return;
    setIsSaving(true);
    
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/branches/${deletingBranchId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchLocations();
        setIsDeleteOpen(false);
      } else {
        alert("Failed to delete branch");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting branch");
    } finally {
      setIsSaving(false);
    }
  };

  const getFormTitle = () => {
    if (formMode === 'add-master') return 'Add Master Branch';
    if (formMode === 'add-sub') return 'Add Sub-branch';
    if (formMode === 'edit-master') return 'Edit Master Branch';
    return 'Edit Sub-branch';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Locations & Branches</h2>
          <p className="text-gray-500 mt-2">Manage your master branches and their respective sub-branches.</p>
        </div>
        <Button onClick={openAddMaster} className="bg-blue-600 hover:bg-blue-700 gap-2 shrink-0">
          <Plus size={18} />
          Add Master Branch
        </Button>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {locations.map((master) => {
          const isExpanded = !!expanded[master.id];
          return (
            <div key={master.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200">
              
              {/* Accordion Header (Master Branch) */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-gray-50 cursor-pointer transition-colors gap-4 group/master"
                onClick={() => toggleAccordion(master.id)}
              >
                {/* Left Section: Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{master.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                        Master
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium whitespace-nowrap">
                        {master.subBranches.length} Sub-branch{master.subBranches.length !== 1 && 'es'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {master.address}
                      </span>
                      {master.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} />
                          {master.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-2 md:pl-4 opacity-100 sm:opacity-0 sm:group-hover/master:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <Button onClick={() => openAddSub(master.id)} variant="outline" size="sm" className="h-9 gap-1.5 border-dashed border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50">
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Sub-branch</span>
                  </Button>
                  <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
                  <Button onClick={() => openEditMaster(master)} variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                    <Edit2 size={16} />
                  </Button>
                  <Button onClick={() => openDeleteMaster(master.id)} variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Accordion Body (Sub-branches) */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 md:p-6">
                  {master.subBranches.length > 0 ? (
                    <div className="space-y-3 pl-4 md:pl-12 border-l-2 border-gray-200 ml-2 md:ml-6 relative">
                      {master.subBranches.map((sub) => (
                        <div key={sub.id} className="relative group bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Connector Line */}
                          <div className="absolute top-1/2 -left-4 md:-left-12 w-4 md:w-12 h-px bg-gray-200"></div>

                          <div>
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              {sub.name}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {sub.address}
                              </span>
                              {sub.phone && (
                                <span className="flex items-center gap-1.5">
                                  <Phone size={14} />
                                  {sub.phone}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button onClick={() => openEditSub(sub, master.id)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                              <Edit2 size={14} />
                            </Button>
                            <Button onClick={() => openDeleteSub(sub.id, master.id)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 px-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <MapPin size={24} />
                      </div>
                      <p className="text-gray-500 mb-4">No sub-branches have been added yet.</p>
                      <Button onClick={() => openAddSub(master.id)} variant="outline" className="gap-2 border-gray-300">
                        <Plus size={16} />
                        Add your first sub-branch
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {locations.length === 0 && (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first master branch.</p>
              <Button onClick={openAddMaster} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus size={18} />
                Add Master Branch
              </Button>
           </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={getFormTitle()} maxWidth="max-w-2xl">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input 
                id="branchName" 
                placeholder="e.g. HQ Sudirman" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="e.g. 021-123456" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Full Address</Label>
              <Input 
                id="address" 
                placeholder="e.g. SCBD Jakarta" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Operating Hours (Mon - Sun)</Label>
            <div className="border rounded-lg divide-y bg-gray-50/30">
              {formData.schedule.map((dayData, index) => (
                <div key={dayData.day} className={`flex items-center justify-between p-3 gap-4 transition-colors ${dayData.closed ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                  <div className="w-24 font-medium text-sm text-gray-700">{dayData.day}</div>
                  
                  <div className="flex items-center gap-2 flex-1 max-w-[280px]">
                    <Input 
                      type="time" 
                      value={dayData.start} 
                      disabled={dayData.closed}
                      onChange={(e) => {
                        const newSchedule = [...formData.schedule];
                        newSchedule[index].start = e.target.value;
                        setFormData({...formData, schedule: newSchedule});
                      }}
                      className="h-9"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <Input 
                      type="time" 
                      value={dayData.end} 
                      disabled={dayData.closed}
                      onChange={(e) => {
                        const newSchedule = [...formData.schedule];
                        newSchedule[index].end = e.target.value;
                        setFormData({...formData, schedule: newSchedule});
                      }}
                      className="h-9"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-20 justify-end">
                    <input 
                      type="checkbox" 
                      id={`closed-${index}`}
                      checked={dayData.closed}
                      onChange={(e) => {
                        const newSchedule = [...formData.schedule];
                        newSchedule[index].closed = e.target.checked;
                        setFormData({...formData, schedule: newSchedule});
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <Label htmlFor={`closed-${index}`} className="text-sm font-normal text-gray-600 cursor-pointer mb-0">Closed</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Branch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this {deletingType === 'master' ? 'Master Branch' : 'Sub-branch'}?
            {deletingType === 'master' && " All sub-branches inside it will also be removed."}
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" className="bg-red-600 text-white hover:bg-red-700 hover:text-white" onClick={handleDeleteConfirm} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
