import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Transaction, ExpenseCategory } from '../../types';
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
} from '../ui/dialog';
import { Trash2 } from 'lucide-react';

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({ transaction, open, onOpenChange }: Props) {
  const { updateTransaction, deleteTransaction, projects, users } = useStore();

  const [formData, setFormData] = useState({
    projectId: '',
    amount: '',
    category: 'materials' as ExpenseCategory,
    date: '',
    description: '',
    workerId: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        projectId: transaction.projectId,
        amount: String(transaction.amount),
        category: (transaction.category || 'materials') as ExpenseCategory,
        date: transaction.date,
        description: transaction.description || '',
        workerId: transaction.workerId || '',
      });
    }
  }, [transaction]);

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

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
    if (!formData.projectId) return;

    updateTransaction(transaction.id, {
      projectId: formData.projectId,
      amount: Number(formData.amount),
      category: isIncome ? undefined : formData.category,
      date: formData.date,
      description: formData.description,
      workerId: (formData.category === 'salary' || formData.category === 'partner') ? formData.workerId : undefined,
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту транзакцию? Суммы по объекту будут автоматически пересчитаны.')) {
      deleteTransaction(transaction.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование операции</DialogTitle>
          <DialogDescription>
            Вы можете изменить детали операции или полностью удалить её.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-projectId">Объект *</Label>
            <select
              id="edit-projectId"
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

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Сумма (₽) *</Label>
            <Input
              id="edit-amount"
              type="number"
              min="1"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="15000"
            />
          </div>

          {!isIncome && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Категория *</Label>
                <select
                  id="edit-category"
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
                  <Label htmlFor="edit-workerId">Сотрудник / Партнер (опционально)</Label>
                  <select
                    id="edit-workerId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.workerId}
                    onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                  >
                    <option value="">Выберите получателя</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role === 'partner' ? 'Партнер' : member.specialization || 'Сотрудник'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-date">Дата *</Label>
            <Input
              id="edit-date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Описание *</Label>
            <Input
              id="edit-description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
            <Button
              type="button"
              variant="destructive"
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:text-red-700 sm:mr-auto flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Удалить операцию
            </Button>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" className="bg-zinc-950 text-white hover:bg-zinc-900">
                Сохранить
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
