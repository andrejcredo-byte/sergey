import React, { useState } from 'react';
import { useStore } from '../../store';
import { Project } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { PROJECT_STATUS_MAP } from '../../lib/constants';
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
  project: Project;
}

export function EditProjectDialog({ project }: Props) {
  const [open, setOpen] = useState(false);
  const { updateProject } = useStore();

  const [formData, setFormData] = useState({
    name: project.name,
    address: project.address,
    description: project.description,
    clientName: project.clientName,
    clientPhone: project.clientPhone || '',
    estimatedBudget: project.estimatedBudget.toString(),
    startDate: project.startDate,
    deadline: project.deadline,
    status: project.status,
    progress: project.progress.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProject(project.id, {
      name: formData.name,
      address: formData.address,
      description: formData.description,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      startDate: formData.startDate,
      deadline: formData.deadline,
      status: formData.status as Project['status'],
      progress: Number(formData.progress),
      estimatedBudget: Number(formData.estimatedBudget),
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" /> Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Редактирование объекта</DialogTitle>
          <DialogDescription>
            Измените основную информацию об объекте.
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
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Адрес *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Имя клиента *</Label>
              <Input
                id="clientName"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Телефон клиента</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              >
                {Object.entries(PROJECT_STATUS_MAP).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Прогресс (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                required
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
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
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Описание / Заметки</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
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
