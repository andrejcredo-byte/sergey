import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, getProjectStatus } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, AlertTriangle, FolderOpen } from 'lucide-react';
export function Dashboard() {
  const navigate = useNavigate();
  const { projects, transactions } = useStore();

  const activeProjects = useMemo(() => {
    return projects.filter(p => !['completed', 'paid', 'cancelled'].includes(getProjectStatus(p)));
  }, [projects]);

    const { totalIncome, totalExpense, margin, attentionRequiredCount } = useMemo(() => {
    const activeProjectIds = new Set(activeProjects.map(p => p.id));
    
    // Общий доход и расходы считаются по всем активным объектам (на основе единого источника - транзакций)
    const activeTransactions = transactions.filter(t => activeProjectIds.has(t.projectId));
    
    const income = activeTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = activeTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const profit = income - expense;
    const calcMargin = income > 0 ? (profit / income) * 100 : 0;
    
    const attentionCount = activeProjects.filter(p => {
      const pTrans = transactions.filter(t => t.projectId === p.id);
      const pExpense = pTrans.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
      return getProjectStatus(p) === 'overdue' || pExpense > (p.estimatedBudget || 0);
    }).length;

    return { totalIncome: income, totalExpense: expense, margin: calcMargin, attentionRequiredCount: attentionCount };
  }, [activeProjects, transactions]);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Главная</h1>
          <p className="text-zinc-500 text-sm mt-1">Ключевые показатели компании</p>
        </div>
      </div>

      {/* Quick Access to Active Projects */}
      {activeProjects.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x">
          {activeProjects.map(p => (
            <div 
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="flex-none bg-white border border-zinc-200 rounded-lg p-3 w-64 hover:border-zinc-300 hover:shadow-sm cursor-pointer transition-all flex items-start gap-3 group snap-start block"
            >
              <div className="p-2 bg-zinc-50 rounded-md text-zinc-500 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-colors">
                <FolderOpen size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-zinc-900 truncate">{p.name}</div>
                <div className="text-xs text-zinc-500 truncate mt-0.5">{p.address}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Общий доход</CardTitle>
            <Wallet className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Общие расходы</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-zinc-500 mt-1">Материалы, зарплаты, логистика</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Чистая прибыль</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(netProfit)}</div>
            <p className="text-xs text-green-600 mt-1">Рентабельность: {margin.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Внимание</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{attentionRequiredCount} объектов</div>
            <p className="text-xs text-zinc-500 mt-1">Требуют внимания</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
