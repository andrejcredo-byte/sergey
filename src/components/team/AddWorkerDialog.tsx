import React, { useState } from 'react';
import { useStore } from '../../store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import { User } from '../../types';

export function AddWorkerDialog() {
  const [open, setOpen] = useState(false);
  const { addUser } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    role: 'worker' as User['role'],
    phone: '',
    specialization: '',
    avatar: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addUser({
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      specialization: formData.specialization,
      avatar: formData.avatar || (formData.role === 'worker' ? `https://i.pravatar.cc/150?u=${Math.random()}` : undefined)
    });
    
    setOpen(false);
    setFormData({
      name: '',
      role: 'worker',
      phone: '',
      specialization: '',
      avatar: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus className="mr-2 h-4 w-4" /> Добавить сотрудника
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый сотрудник / партнер</DialogTitle>
          <DialogDescription>
            Добавьте человека или компанию в базу для распределения по объектам.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Тип *</Label>
            <select
              id="role"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
            >
              <option value="worker">Сотрудник / Рабочий</option>
              <option value="partner">Партнер / Подрядчик</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">ФИО / Название *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={formData.role === 'worker' ? "Смирнов Петр" : "ООО СтройПрогресс"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (900) 000-00-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Специализация (отделочник, электрик и т.д.)</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="Монтажник"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Фото (URL - опционально)</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
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
