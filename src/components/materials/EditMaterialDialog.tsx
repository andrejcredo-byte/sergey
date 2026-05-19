import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Material } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MATERIAL_STATUS_MAP } from '../../lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Edit } from 'lucide-react';

interface Props {
  material: Material;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditMaterialDialog({ material, trigger, open: externalOpen, onOpenChange: externalOnOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = externalOpen !== undefined && externalOnOpenChange !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange : setInternalOpen;
  const { updateMaterial, projects, users } = useStore();

  const [formData, setFormData] = useState({
    projectId: material.projectId,
    name: material.name,
    category: material.category,
    quantity: material.quantity.toString(),
    unit: material.unit,
    pricePerUnit: material.pricePerUnit?.toString() || '',
    supplier: material.supplier || '',
    status: material.status,
    buyerId: material.buyerId || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        projectId: material.projectId,
        name: material.name,
        category: material.category,
        quantity: material.quantity.toString(),
        unit: material.unit,
        pricePerUnit: material.pricePerUnit?.toString() || '',
        supplier: material.supplier || '',
        status: material.status,
        buyerId: material.buyerId || '',
      });
    }
  }, [open, material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) {
      return;
    }
    
    updateMaterial(material.id, {
      projectId: formData.projectId,
      name: formData.name,
      category: formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      pricePerUnit: formData.pricePerUnit ? Number(formData.pricePerUnit) : undefined,
      totalPrice: formData.pricePerUnit && formData.quantity ? Number(formData.pricePerUnit) * Number(formData.quantity) : 0,
      supplier: formData.supplier || undefined,
      status: formData.status,
      buyerId: formData.buyerId || undefined,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger ? trigger : (
            <Button variant="outline" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" title="Изменить">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Редактировать материал</DialogTitle>
          <DialogDescription>
            Внесите изменения в позицию снабжения.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="projectId">Объект *</Label>
              <select
                id="projectId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="" disabled>Выберите объект</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Наименование *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <select
                id="category"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Material['category'] })}
              >
                <option value="Черновые">Черновые</option>
                <option value="Чистовые">Чистовые</option>
                <option value="Электрика">Электрика</option>
                <option value="Сантехника">Сантехника</option>
                <option value="Инструменты">Инструменты</option>
                <option value="Расходники">Расходники</option>
                <option value="Прочее">Прочее</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Material['status'] })}
              >
                {Object.entries(MATERIAL_STATUS_MAP).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Количество *</Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Ед. изм. *</Label>
              <Input
                id="unit"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerUnit">Цена за ед. (₽)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Поставщик</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="buyerId">Ответственный за закупку</Label>
              <select
                id="buyerId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.buyerId}
                onChange={(e) => setFormData({ ...formData, buyerId: e.target.value })}
              >
                <option value="">Не назначен</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" className="bg-zinc-900 text-white">
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
