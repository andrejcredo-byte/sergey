import React from 'react';
import { useStore } from '../store';
import { NewProjectDialog } from '../components/projects/NewProjectDialog';
import { FolderOpen } from 'lucide-react';
import { ProjectList } from '../components/projects/ProjectList';

export function Projects() {
  const { projects, transactions } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Объекты</h1>
          <p className="text-sm text-zinc-500 mt-1">Управление строительными проектами</p>
        </div>
        <div className="w-full sm:w-auto">
          <NewProjectDialog />
        </div>
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
          <ProjectList projects={projects} transactions={transactions} />
        </div>
      )}
    </div>
  );
}

