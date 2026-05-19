import React from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatDate } from '../lib/utils';
import { AddTransactionDialog } from '../components/finance/AddTransactionDialog';
import { TRANSACTION_CATEGORY_MAP } from '../lib/constants';

export function Finance() {
  const { transactions, projects } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Финансы</h1>
          <p className="text-sm text-zinc-500">Управление денежными потоками</p>
        </div>
        <div className="flex gap-2">
          <AddTransactionDialog type="expense" />
          <AddTransactionDialog type="income" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Все транзакции</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="px-6 py-3">Дата</th>
                <th className="px-6 py-3">Объект</th>
                <th className="px-6 py-3">Категория</th>
                <th className="px-6 py-3">Описание</th>
                <th className="px-6 py-3 text-right">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <p>Пока нет транзакций</p>
                  </td>
                </tr>
              ) : (
                transactions.map(t => {
                  const project = projects.find(p => p.id === t.projectId);
                  return (
                    <tr key={t.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4">{formatDate(t.date)}</td>
                      <td className="px-6 py-4 font-medium">{project?.name}</td>
                      <td className="px-6 py-4 text-zinc-500">{t.category ? TRANSACTION_CATEGORY_MAP[t.category] || t.category : '-'}</td>
                      <td className="px-6 py-4 text-zinc-500">{t.description}</td>
                      <td className={`px-6 py-4 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-zinc-900'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
