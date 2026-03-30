import { z } from 'zod'

export const customerSchema = z.object({
  title: z.string().min(2, 'Ünvan en az 2 karakter olmalıdır'),
  account_type: z.enum(['Müşteri', 'Tedarikçi', 'Hem Müşteri Hem Tedarikçi']),
  customer_code: z.string().default(''),
  gl_code: z.string().default(''), // Muhasebe Kodu (General Ledger Code)
  contact_person: z.string().default(''),
  tax_number: z.string().default('')
    .refine((val) => {
      if (!val) return true;
      if (val.length !== 10 && val.length !== 11) return false;
      
      // TCKN Doğrulama (11 Hane)
      if (val.length === 11) {
        if (val[0] === '0') return false;
        const digits = val.split('').map(Number);
        const d10 = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - (digits[1] + digits[3] + digits[5] + digits[7])) % 10;
        const d11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
        return digits[9] === d10 && digits[10] === d11;
      }
      
      // VKN Doğrulama (10 Hane)
      if (val.length === 10) {
        const v = val.split('').map(Number);
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          let tmp = (v[i] + (9 - i)) % 10;
          if (tmp !== 0) {
            let res = (tmp * Math.pow(2, 9 - i)) % 9;
            sum += res === 0 ? 9 : res;
          }
        }
        const lastDigit = (10 - (sum % 10)) % 10;
        return v[9] === lastDigit;
      }
      
      return true;
    }, 'Geçersiz VKN veya TCKN formatı'),
  tax_office: z.string().default(''),
  is_einvoice_user: z.boolean().default(false),
  einvoice_email: z.string().email('Geçersiz e-posta formatı').or(z.literal('')).default(''),
  phone: z.string().default(''),
  email: z.string().email('Geçersiz e-posta formatı').or(z.literal('')).default(''),
  iban: z.string()
    .refine((val) => !val || (val.startsWith('TR') && val.length === 26), 'Geçersiz IBAN (TR... ve 26 hane olmalı)')
    .default(''),
  currency: z.string().default('TRY'),
  credit_limit: z.coerce.number().min(0).default(0),
  price_list_id: z.string().default('none'),
  custom_discount_rate: z.coerce.number().min(0).max(100).default(0),
  payment_term_days: z.coerce.number().min(0).default(0),
  delivery_method: z.string().default('Kurye'),
  region: z.string().default('Merkez'),
  city: z.string().default(''),
  district: z.string().default(''),
  zip_code: z.string().default(''), // Posta Kodu
  address: z.string().default(''),
  notes: z.string().default(''),
  parent_id: z.string().default('none'),
}).superRefine((data, ctx) => {
  // e-Fatura mükellefi ise e-fatura e-postası zorunlu
  if (data.is_einvoice_user && !data.einvoice_email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "e-Fatura mükellefleri için e-posta adresi zorunludur.",
      path: ["einvoice_email"],
    });
  }
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
