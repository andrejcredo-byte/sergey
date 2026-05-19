import React, { useState } from 'react';
import { useStore } from '../../store';
import { TransactionType, ExpenseCategory } from '../../types';
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

interface Props {
  type: TransactionType;
  projectId?: string;
}

export function AddTransactionDialog({ type, projectId: defaultProjectId }: Props) {
  const [open, setOpen] = useState(false);
  const { addTransaction, projects, users } = useStore();

  const [formData, setFormData] = useState({
    projectId: defaultProjectId || '',
    amount: '',
    category: 'materials' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0],
    description: '',
    workerId: '',
  });

  const isIncome = type === 'income';
  
  // When category changes, reset workerId if it's not a worker category
  const handleCategoryChange = (val: ExpenseCategory) => {
    setFormData({ 
      ...formData, 
      category: val,
      workerId: (val === 'salary' || val === 'partner') ? formData.workerId : ''
    });
  };

  const selectedProject = projects.find(p => p.id === formData.projectId);
  const teamMembers = users.filter(u => selectedProject?.teamIds.includes(u.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) {
      return;
    }
    
    addTransaction({
      id: Math.random().toString(36).substring(2, 9),
      projectId: formData.projectId,
      amount: Number(formData.amount),
      type,
      category: isIncome ? undefined : formData.category,
      date: formData.date,
      description: formData.description,
      workerId: (formData.category === 'salary' || formData.category === 'partner') ? formData.workerId : undefined,
    });
    
    setOpen(false);
    setFormData({
      projectId: defaultProjectId || '',
      amount: '',
      category: 'materials',
      date: new Date().toISOString().split('T')[0],
      description: '',
      workerId: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isIncome ? (
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
            <Plus className="mr-2 h-4 w-4" /> Добавить приход
          </Button>
        ) : (
          <Button variant="outline" className="text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:text-red-700">
            <Plus className="mr-2 h-4 w-4" /> Добавить расход
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isIncome ? "Новое поступление" : "Новый расход"}</DialogTitle>
          <DialogDescription>
            {isIncome 
              ? "Укажите сумму, полученную от клиента за объект." 
              : "Укажите траты по объекту (материалы, ЗП и т.д.)."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="amount">Сумма (₽) *</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="150000"
            />
          </div>

          {!isIncome && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория *</Label>
                <select
                  id="category"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
                >
                  <option value="materials">Материалы</option>
                  <option value="salary">Зарплата</option>
                  <option value="logistics">Логистика</option>
                  <option value="equipment">Аренда техники / инструменты</option>
                  <option value="partner">Выплата партнеру</option>
                  <option value="other">Прочее</option>
                </select>
              </div>

              {(formData.category === 'salary' || formData.category === 'partner') && (
                <div className="space-y-2">
                  <Label htmlFor="workerId">Сотрудник / Партнер (опционально)</Label>
                  <select
                    id="workerId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.workerId}
                    onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                    disabled={!formData.projectId}
                  >
                    <option value="">Выберите получателя</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role === 'partner' ? 'Партнер' : member.specialization || 'Сотрудник'})
                      </option>
                    ))}
                  </select>
                  {!formData.projectId && (
                    <p className="text-xs text-zinc-500">Сначала выберите объект, чтобы увидеть команду</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Дата *</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание *</Label>
            <Input
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isIncome ? "Предоплата по договору" : "Закупка черновой сантехники"}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" className={isIncome ? "bg-zinc-900 text-white" : "bg-red-600 text-white hover:bg-red-700"}>
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
