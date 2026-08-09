"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Briefcase, Edit2, Plus, Trash2, Tag, ChevronRight } from "lucide-react";

type Profession = {
  id: string;
  businessTemplateId: string;
  professionCode: string;
  professionName: string;
};

type Template = {
  id: string;
  name: string;
  description: string | null;
  templateProfessions: Profession[];
};

export default function TemplatesClient({ initialTemplates }: { initialTemplates: Template[] }) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(initialTemplates[0] || null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
  const [professionNameInput, setProfessionNameInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Add/Edit handler
  const handleSaveProfession = async () => {
    if (!selectedTemplate) return;
    if (!professionNameInput.trim()) return;

    setIsSaving(true);
    try {
      if (editingProfession) {
        // Update
        const res = await fetch(`/api/admin/templates/${selectedTemplate.id}/professions/${editingProfession.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professionName: professionNameInput }),
        });
        
        if (res.ok) {
          const updatedProf = await res.json();
          updateProfessionInState(selectedTemplate.id, updatedProf, "update");
          closeModal();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update");
        }
      } else {
        // Create
        const res = await fetch(`/api/admin/templates/${selectedTemplate.id}/professions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professionName: professionNameInput }),
        });
        
        if (res.ok) {
          const newProf = await res.json();
          updateProfessionInState(selectedTemplate.id, newProf, "add");
          closeModal();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to create");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const handleDeleteProfession = async (professionId: string) => {
    if (!selectedTemplate) return;
    if (!confirm("Are you sure you want to delete this profession?")) return;

    try {
      const res = await fetch(`/api/admin/templates/${selectedTemplate.id}/professions/${professionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        updateProfessionInState(selectedTemplate.id, { id: professionId } as Profession, "delete");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // Helper to update local state without full reload
  const updateProfessionInState = (templateId: string, profession: Profession, action: "add" | "update" | "delete") => {
    setTemplates((prev) => prev.map(t => {
      if (t.id !== templateId) return t;

      let newProfessions = [...t.templateProfessions];
      if (action === "add") {
        newProfessions.push(profession);
      } else if (action === "update") {
        newProfessions = newProfessions.map(p => p.id === profession.id ? profession : p);
      } else if (action === "delete") {
        newProfessions = newProfessions.filter(p => p.id !== profession.id);
      }

      // Keep it sorted
      newProfessions.sort((a, b) => a.professionName.localeCompare(b.professionName));

      const updatedTemplate = { ...t, templateProfessions: newProfessions };
      
      // Also update selected template if it's the one currently open
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(updatedTemplate);
      }

      return updatedTemplate;
    }));
  };

  const openAddModal = () => {
    setEditingProfession(null);
    setProfessionNameInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (prof: Profession) => {
    setEditingProfession(prof);
    setProfessionNameInput(prof.professionName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProfession(null);
    setProfessionNameInput("");
  };

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Templates & Roles</h1>
        <p className="text-slate-500 mt-1 mb-6">Manage business templates and their associated professions.</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left column: Templates List */}
        <div className="w-1/3 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Briefcase size={18} className="text-blue-500" />
              Business Templates
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                  selectedTemplate?.id === t.id 
                    ? "bg-blue-50 border border-blue-200" 
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div>
                  <h3 className={`font-semibold text-sm ${selectedTemplate?.id === t.id ? 'text-blue-700' : 'text-slate-700'}`}>
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.templateProfessions.length} Professions</p>
                </div>
                <ChevronRight size={16} className={selectedTemplate?.id === t.id ? 'text-blue-500' : 'text-slate-300'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Professions List */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {selectedTemplate ? (
            <>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Tag size={18} className="text-indigo-500" />
                    Professions in {selectedTemplate.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">These roles will be available for staff creation in this business type.</p>
                </div>
                <Button onClick={openAddModal} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus size={16} className="mr-1" /> Add Profession
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {selectedTemplate.templateProfessions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Tag size={48} className="mb-4 opacity-20" />
                    <p>No professions defined yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTemplate.templateProfessions.map((prof) => (
                      <div key={prof.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-200 hover:shadow-sm transition-all group flex justify-between items-start bg-white">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{prof.professionName}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-1 bg-slate-100 inline-block px-1.5 py-0.5 rounded">{prof.professionCode}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => openEditModal(prof)}>
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProfession(prof.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Select a business template to view its professions.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProfession ? 'Edit Profession' : 'Add New Profession'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Profession Name
              </label>
              <Input
                id="name"
                placeholder="e.g. Senior Stylist"
                value={professionNameInput}
                onChange={(e) => setProfessionNameInput(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-slate-500">
                The code will be automatically generated (e.g. SENIOR_STYLIST).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSaveProfession} disabled={isSaving || !professionNameInput.trim()}>
              {isSaving ? "Saving..." : "Save Profession"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
