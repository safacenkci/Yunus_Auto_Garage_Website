export type AdminConfirmKind = 'delete' | 'add' | 'save' | 'send' | 'approve' | 'reject' | 'confirm';

export const ADMIN_CONFIRM_MESSAGES: Record<AdminConfirmKind, string> = {
  delete: 'Silmek istediğinize emin misiniz?',
  add: 'Eklemek istediğinize emin misiniz?',
  save: 'Değişiklikleri kaydetmek istediğinize emin misiniz?',
  send: 'SMS göndermek istediğinize emin misiniz?',
  approve: 'Emin misiniz?',
  reject: 'Emin misiniz?',
  confirm: 'Emin misiniz?',
};
