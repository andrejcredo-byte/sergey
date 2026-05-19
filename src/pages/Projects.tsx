import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Badge } from '../components/ui/badge';
import { PROJECT_STATUS_MAP } from '../lib/constants';
import { formatCurrency, formatDate, getProjectStatus } from '../lib/utils';
import { NewProjectDialog } from '../components/projects/NewProjectDialog';
import { FolderOpen } from 'lucide-react';

export function Projects() {
  const navigate = useNavigate();
  const { projects, transactions } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Объекты</h1>
          <p className="text-sm text-zinc-500">Управление строительными проектами</p>
        </div>
        <NewProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 mb-1">Объекты не найдены</h3>
          <p className="text-zinc-500 max-w-sm">
            У вас пока нет активных проектов. Создайте новый объект, чтобы начать работу.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-500 font-medium border-b">
                <tr>
                  <th className="px-6 py-3">Объект</th>
                  <th className="px-6 py-3 text-right">Бюджет</th>
                  <th className="px-6 py-3 text-right">Прибыль</th>
                  <th className="px-6 py-3">Статус</th>
                  <th className="px-6 py-3">Дедлайн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {projects.map(project => {
                  const pTrans = transactions.filter(t => t.projectId === project.id);
                  const income = pTrans.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
                  const expense = pTrans.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
                  const status = getProjectStatus(project);
                  
                  return (
                  <tr 
                    key={project.id} 
                    className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{project.name}</div>
                      <div className="text-zinc-500 text-xs mt-1">{project.clientName}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(project.estimatedBudget)}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-medium">{formatCurrency(income - expense)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={PROJECT_STATUS_MAP[status]?.variant || 'default'}>
                        {PROJECT_STATUS_MAP[status]?.label || status}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 text-zinc-500 ${status === 'overdue' ? 'text-red-500 font-medium' : ''}`}>{formatDate(project.deadline)}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
