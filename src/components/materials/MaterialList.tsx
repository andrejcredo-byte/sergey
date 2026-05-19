import React from 'react';
import { Material, Project, User } from '../../types';
import { MATERIAL_STATUS_MAP } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { useStore } from '../../store';
import { 
  Paintbrush, 
  Zap, 
  Droplet, 
  Wrench, 
  Layers, 
  ShoppingBag, 
  Hammer, 
  Trash2, 
  User as UserIcon,
  Building
} from 'lucide-react';

interface MaterialListProps {
  materials: Material[];
  projects: Project[];
  users: User[];
  onEditClick: (m: Material) => void;
  showProject?: boolean;
}

export function MaterialList({ 
  materials, 
  projects, 
  users, 
  onEditClick, 
  showProject = true 
}: MaterialListProps) {
  const { deleteMaterial } = useStore();

  if (materials.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <p>Нет материалов по заданным фильтрам</p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Черновые': return <Hammer size={20} />;
      case 'Чистовые': return <Paintbrush size={20} />;
      case 'Электрика': return <Zap size={20} />;
      case 'Сантехника': return <Droplet size={20} />;
      case 'Инструменты': return <Wrench size={20} />;
      case 'Расходники': return <Layers size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Черновые': return 'bg-amber-500';
      case 'Чистовые': return 'bg-indigo-500';
      case 'Электрика': return 'bg-yellow-500 text-zinc-900';
      case 'Сантехника': return 'bg-cyan-500';
      case 'Инструменты': return 'bg-emerald-500';
      case 'Расходники': return 'bg-stone-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="flex flex-col">
      <div className="px-4 sm:px-6 divide-y divide-zinc-100">
        {materials.map(m => {
          const project = projects.find(p => p.id === m.projectId);
          const buyer = users.find(u => u.id === m.buyerId);
          const statusInfo = MATERIAL_STATUS_MAP[m.status] || { label: m.status, variant: 'default' };

          return (
            <div 
              key={m.id} 
              onClick={() => onEditClick(m)}
              className="flex items-center justify-between py-4 group -mx-4 px-4 sm:-mx-6 sm:px-6 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                {/* Иконка категории */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${getCategoryColor(m.category)}`}>
                  {getCategoryIcon(m.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    {/* Название и метаданные */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-zinc-950 text-[15px] sm:text-base truncate">
                          {m.name}
                        </span>
                        <Badge variant={statusInfo.variant as any} className="text-[10px] px-1.5 py-0 sm:text-xs">
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-zinc-500">
                        <span>{m.category}</span>
                        {m.supplier && (
                          <>
                            <span className="text-zinc-300">•</span>
                            <span className="truncate">{m.supplier}</span>
                          </>
                        )}
                        <span className="text-zinc-300">•</span>
                        <span className="font-medium text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">
                          {m.quantity} {m.unit}
                        </span>
                      </div>
                    </div>

                    {/* Цена, объект и ответственный */}
                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100/50">
                      <div className="text-right">
                        <div className="font-bold text-zinc-900 text-base sm:text-lg">
                          {m.totalPrice ? formatCurrency(m.totalPrice) : '-'}
                        </div>
                        {m.pricePerUnit && (
                          <div className="hidden sm:block text-xs text-zinc-400">
                            {formatCurrency(m.pricePerUnit)} / {m.unit}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-0.5 mt-1">
                        {showProject && project && (
                          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                            <Building size={11} className="text-zinc-400" />
                            <span className="max-w-[120px] sm:max-w-[180px] truncate">{project.name}</span>
                          </div>
                        )}
                        {buyer && (
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <UserIcon size={11} className="text-zinc-400" />
                            <span>{buyer.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Кнопка удаления */}
                <div className="pl-2 shrink-0 self-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Вы уверены, что хотите удалить этот материал?')) {
                        deleteMaterial(m.id);
                      }
                    }}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
