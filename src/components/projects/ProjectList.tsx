import React from 'react';
import { Project, Transaction } from '../../types';
import { PROJECT_STATUS_MAP } from '../../lib/constants';
import { formatCurrency, formatDate, getProjectStatus } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { useStore } from '../../store';
import { 
  Building, 
  ChevronRight, 
  Calendar, 
  User, 
  TrendingUp, 
  PiggyBank, 
  AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectListProps {
  projects: Project[];
  transactions: Transaction[];
}

export function ProjectList({ projects, transactions }: ProjectListProps) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <p>У вас пока нет активных проектов.</p>
      </div>
    );
  }

  // Helper to determine icon background color based on status
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-emerald-500 text-white';
      case 'in_progress':
      case 'negotiation':
      case 'agreed':
        return 'bg-blue-600 text-white';
      case 'waiting_payment':
        return 'bg-amber-500 text-white';
      case 'overdue':
      case 'cancelled':
        return 'bg-rose-500 text-white';
      case 'frozen':
        return 'bg-zinc-400 text-zinc-900';
      default:
        return 'bg-zinc-650 text-white';
    }
  };

  return (
    <div className="flex flex-col">
      <div className="px-4 sm:px-6 divide-y divide-zinc-100">
        {projects.map(project => {
          const pTrans = transactions.filter(t => t.projectId === project.id);
          const income = pTrans.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
          const expense = pTrans.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
          const status = getProjectStatus(project);
          const statusInfo = PROJECT_STATUS_MAP[status] || { label: status, variant: 'default' };
          const profit = income - expense;

          return (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="flex items-center justify-between py-4 group -mx-4 px-4 sm:-mx-6 sm:px-6 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                {/* Visual Icon Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getStatusColorClass(status)}`}>
                  <Building size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    {/* Project Name and Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-zinc-950 text-[15px] sm:text-base truncate">
                          {project.name}
                        </span>
                        <Badge variant={statusInfo.variant as any} className="text-[10px] px-1.5 py-0 sm:text-xs">
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-zinc-500">
                        {project.clientName && (
                          <span className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-none">
                            <User size={12} className="text-zinc-400 shrink-0" />
                            {project.clientName}
                          </span>
                        )}
                        <span className="text-zinc-300">•</span>
                        <span className={`flex items-center gap-1 ${status === 'overdue' ? 'text-red-500 font-medium' : ''}`}>
                          <Calendar size={12} className="text-zinc-400 shrink-0" />
                          Дедлайн: {formatDate(project.deadline)}
                        </span>
                        {project.address && (
                          <>
                            <span className="text-zinc-300">•</span>
                            <span className="truncate max-w-[120px] sm:max-w-xs">{project.address}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Financial Metrics (Budget and profit/balance) */}
                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100/50">
                      <div className="text-right">
                        <div className="text-xs text-zinc-400 font-normal sm:mb-0.5">Прибыль</div>
                        <div className={`font-bold text-base sm:text-lg ${profit >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                          {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-0.5 mt-1">
                        <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                          <span className="text-zinc-400">Бюджет:</span>
                          <span className="font-medium text-zinc-700">{formatCurrency(project.estimatedBudget)}</span>
                        </div>
                        {expense > 0 && (
                          <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400">
                            <span>Расходы: {formatCurrency(expense)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="pl-2 shrink-0 self-center hidden sm:block text-zinc-400 group-hover:text-zinc-650 transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
