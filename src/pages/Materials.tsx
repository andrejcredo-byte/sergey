import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PackageOpen, Search } from 'lucide-react';
import { AddMaterialDialog } from '../components/materials/AddMaterialDialog';
import { EditMaterialDialog } from '../components/materials/EditMaterialDialog';
import { MATERIAL_STATUS_MAP } from '../lib/constants';
import { formatCurrency, formatDate } from '../lib/utils';
import { Material } from '../types';

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
          <p className="text-sm text-zinc-500">Контроль поставок на объекты</p>
        </div>
        <AddMaterialDialog />
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 bg-zinc-50 border-b border-zinc-100 uppercase">
                <tr>
                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Наименование</th>
                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Объект</th>
                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Кол-во</th>
                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Сумма</th>
                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Статус</th>
                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Ответственный</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 sm:px-6 py-12 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                          <PackageOpen className="h-6 w-6 text-zinc-400" />
                        </div>
                        <p>Нет материалов по заданным фильтрам</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map(m => {
                    const project = projects.find(p => p.id === m.projectId);
                    const buyer = users.find(u => u.id === m.buyerId);
                    const statusInfo = MATERIAL_STATUS_MAP[m.status];
                    return (
                      <tr 
                        key={m.id} 
                        className="hover:bg-zinc-50 cursor-pointer group relative"
                        onClick={() => setEditingMaterial(m)}
                      >
                        <td className="px-4 sm:px-6 py-4 min-w-[200px]">
                          <div className="font-medium text-zinc-900">{m.name}</div>
                          <div className="text-xs text-zinc-500">{m.category} {m.supplier ? `• ${m.supplier}` : ''}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{project?.name || 'Неизвестный объект'}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{m.quantity} {m.unit}</td>
                        <td className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">
                          {m.totalPrice ? formatCurrency(m.totalPrice) : '-'}
                          {m.pricePerUnit && <div className="text-xs text-zinc-500 font-normal">{formatCurrency(m.pricePerUnit)} / {m.unit}</div>}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-zinc-500 relative whitespace-nowrap">
                          <div className="pr-12">{buyer?.name || '-'}</div>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMaterial(m.id);
                              }}
                              className="bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center h-8 w-8 rounded-md transition-colors border border-red-100 opacity-0 lg:group-hover:opacity-100 lg:transition-opacity"
                              title="Удалить"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
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
