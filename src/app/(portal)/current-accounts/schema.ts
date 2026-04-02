import { z } from 'zod'

export const customerStatusEnum = ['Aktif', 'Pasif', 'Kara Liste'] as const
export const accountTypeEnum = ['Müşteri', 'Tedarikçi', 'Hem Müşteri Hem Tedarikçi'] as const

export const addressSchema = z.object({
  city: z.string().default(''),
  district: z.string().default(''),
  address: z.string().default(''),
  zip_code: z.string().default(''),
})

export const contactPersonSchema = z.object({
  full_name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  phone: z.string().default(''),
  email: z.string().email('Geçersiz e-posta formatı').or(z.literal('')).default(''),
  position: z.string().default(''),
})

export const customerSchema = z.object({
  title: z.string().min(2, 'Ünvan en az 2 karakter olmalıdır'),
  account_type: z.enum(accountTypeEnum),
  tax_number: z.string().default(''),
  tax_office: z.string().default(''),
  currency: z.string().default('TRY'),
  status: z.enum(customerStatusEnum).default('Aktif'),
  credit_limit: z.coerce.number().min(0).default(0),
  balance: z.coerce.number().default(0),
  
  // JSONB alanları
  address_info: addressSchema,
  contact_persons: z.array(contactPersonSchema).default([]),
  custom_fields: z.record(z.string(), z.any()).default({}),
  
  // Diğer alanlar
  phone: z.string().default(''),
  email: z.string().email('Geçersiz e-posta formatı').or(z.literal('')).default(''),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

export type Customer = CustomerFormValues & {
  id: string
  tenant_id: string
  created_at: string
  updated_at: string
}

export type CustomerActivity = {
  id: string
  customer_id: string
  tenant_id: string
  user_id: string | null
  activity_type: string
  description: string | null
  metadata: any
  created_at: string
  user?: {
    full_name: string
  }
}
