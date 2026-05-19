/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Finance } from './pages/Finance';
import { Materials } from './pages/Materials';
import { Team } from './pages/Team';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { useStore } from './store';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { watchProjects, watchTransactions, watchMaterials, watchUsers } from './lib/db';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore(state => state.currentUser);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const { setCurrentUser, setProjects, setTransactions, setMaterials, setUsers } = useStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clear previous watchers if logging out or switching accounts
      unsubs.forEach(unsub => unsub());
      unsubs = [];

      if (firebaseUser) {
        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Без имени',
          email: firebaseUser.email || '',
          role: 'owner',
          avatar: firebaseUser.photoURL || undefined
        });

        // Initialize Firebase listeners
        unsubs.push(watchProjects(firebaseUser.uid, setProjects));
        unsubs.push(watchTransactions(firebaseUser.uid, setTransactions));
        unsubs.push(watchMaterials(firebaseUser.uid, setMaterials));
        unsubs.push(watchUsers(firebaseUser.uid, setUsers));
      } else {
        setCurrentUser(null);
        setProjects([]);
        setTransactions([]);
        setMaterials([]);
        setUsers([]);
      }
      setIsInitializing(false);
    });

    return () => {
      unsubscribeAuth();
      unsubs.forEach(unsub => unsub());
    };
  }, [setCurrentUser, setProjects, setTransactions, setMaterials, setUsers]);

  if (isInitializing) {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="finance" element={<Finance />} />
          <Route path="materials" element={<Materials />} />
          <Route path="team" element={<Team />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
