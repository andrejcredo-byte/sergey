import React from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Shield } from 'lucide-react';

export function Profile() {
  const currentUser = useStore(state => state.currentUser);

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900">Профиль пользователя</h1>
        <p className="text-zinc-500 mt-1">Управление личными данными</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основные данные</CardTitle>
          <CardDescription>Информация о вашем аккаунте</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-zinc-900 text-white flex items-center justify-center text-3xl font-medium overflow-hidden border-4 border-white shadow-sm">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <Button variant="outline">Изменить фото</Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Имя</label>
                <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2">
                  <User size={16} className="text-zinc-400 mr-2" />
                  <span className="text-zinc-900">{currentUser.name}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Роль</label>
                <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2">
                  <Shield size={16} className="text-zinc-400 mr-2" />
                  <span className="text-zinc-900">{currentUser.role === 'owner' ? 'Владелец' : currentUser.role}</span>
                </div>
              </div>
              {currentUser.email && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                  <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2">
                    <Mail size={16} className="text-zinc-400 mr-2" />
                    <span className="text-zinc-900">{currentUser.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button>Сохранить изменения</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
