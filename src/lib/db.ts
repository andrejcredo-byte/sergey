import { collection, doc, query, where, onSnapshot, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { Project, Transaction, Material, User } from '../types';

export const collections = {
  projects: 'projects',
  transactions: 'transactions', // Subcollections can be accessed by their full path e.g. `projects/${projectId}/transactions`
  materials: 'materials',
  users: 'users'
};

// Start watching projects for current user
export const watchProjects = (userId: string, callback: (projects: Project[]) => void) => {
  const q = query(collection(db, collections.projects), where("ownerId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as Project));
  }, (error) => {
    console.error("Error watching projects:", error);
  });
};

export const watchTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
  const q = query(collection(db, collections.transactions), where("ownerId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as Transaction));
  }, (error) => {
    console.error("Error watching transactions:", error);
  });
};

export const watchMaterials = (userId: string, callback: (materials: Material[]) => void) => {
  const q = query(collection(db, collections.materials), where("ownerId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as Material));
  }, (error) => {
    console.error("Error watching materials:", error);
  });
};

export const watchUsers = (userId: string, callback: (users: User[]) => void) => {
  // Assuming managers/workers belong to the owner
  const q = query(collection(db, collections.users), where("ownerId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as User));
  }, (error) => {
    console.error("Error watching users:", error);
  });
};

// Utility to strip undefined values as Firestore does not support them
const cleanData = <T extends Record<string, any>>(obj: T): T => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};

// Write helpers
export const saveProject = async (project: Project) => {
  const docRef = doc(db, collections.projects, project.id);
  await setDoc(docRef, cleanData(project), { merge: true }); // Make sure ownerId is set
};

export const saveTransaction = async (transaction: Transaction) => {
  const docRef = doc(db, collections.transactions, transaction.id);
  await setDoc(docRef, cleanData(transaction), { merge: true });
};

export const saveMaterial = async (material: Material) => {
  const docRef = doc(db, collections.materials, material.id);
  await setDoc(docRef, cleanData(material), { merge: true });
};

export const deleteMaterialDoc = async (materialId: string) => {
  await deleteDoc(doc(db, collections.materials, materialId));
};

export const saveUserRecord = async (user: User) => {
  const docRef = doc(db, collections.users, user.id);
  await setDoc(docRef, cleanData(user), { merge: true });
};

export const deleteUserRecord = async (userId: string) => {
  await deleteDoc(doc(db, collections.users, userId));
};