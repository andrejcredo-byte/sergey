import React from 'react';
import { useStore } from '../store';
import { Card, CardContent } from '../components/ui/card';
import { Users, Phone, Trash2 } from 'lucide-react';
import { AddWorkerDialog } from '../components/team/AddWorkerDialog';
import { Button } from '../components/ui/button';

export function Team() {
  const { users, projects, removeUser } = useStore();
  const teamMembers = users.filter(u => u.role === 'worker' || u.role === 'partner');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Команда</h1>
          <p className="text-sm text-zinc-500">Сотрудники, партнеры и бригады</p>
        </div>
        <AddWorkerDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => {
          // Find which projects they are assigned to
          const assignedProjects = projects.filter(p => p.teamIds.includes(member.id));
          
          return (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-zinc-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={20} className="text-zinc-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-zinc-900">{member.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2"
                        onClick={() => {
                          removeUser(member.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="text-sm text-zinc-500 mb-2">
                       {member.role === 'partner' ? 'Партнер' : member.specialization || 'Сотрудник'}
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                        <Phone size={14} />
                        {member.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-zinc-50 p-4">
                  <div className="text-sm font-medium text-zinc-700 mb-2">
                    Прикреплен к объектам ({assignedProjects.length}):
                  </div>
                  {assignedProjects.length === 0 ? (
                    <div className="text-xs text-zinc-500">Пока нет активных объектов</div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {assignedProjects.map(p => (
                        <div key={p.id} className="text-xs text-zinc-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <span className="truncate">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {teamMembers.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-zinc-500">
            Здесь будет список вашей команды.
          </div>
        )}
      </div>
    </div>
  );
}
