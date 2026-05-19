import React from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AddTransactionDialog } from '../components/finance/AddTransactionDialog';
import { TransactionList } from '../components/finance/TransactionList';

export function Finance() {
  const { transactions, projects } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Финансы</h1>
          <p className="text-sm text-zinc-500">Управление денежными потоками</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex-1"><AddTransactionDialog type="expense" /></div>
          <div className="flex-1"><AddTransactionDialog type="income" /></div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Все транзакции</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-0 pb-4">
          <TransactionList transactions={transactions} projects={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
