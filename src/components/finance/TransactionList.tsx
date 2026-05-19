import React, { useState } from 'react';
import { Transaction, Project } from '../../types';
import { TRANSACTION_CATEGORY_MAP } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Banknote, Package, Briefcase, Truck, Wrench, CreditCard, ArrowDownToLine } from 'lucide-react';
import { EditTransactionDialog } from './EditTransactionDialog';

interface TransactionListProps {
  transactions: Transaction[];
  projects: Project[];
  showProject?: boolean;
}

export function TransactionList({ transactions, projects, showProject = true }: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <p>Пока нет транзакций</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by date
  const grouped = sortedTransactions.reduce((acc, t) => {
    const date = formatDate(t.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const getCategoryIcon = (type: string, category?: string) => {
    if (type === 'income') return <ArrowDownToLine size={20} />;
    switch (category) {
      case 'salary': return <Banknote size={20} />;
      case 'materials': return <Package size={20} />;
      case 'partner': return <Briefcase size={20} />;
      case 'logistics': return <Truck size={20} />;
      case 'equipment': return <Wrench size={20} />;
      default: return <CreditCard size={20} />;
    }
  };

  const getCategoryColor = (type: string, category?: string) => {
    if (type === 'income') return 'bg-green-500';
    switch (category) {
      case 'salary': return 'bg-blue-500';
      case 'materials': return 'bg-orange-500';
      case 'partner': return 'bg-purple-500';
      case 'logistics': return 'bg-yellow-500';
      case 'equipment': return 'bg-slate-700';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="flex flex-col">
      {Object.entries(grouped).map(([date, dayTransactions]) => (
        <div key={date} className="mb-4 last:mb-0">
          <h3 className="text-sm font-medium text-zinc-500 mb-2 px-4 sm:px-6 mt-4 first:mt-2 sticky top-0 bg-white/90 backdrop-blur pb-2 z-10">
            {date}
          </h3>
          <div className="px-4 sm:px-6">
            {dayTransactions.map(t => {
              const project = projects.find(p => p.id === t.projectId);
              const categoryName = t.type === 'income' ? 'Поступление' : (t.category ? TRANSACTION_CATEGORY_MAP[t.category] || t.category : 'Прочее');
              
              return (
                <div 
                  key={t.id} 
                  onClick={() => {
                    setSelectedTransaction(t);
                    setEditOpen(true);
                  }}
                  className="flex items-center justify-between py-3 group border-b border-zinc-100 last:border-0 hover:bg-zinc-50 cursor-pointer -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${getCategoryColor(t.type, t.category)}`}>
                      {getCategoryIcon(t.type, t.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-base font-medium text-zinc-900 truncate">
                          {t.description || 'Транзакция'}
                        </p>
                        <p className={`text-base font-medium whitespace-nowrap ml-4 ${t.type === 'income' ? 'text-green-600' : 'text-zinc-900'}`}>
                          {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <p className="text-sm text-zinc-500 truncate flex items-center gap-1">
                          {categoryName}
                        </p>
                        {showProject && project && (
                          <p className="text-sm text-zinc-400 whitespace-nowrap ml-4 truncate max-w-[120px] sm:max-w-[200px]">
                            {project.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <EditTransactionDialog 
        transaction={selectedTransaction}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
