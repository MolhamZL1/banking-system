import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().trim().min(3).max(30),
  password: z.string().min(6).max(100),
  email: z.string().email(),
  phone: z.string().trim().min(6).max(30).optional(),
});

export const CreateStaffSchema = z.object({
  username: z.string().trim().min(3).max(30),
  password: z.string().min(6).max(100),
  email: z.string().email(),
  phone: z.string().trim().min(6).max(30).optional(),
  role: z.enum(['MANAGER', 'TELLER', 'CUSTOMER']),
});

export const ResendCodeSchema = z.object({
  email: z.string().email(),
});

export const VerifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().trim().length(6),
});

export const LoginSchema = z.object({
  username: z.string().trim().min(3).max(30),
  password: z.string().min(6).max(100),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});
