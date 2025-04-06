// import { z } from 'zod';

// export const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters')
// });

// export const registerSchema = z.object({
//   name: z.string().min(3, 'Name must be at least 3 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string()
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"]
// });

// export const profileSchema = z.object({
//   name: z.string().min(3, 'Name must be at least 3 characters'),
//   phone: z.string().optional(),
//   country: z.string(),
//   companyWebsite: z.string().url('Invalid URL').optional(),
//   whatsappUpdates: z.boolean()
// });

// export const contentOrderSchema = z.object({
//   language: z.string(),
//   wordCount: z.number().min(100, 'Minimum word count is 100'),
//   category: z.string(),
//   title: z.string().min(10, 'Title must be at least 10 characters'),
//   keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
//   landingPageUrl: z.string().url('Invalid URL'),
//   writingStyle: z.string(),
//   targetCountry: z.string(),
//   notes: z.string().optional()
// });

// export const paymentSchema = z.object({
//   amount: z.number().positive('Amount must be positive'),
//   currency: z.string(),
//   paymentMethod: z.enum(['credit_card', 'paypal', 'crypto']),
//   billingAddress: z.object({
//     country: z.string(),
//     address: z.string(),
//     city: z.string(),
//     postalCode: z.string()
//   })
// });
