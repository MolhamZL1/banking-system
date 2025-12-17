export type AccountEventType =
  | 'ACCOUNT_CREATED'
  | 'ACCOUNT_STATE_CHANGED';

export type AccountEvent = {
  type: AccountEventType;
  at: Date;
  userId: number;

  accountId: number;
  accountName?: string;

  message: string;
};
