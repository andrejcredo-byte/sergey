import { create } from 'zustand';
import { Project, Transaction, Material, User } from '../types';
import { saveProject, saveTransaction, deleteTransactionDoc, saveMaterial, deleteMaterialDoc, saveUserRecord, deleteUserRecord } from '../lib/db';

interface StoreState {
  projects: Project[];
  transactions: Transaction[];
  materials: Material[];
  users: User[];
  currentUser: User | null;
  // Setters for syncing with Firebase
  setProjects: (projects: Project[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setMaterials: (materials: Material[]) => void;
  setUsers: (users: User[]) => void;
  // Actions
  setCurrentUser: (user: User | null) => void;
  addProject: (p: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addUser: (u: User) => void;
  assignWorkerToProject: (projectId: string, workerId: string) => void;
  removeWorkerFromProject: (projectId: string, workerId: string) => void;
  addMaterial: (m: Material) => void;
  updateMaterial: (id: string, data: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  removeUser: (id: string) => void;
}

const MOCK_USERS: User[] = [];

const MOCK_PROJECTS: Project[] = [];

const MOCK_TRANSACTIONS: Transaction[] = [];

const MOCK_MATERIALS: Material[] = [];

export const useStore = create<StoreState>((set) => ({
  projects: MOCK_PROJECTS,
  transactions: MOCK_TRANSACTIONS,
  materials: MOCK_MATERIALS,
  users: MOCK_USERS,
  currentUser: null,
  setProjects: (projects) => set({ projects }),
  setTransactions: (transactions) => set({ transactions }),
  setMaterials: (materials) => set({ materials }),
  setUsers: (users) => set({ users }),
  setCurrentUser: (user) => set({ currentUser: user }),
  addProject: (p) => set((state) => {
    let newProject = p;
    if (state.currentUser && !newProject.ownerId) {
      newProject = { ...p, ownerId: state.currentUser.id };
    }
    saveProject(newProject).catch(console.error);
    return { projects: [newProject, ...state.projects] };
  }),
  updateProject: (id, data) => set((state) => {
    const updated = state.projects.find(p => p.id === id);
    if (updated) {
      saveProject({ ...updated, ...data }).catch(console.error);
    }
    return {
      projects: state.projects.map(p => p.id === id ? { ...p, ...data } : p)
    };
  }),
  addTransaction: (t) => set((state) => {
    let newTx = t;
    if (state.currentUser && !newTx.ownerId) {
      newTx = { ...t, ownerId: state.currentUser.id };
    }
    saveTransaction(newTx).catch(console.error);
    const newTransactions = [newTx, ...state.transactions];
    // Update project totals
    const p = state.projects.find(proj => proj.id === newTx.projectId);
    if (p) {
      const updatedTotalIn = p.totalIncome + (newTx.type === 'income' ? newTx.amount : 0);
      const updatedTotalEx = p.totalExpense + (newTx.type === 'expense' ? newTx.amount : 0);
      saveProject({ ...p, totalIncome: updatedTotalIn, totalExpense: updatedTotalEx }).catch(console.error);
      const updatedProjects = state.projects.map(proj => 
        proj.id === newTx.projectId 
          ? { ...proj, totalIncome: updatedTotalIn, totalExpense: updatedTotalEx }
          : proj
      );
      return { transactions: newTransactions, projects: updatedProjects };
    }
    return { transactions: newTransactions };
  }),
  updateTransaction: (id, data) => set((state) => {
    const original = state.transactions.find(t => t.id === id);
    if (!original) return {};

    const updated = { ...original, ...data };
    saveTransaction(updated).catch(console.error);

    const updatedTransactions = state.transactions.map(t => t.id === id ? updated : t);

    // Recalculate totals for potentially affected projects
    const projectIdsToUpdate = Array.from(new Set([original.projectId, updated.projectId]));
    
    const updatedProjects = state.projects.map(p => {
      if (projectIdsToUpdate.includes(p.id)) {
        const projectTxs = updatedTransactions.filter(t => t.projectId === p.id);
        const totalIncome = projectTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = projectTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        saveProject({ ...p, totalIncome, totalExpense }).catch(console.error);
        return { ...p, totalIncome, totalExpense };
      }
      return p;
    });

    return { transactions: updatedTransactions, projects: updatedProjects };
  }),
  deleteTransaction: (id) => set((state) => {
    const original = state.transactions.find(t => t.id === id);
    if (!original) return {};

    deleteTransactionDoc(id).catch(console.error);
    const updatedTransactions = state.transactions.filter(t => t.id !== id);

    const updatedProjects = state.projects.map(p => {
      if (p.id === original.projectId) {
        const projectTxs = updatedTransactions.filter(t => t.projectId === p.id);
        const totalIncome = projectTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = projectTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        saveProject({ ...p, totalIncome, totalExpense }).catch(console.error);
        return { ...p, totalIncome, totalExpense };
      }
      return p;
    });

    return { transactions: updatedTransactions, projects: updatedProjects };
  }),
  addUser: (u) => set((state) => {
    let newUser = u;
    if (state.currentUser && !newUser.ownerId) {
      newUser = { ...u, ownerId: state.currentUser.id };
    }
    saveUserRecord(newUser).catch(console.error);
    return { users: [newUser, ...state.users] };
  }),
  assignWorkerToProject: (projectId, workerId) => set((state) => {
    const p = state.projects.find(p => p.id === projectId);
    if (p && !p.teamIds.includes(workerId)) {
      saveProject({ ...p, teamIds: [...p.teamIds, workerId] }).catch(console.error);
    }
    return {
      projects: state.projects.map(p => 
        p.id === projectId && !p.teamIds.includes(workerId)
          ? { ...p, teamIds: [...p.teamIds, workerId] }
          : p
      )
    };
  }),
  removeWorkerFromProject: (projectId, workerId) => set((state) => {
    const p = state.projects.find(p => p.id === projectId);
    if (p && p.teamIds.includes(workerId)) {
      saveProject({ ...p, teamIds: p.teamIds.filter(id => id !== workerId) }).catch(console.error);
    }
    return {
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { ...p, teamIds: p.teamIds.filter(id => id !== workerId) }
          : p
      )
    };
  }),
  addMaterial: (m) => set((state) => {
    let newMat = m;
    if (state.currentUser && !newMat.ownerId) {
      newMat = { ...m, ownerId: state.currentUser.id };
    }
    saveMaterial(newMat).catch(console.error);
    return { materials: [newMat, ...state.materials] };
  }),
  updateMaterial: (id, data) => set((state) => {
    const m = state.materials.find(x => x.id === id);
    if (m) {
      saveMaterial({ ...m, ...data }).catch(console.error);
    }
    return {
      materials: state.materials.map(m => m.id === id ? { ...m, ...data } : m)
    };
  }),
  deleteMaterial: (id) => set((state) => {
    deleteMaterialDoc(id).catch(console.error);
    return {
      materials: state.materials.filter(m => m.id !== id)
    };
  }),
  removeUser: (id) => set((state) => {
    deleteUserRecord(id).catch(console.error);
    return {
      users: state.users.filter(u => u.id !== id),
      projects: state.projects.map(p => ({
        ...p,
        teamIds: p.teamIds.filter(userId => userId !== id)
      }))
    };
  }),
}));
