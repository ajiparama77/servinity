"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, MapPin, X } from "lucide-react";

type DailySchedule = {
  day: string;
  start: string;
  end: string;
  closed: boolean;
};

// Mock data type
type Branch = {
  id: string;
  name: string;
  address: string;
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

const INITIAL_DATA: Branch[] = [
  {
    id: 'm1',
    name: 'HQ Jakarta',
    address: 'Sudirman Central Business District, Jakarta',
    schedule: DEFAULT_SCHEDULE,
    subBranches: [
      { id: 's1', name: 'Cabang Kebayoran', address: 'Jl. Senopati, Kebayoran Baru', schedule: DEFAULT_SCHEDULE },
      { id: 's2', name: 'Cabang Kemang', address: 'Jl. Kemang Raya', schedule: DEFAULT_SCHEDULE }
    ]
  },
  {
    id: 'm2',
    name: 'Regional Bandung',
    address: 'Jl. Braga No. 12, Bandung',
    schedule: DEFAULT_SCHEDULE,
    subBranches: [
      { id: 's3', name: 'Cabang Dago', address: 'Jl. Ir. H. Djuanda', schedule: DEFAULT_SCHEDULE }
    ]
  },
  {
    id: 'm3',
    name: 'Regional Surabaya',
    address: 'Jl. Tunjungan Plaza, Surabaya',
    schedule: DEFAULT_SCHEDULE,
    subBranches: []
  }
];

// Modal UI Component - Moved outside to prevent re-mounting glitch on every render
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
  const [locations, setLocations] = useState<Branch[]>(INITIAL_DATA);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'm1': true
  });

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [formMode, setFormMode] = useState<'add-master' | 'add-sub' | 'edit-master' | 'edit-sub'>('add-master');
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', address: '', schedule: DEFAULT_SCHEDULE });

  const [deletingType, setDeletingType] = useState<'master' | 'sub' | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);
  const [deletingMasterId, setDeletingMasterId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open Actions
  const openAddMaster = () => {
    setFormMode('add-master');
    setFormData({ name: '', address: '', schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)) });
    setIsFormOpen(true);
  };

  const openAddSub = (masterId: string) => {
    setFormMode('add-sub');
    setSelectedMasterId(masterId);
    setFormData({ name: '', address: '', schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)) });
    setIsFormOpen(true);
  };

  const openEditMaster = (master: Branch) => {
    setFormMode('edit-master');
    setEditingBranchId(master.id);
    setFormData({ name: master.name, address: master.address, schedule: JSON.parse(JSON.stringify(master.schedule || DEFAULT_SCHEDULE)) });
    setIsFormOpen(true);
  };

  const openEditSub = (sub: any, masterId: string) => {
    setFormMode('edit-sub');
    setEditingBranchId(sub.id);
    setSelectedMasterId(masterId);
    setFormData({ name: sub.name, address: sub.address, schedule: JSON.parse(JSON.stringify(sub.schedule || DEFAULT_SCHEDULE)) });
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
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    const newBranch = { id, name: formData.name, address: formData.address, schedule: formData.schedule };
    
    if (formMode === 'add-master') {
      setLocations([...locations, { ...newBranch, subBranches: [] }]);
      setExpanded(prev => ({ ...prev, [id]: true }));
    } else if (formMode === 'add-sub' && selectedMasterId) {
      setLocations(locations.map(master => 
        master.id === selectedMasterId 
          ? { ...master, subBranches: [...master.subBranches, newBranch] }
          : master
      ));
      setExpanded(prev => ({ ...prev, [selectedMasterId]: true }));
    } else if (formMode === 'edit-master') {
      setLocations(locations.map(master => 
        master.id === editingBranchId ? { ...master, name: formData.name, address: formData.address, schedule: formData.schedule } : master
      ));
    } else if (formMode === 'edit-sub' && selectedMasterId) {
      setLocations(locations.map(master => {
        if (master.id === selectedMasterId) {
          return {
            ...master,
            subBranches: master.subBranches.map(sub => 
              sub.id === editingBranchId ? { ...sub, name: formData.name, address: formData.address, schedule: formData.schedule } : sub
            )
          };
        }
        return master;
      }));
    }
    
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingType === 'master') {
      setLocations(locations.filter(m => m.id !== deletingBranchId));
    } else if (deletingType === 'sub' && deletingMasterId) {
      setLocations(locations.map(m => {
        if (m.id === deletingMasterId) {
          return { ...m, subBranches: m.subBranches.filter(s => s.id !== deletingBranchId) };
        }
        return m;
      }));
    }
    setIsDeleteOpen(false);
  };

  const getFormTitle = () => {
    if (formMode === 'add-master') return 'Add Master Branch';
    if (formMode === 'add-sub') return 'Add Sub-branch';
    if (formMode === 'edit-master') return 'Edit Master Branch';
    return 'Edit Sub-branch';
  };

  return (
    <div className="max-w-5xl space-y-8">
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
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <MapPin size={14} />
                      {master.address}
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
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                              <MapPin size={14} />
                              {sub.address}
                            </p>
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
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" className="bg-red-600 text-white hover:bg-red-700 hover:text-white" onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
