import { z } from 'zod'

export const customerSchema = z.object({
  title: z.string().min(2, 'Ünvan en az 2 karakter olmalıdır'),
  account_type: z.enum(['Müşteri', 'Tedarikçi', 'Hem Müşteri Hem Tedarikçi']),
  customer_code: z.string().default(''),
  contact_person: z.string().default(''),
  tax_number: z.string().default('').refine(val => !val || (val.length === 10 || val.length === 11), 'Vergi numarası 10 veya 11 hane olmalıdır'),
  tax_office: z.string().default(''),
  is_einvoice_user: z.boolean().default(false),
  einvoice_email: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().default(''),
  iban: z.string().default(''),
  currency: z.string().default('TRY'),
  credit_limit: z.coerce.number().min(0).default(0),
  price_list_id: z.string().default('none'),
  custom_discount_rate: z.coerce.number().min(0).max(100).default(0),
  payment_term_days: z.coerce.number().min(0).default(0),
  delivery_method: z.string().default('Kurye'),
  region: z.string().default('Merkez'),
  city: z.string().default(''),
  district: z.string().default(''),
  address: z.string().default(''),
  notes: z.string().default(''),
  parent_id: z.string().default('none'),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

export type Customer = CustomerFormValues & {
  id: string
  tenant_id: string
  created_at: string
  updated_at: string
  parent?: {
    title: string
  }
}
