import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string({ invalid_type_error: 'email must be a string', required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string({ invalid_type_error: 'password must be a string', required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const SignupSchema = z.object({
  name: z
    .string({ invalid_type_error: 'name must be a string', required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z
    .string({ invalid_type_error: 'email must be a string', required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string({ invalid_type_error: 'password must be a string', required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
