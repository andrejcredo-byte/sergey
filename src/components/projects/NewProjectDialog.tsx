import React, { useState } from 'react';
import { useStore } from '../../store';
import { Project } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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

export function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const { addProject } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    clientName: '',
    clientPhone: '',
    estimatedBudget: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      address: formData.address,
      description: formData.description,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      startDate: formData.startDate,
      deadline: formData.deadline,
      status: 'new',
      progress: 0,
      estimatedBudget: Number(formData.estimatedBudget),
      totalIncome: 0,
      totalExpense: 0,
      createdAt: new Date().toISOString(),
      teamIds: [],
      stages: [],
      documents: [],
    };

    addProject(newProject);
    setOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      address: '',
      description: '',
      clientName: '',
      clientPhone: '',
      estimatedBudget: '',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus className="mr-2 h-4 w-4" /> Новый объект
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Новый объект</DialogTitle>
          <DialogDescription>
            Заполните основную информацию о новом строительном объекте.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Название объекта *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: ЖК Сердце Столицы, кв. 104"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Адрес *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Город, улица, дом"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Имя клиента *</Label>
              <Input
                id="clientName"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Телефон клиента</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+7 (999) 000-00-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Дата начала *</Label>
              <Input
                id="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Дедлайн *</Label>
              <Input
                id="deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="estimatedBudget">Смета (План бюджета, ₽) *</Label>
              <Input
                id="estimatedBudget"
                type="number"
                min="0"
                required
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                placeholder="5000000"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Описание / Заметки</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание работ"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" className="bg-zinc-900 text-white">
              Создать объект
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
