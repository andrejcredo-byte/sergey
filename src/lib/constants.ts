import { formatCurrency } from "./utils"

export const PROJECT_STATUS_MAP: Record<string, { label: string, variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }> = {
  new: { label: 'Новый', variant: 'default' },
  negotiation: { label: 'На согласовании', variant: 'secondary' },
  agreed: { label: 'Согласован', variant: 'outline' },
  waiting_payment: { label: 'Ожидание оплаты', variant: 'warning' },
  in_progress: { label: 'В работе', variant: 'warning' },
  partially_completed: { label: 'Частично завершен', variant: 'secondary' },
  completed: { label: 'Завершен', variant: 'success' },
  paid: { label: 'Оплачен', variant: 'success' },
  frozen: { label: 'Заморожен', variant: 'secondary' },
  cancelled: { label: 'Отменен', variant: 'destructive' },
  overdue: { label: 'Просрочен', variant: 'destructive' },
};

export const TRANSACTION_CATEGORY_MAP: Record<string, string> = {
  salary: 'Зарплата',
  materials: 'Материалы',
  partner: 'Подрядчики',
  logistics: 'Логистика',
  equipment: 'Оборудование',
  other: 'Прочее',
};
export const MATERIAL_STATUS_MAP: Record<string, { label: string, variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }> = {
  to_buy: { label: 'К закупке', variant: 'destructive' },
  ordered: { label: 'Заказано', variant: 'warning' },
  partial: { label: 'Частичная доставка', variant: 'secondary' },
  bought: { label: 'Куплено', variant: 'secondary' },
  delivering: { label: 'В пути', variant: 'warning' },
  delivered: { label: 'Доставлено на объект', variant: 'success' }
};
