import { z } from 'zod';
import { AccountType } from '@prisma/client';
import { AccountStateAction } from '../../domain/accounts/state';

export const CreateAccountSchema = z.object({
  userId: z.coerce.number().int().positive(),
  accountType: z.nativeEnum(AccountType),
  name: z.string().trim().min(3).max(30),
  initialBalance: z.coerce.number().nonnegative().optional(),
  parentAccountId: z.coerce.number().int().positive().optional(),
});

export const ChangeStateSchema = z.object({
  action: z.nativeEnum(AccountStateAction),
});
export const RenameAccountSchema = z.object({
  newName: z.string().trim().min(3).max(30),
});
export const CreateAccountGroupSchema = z.object({
  name: z.string().trim().min(3).max(30),
  childAccountIds: z.array(z.coerce.number().int().positive()),
});
