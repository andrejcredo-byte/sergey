import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatCurrency, formatDate, getProjectStatus } from '../lib/utils';
import { PROJECT_STATUS_MAP, MATERIAL_STATUS_MAP, TRANSACTION_CATEGORY_MAP } from '../lib/constants';
import { AddTransactionDialog } from '../components/finance/AddTransactionDialog';
import { AddMaterialDialog } from '../components/materials/AddMaterialDialog';
import { EditMaterialDialog } from '../components/materials/EditMaterialDialog';
import { EditProjectDialog } from '../components/projects/EditProjectDialog';
import { 
  ArrowLeft, Building, Calendar, Wallet, CreditCard, PieChart, 
  Plus, Upload, FileText, CheckCircle2 
} from 'lucide-react';

import { AddWorkerDialog } from '../components/team/AddWorkerDialog';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, transactions, users, materials, removeWorkerFromProject, assignWorkerToProject, deleteMaterial } = useStore();
  const project = projects.find(p => p.id === id);
  const projectTransactions = transactions.filter(t => t.projectId === id);

  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'materials' | 'team'>('overview');
  const [editingMaterial, setEditingMaterial] = useState<any>(null);

  if (!project) {
    return <div className="p-8 text-center text-zinc-500">Объект не найден</div>;
  }
  
  const income = projectTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = projectTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const netProfit = income - expense;
  const margin = income > 0 ? (netProfit / income) * 100 : 0;
  const status = getProjectStatus(project);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/projects')}
          className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{project.name}</h1>
              <Badge variant={PROJECT_STATUS_MAP[status]?.variant || 'default'}>
                {PROJECT_STATUS_MAP[status]?.label || status}
              </Badge>
            </div>
            <p className="text-sm text-zinc-500 mt-1">{project.address}</p>
          </div>
          <EditProjectDialog project={project} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto scrollbar-hide">
        {(['overview', 'finance', 'materials', 'team'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'border-zinc-900 text-zinc-900' 
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
            }`}
          >
            {tab === 'overview' && 'Обзор'}
            {tab === 'finance' && 'Финансы'}
            {tab === 'materials' && 'Снабжение'}
            {tab === 'team' && 'Команда'}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Финансовый итог</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                  <div className="text-sm text-zinc-500 mb-1">Смета (План)</div>
                  <div className="text-xl font-bold">{formatCurrency(project.estimatedBudget)}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-700 mb-1">Получено от клиента</div>
                  <div className="text-xl font-bold text-blue-700">{formatCurrency(income)}</div>
                  <div className="text-xs text-blue-600 mt-1">Остаток к получению: {formatCurrency(Math.max(0, (project.estimatedBudget || 0) - income))}</div>
                </div>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                  <div className="text-sm text-zinc-500 mb-1">Факт. расходы</div>
                  <div className="text-xl font-bold text-red-600">{formatCurrency(expense)}</div>
                </div>
                <div className={`p-4 rounded-lg border ${netProfit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className={`text-sm mb-1 ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>{netProfit >= 0 ? 'Кэш (Прибыль)' : 'Кассовый разрыв'}</div>
                  <div className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatCurrency(Math.abs(netProfit))}</div>
                  {netProfit >= 0 && (
                    <div className="text-xs text-green-600 mt-1">Рентабельность: {margin.toFixed(1)}%</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Прогресс работ</CardTitle>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-zinc-100 rounded-full h-2 mb-4">
                  <div className="bg-zinc-900 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {project.stages.map(stage => (
                    <div 
                      key={stage.id} 
                      className="flex items-start gap-3 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-zinc-50 transition-colors"
                      onClick={() => {
                        const newStages = project.stages.map(s => 
                          s.id === stage.id ? { ...s, completed: !s.completed, completedAt: !s.completed ? new Date().toISOString().split('T')[0] : undefined } : s
                        );
                        // Recalculate progress
                        const completedCount = newStages.filter(s => s.completed).length;
                        const newProgress = Math.round((completedCount / newStages.length) * 100) || 0;
                        useStore.getState().updateProject(project.id, { stages: newStages, progress: newProgress });
                      }}
                    >
                      {stage.completed ? (
                        <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={18} />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-200 mt-0.5 shrink-0 group-hover:border-blue-400"></div>
                      )}
                      <div>
                        <div className={`font-medium text-sm ${stage.completed ? 'text-zinc-900' : 'text-zinc-700'}`}>{stage.name}</div>
                        <div className="text-xs text-zinc-500">
                          {stage.completed ? `Завершено ${formatDate(stage.completedAt || '')}` : 'Ожидание'}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-1 sm:col-span-2 border-t border-dashed pt-4 border-zinc-200">
                    <form 
                      className="flex gap-2 w-full"
                      onSubmit={e => {
                        e.preventDefault();
                        const input = (e.target as any).stageName.value;
                        if (!input.trim()) return;
                        const newStages = [...project.stages, { id: Math.random().toString(), name: input, completed: false }];
                        const completedCount = newStages.filter(s => s.completed).length;
                        const newProgress = Math.round((completedCount / newStages.length) * 100) || 0;
                        useStore.getState().updateProject(project.id, { stages: newStages, progress: newProgress });
                        (e.target as HTMLFormElement).reset();
                      }}
                    >
                      <input 
                        name="stageName" 
                        placeholder="Добавить этап..." 
                        className="flex-1 min-w-0 text-sm border-none bg-zinc-50 px-3 py-1.5 rounded outline-none focus:ring-1 focus:ring-zinc-300"
                        required
                        autoComplete="off"
                      />
                      <Button type="submit" variant="outline" size="sm" className="shrink-0 h-8">
                        <Plus className="w-4 h-4 mr-1" /> Добавить
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Детали</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="text-zinc-500 mb-1 flex items-center gap-2"><Building size={14} /> Клиент</div>
                  <div className="font-medium">{project.clientName}</div>
                  <div className="text-zinc-600">{project.clientPhone}</div>
                </div>
                <div className="border-t border-zinc-100 pt-3">
                  <div className="text-zinc-500 mb-1 flex items-center gap-2"><Calendar size={14} /> Сроки</div>
                  <div className="font-medium pb-1">Старт: {formatDate(project.startDate)}</div>
                  <div className={`font-medium ${status === 'overdue' ? 'text-red-500' : 'text-zinc-900'}`}>Дедлайн: {formatDate(project.deadline)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Документы</CardTitle>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const newDoc = {
                        id: Math.random().toString(),
                        name: file.name,
                        size: Number((file.size / 1024 / 1024).toFixed(2)),
                        url: '#'
                      };
                      useStore.getState().updateProject(project.id, { 
                        documents: [...project.documents, newDoc] 
                      });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 pointer-events-none"><Plus size={16} /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.documents?.length === 0 ? (
                  <p className="text-sm text-center text-zinc-500 pb-4">Нет документов</p>
                ) : (
                  project.documents?.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-md border border-transparent hover:border-zinc-200 transition-colors group">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium truncate hover:underline hover:text-blue-600 inline-block w-full">{doc.name}</a>
                        <div className="text-xs text-zinc-500">{doc.size} MB</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-50"
                        title="Удалить"
                        onClick={() => {
                          useStore.getState().updateProject(project.id, {
                            documents: project.documents.filter(d => d.id !== doc.id)
                          });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4">
            <CardTitle>История транзакций</CardTitle>
            <div className="flex gap-2">
              <AddTransactionDialog type="expense" projectId={project.id} />
              <AddTransactionDialog type="income" projectId={project.id} />
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50/50 text-zinc-500 font-medium">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Дата</th>
                    <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Описание</th>
                    <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Категория</th>
                    <th className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">Сумма</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {projectTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 sm:px-6 py-12 text-center text-zinc-500">
                        <p>Нет транзакций по этому объекту</p>
                      </td>
                    </tr>
                  ) : (
                    projectTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-zinc-500 whitespace-nowrap">{formatDate(t.date)}</td>
                        <td className="px-4 sm:px-6 py-4 font-medium text-zinc-900 min-w-[200px]">{t.description}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {t.category ? (
                            <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md text-xs">{TRANSACTION_CATEGORY_MAP[t.category] || t.category}</span>
                          ) : '-'}
                        </td>
                        <td className={`px-4 sm:px-6 py-4 text-right font-medium whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-zinc-900'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'materials' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <CardTitle>Материалы и закупки</CardTitle>
              <p className="text-sm text-zinc-500 mt-1">Список материалов для объекта</p>
            </div>
            <AddMaterialDialog projectId={project.id} />
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 bg-zinc-50 border-b border-zinc-100 uppercase">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Наименование</th>
                    <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Кол-во</th>
                    <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Сумма</th>
                    <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Статус</th>
                    <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">Ответственный</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {materials.filter(m => m.projectId === project.id).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 sm:px-6 py-12 text-center text-zinc-500">
                        <p>Нет материалов по этому объекту</p>
                      </td>
                    </tr>
                  ) : (
                    materials.filter(m => m.projectId === project.id).map(m => {
                      const buyer = users.find(u => u.id === m.buyerId);
                      const statusInfo = MATERIAL_STATUS_MAP[m.status] || { label: m.status, variant: 'default' };
                      return (
                        <tr 
                          key={m.id} 
                          className="hover:bg-zinc-50/50 transition-colors cursor-pointer group relative"
                          onClick={() => setEditingMaterial(m)}
                        >
                          <td className="px-4 sm:px-6 py-4 min-w-[200px]">
                            <div className="font-medium text-zinc-900">{m.name}</div>
                            <div className="text-xs text-zinc-500">{m.category} {m.supplier ? `• ${m.supplier}` : ''}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{m.quantity} {m.unit}</td>
                          <td className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">
                            {m.totalPrice ? formatCurrency(m.totalPrice) : '-'}
                            {m.pricePerUnit && <div className="text-xs text-zinc-500 font-normal">{formatCurrency(m.pricePerUnit)} / {m.unit}</div>}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-zinc-500 relative whitespace-nowrap">
                            <div className="pr-12">{buyer?.name || '-'}</div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMaterial(m.id);
                                }}
                                className="bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center h-8 w-8 rounded-md transition-colors border border-red-100 opacity-0 lg:group-hover:opacity-100 lg:transition-opacity"
                                title="Удалить"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {editingMaterial && (
        <EditMaterialDialog 
          material={editingMaterial}
          open={!!editingMaterial}
          onOpenChange={(open) => !open && setEditingMaterial(null)}
        />
      )}

      {activeTab === 'team' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <CardTitle>Команда проекта</CardTitle>
              <p className="text-sm text-zinc-500 mt-1">Определите сотрудников, которые работают на объекте, чтобы учитывать их зарплату</p>
            </div>
            <AddWorkerDialog />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">На объекте ({project.teamIds.length})</h3>
                <div className="space-y-3">
                  {project.teamIds.length === 0 ? (
                    <p className="text-sm text-zinc-500 p-4 bg-zinc-50 rounded-lg text-center border border-dashed">
                      Нет назначенных сотрудников
                    </p>
                  ) : (
                    project.teamIds.map(id => {
                      const user = users.find(u => u.id === id);
                      if (!user) return null;
                      return (
                        <div key={id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 text-lg font-medium">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-zinc-500">{user.role === 'partner' ? 'Партнер' : user.specialization || 'Сотрудник'}</div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => removeWorkerFromProject(project.id, id)}
                          >
                            Удалить
                          </Button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Доступные сотрудники</h3>
                <div className="space-y-3">
                  {users
                    .filter(u => u.role === 'worker' || u.role === 'partner')
                    .filter(u => !project.teamIds.includes(u.id))
                    .map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-zinc-50 border rounded-lg hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden flex-shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm font-medium">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-zinc-500">{user.role === 'partner' ? 'Партнер' : user.specialization || 'Сотрудник'}</div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => assignWorkerToProject(project.id, user.id)}
                      >
                        Добавить
                      </Button>
                    </div>
                  ))}
                  {users.filter(u => (u.role === 'worker' || u.role === 'partner') && !project.teamIds.includes(u.id)).length === 0 && (
                    <div className="text-sm text-zinc-500 text-center py-4 border border-dashed rounded-lg bg-zinc-50">
                      {users.filter(u => u.role === 'worker' || u.role === 'partner').length === 0 
                        ? 'В вашей CRM пока нет добавленных сотрудников. Добавьте их, чтобы назначить на объект.' 
                        : 'Все доступные сотрудники уже на объекте'
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
