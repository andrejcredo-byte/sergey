import React, { useState } from 'react';
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
import { Plus } from 'lucide-react';

interface Props {
  projectId?: string;
}

export function AddMaterialDialog({ projectId: defaultProjectId }: Props) {
  const [open, setOpen] = useState(false);
  const { addMaterial, projects, users } = useStore();

  const [formData, setFormData] = useState({
    projectId: defaultProjectId || '',
    name: '',
    category: 'Черновые' as Material['category'],
    quantity: '',
    unit: 'шт',
    pricePerUnit: '',
    supplier: '',
    status: 'to_buy' as Material['status'],
    buyerId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) {
      return;
    }
    
    addMaterial({
      id: Math.random().toString(36).substring(2, 9),
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
    setFormData({
      projectId: defaultProjectId || '',
      name: '',
      category: 'Черновые',
      quantity: '',
      unit: 'шт',
      pricePerUnit: '',
      supplier: '',
      status: 'to_buy',
      buyerId: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus className="mr-2 h-4 w-4" /> Добавить материал
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Новый материал</DialogTitle>
          <DialogDescription>
            Заполните данные для закупки или поставки материала.
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
                disabled={!!defaultProjectId}
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
                placeholder="Гипсокартон Knauf"
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
                placeholder="шт, мешок, м2"
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
                placeholder="Петрович"
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
