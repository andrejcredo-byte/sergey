import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Project } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date | undefined) {
  if (!date) return '';
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getProjectStatus(project: Project) {
  if (['completed', 'paid', 'cancelled'].includes(project.status)) {
    return project.status;
  }
  
  const currentDate = new Date().toISOString().split('T')[0];
  if (project.deadline && currentDate > project.deadline && project.progress < 100) {
    return 'overdue';
  }
  
  return project.status;
}
