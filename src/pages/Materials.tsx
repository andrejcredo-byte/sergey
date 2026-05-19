import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, CardContent } from '../components/ui/card';
import { Search } from 'lucide-react';
import { AddMaterialDialog } from '../components/materials/AddMaterialDialog';
import { EditMaterialDialog } from '../components/materials/EditMaterialDialog';
import { MATERIAL_STATUS_MAP } from '../lib/constants';
import { formatCurrency } from '../lib/utils';
import { Material } from '../types';
import { MaterialList } from '../components/materials/MaterialList';

export function Materials() {
  const { materials, projects, users, deleteMaterial } = useStore();
  const [projectIdFilter, setProjectIdFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const filteredMaterials = materials.filter(m => {
    if (projectIdFilter !== 'all' && m.projectId !== projectIdFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  const aggregateAmount = filteredMaterials.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Закупки и материалы</h1>
          <p className="text-sm text-zinc-500 mt-1">Контроль поставок на объекты</p>
        </div>
        <div className="w-full sm:w-auto">
          <AddMaterialDialog />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-white p-2 sm:p-3 rounded-xl border">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select 
            className="flex h-10 w-full sm:w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={projectIdFilter}
            onChange={(e) => setProjectIdFilter(e.target.value)}
          >
            <option value="all">Все объекты</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select 
            className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            {Object.entries(MATERIAL_STATUS_MAP).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        <div className="text-sm font-medium pr-4">
          Общая сумма: {formatCurrency(aggregateAmount)}
        </div>
      </div>

      <Card>
        <CardContent className="p-0 pb-4">
          <MaterialList 
            materials={filteredMaterials}
            projects={projects}
            users={users}
            onEditClick={setEditingMaterial}
          />
        </CardContent>
      </Card>
      
      {editingMaterial && (
        <EditMaterialDialog 
          material={editingMaterial}
          open={!!editingMaterial}
          onOpenChange={(open) => !open && setEditingMaterial(null)}
        />
      )}
    </div>
  );
}
