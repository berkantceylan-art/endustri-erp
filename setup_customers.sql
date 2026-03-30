-- ==========================================
-- ENDÜSTRİ ERP: MÜŞTERİLER (CARİ HESAPLAR) TABLOSU
-- ==========================================

-- 1. Tabloyu Oluşturma
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    tax_number VARCHAR(50),
    phone VARCHAR(50),
    address TEXT,
    
    -- Operasyon özellik alanları
    price_list_type VARCHAR(50),
    payment_term_days INTEGER DEFAULT 0,
    region VARCHAR(100),
    delivery_method VARCHAR(50),
    
    -- B2B2B (Alt Müşteri) Self-Referencing Foreign Key
    parent_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Performance (Index'ler)
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON public.customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_parent_id ON public.customers(parent_id);

-- 3. Row Level Security (RLS) Etkinleştirme
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Politikaları
-- Okuma (SELECT): Sadece kullanıcının bağlı olduğu tenant_id'ye ait kayıtlar görülebilir.
CREATE POLICY "Kullanıcı kendi firmasının (tenant) carilerini görebilir"
ON public.customers
FOR SELECT
USING (
  tenant_id = (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
);

-- Ekleme (INSERT): Sadece kullanıcının bağlı olduğu tenant_id'ye kayıt eklenebilir.
CREATE POLICY "Kullanıcı sadece kendi firmasına cari hesap ekleyebilir"
ON public.customers
FOR INSERT
WITH CHECK (
  tenant_id = (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
);

-- Güncelleme (UPDATE): Sadece kullanıcının bağlı olduğu tenant_id'deki kayıtlar düzenlenebilir.
CREATE POLICY "Kullanıcı sadece kendi firmasının cari hesaplarını güncelleyebilir"
ON public.customers
FOR UPDATE
USING (
  tenant_id = (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
)
WITH CHECK (
  tenant_id = (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
);

-- Silme (DELETE): Sadece kullanıcının bağlı olduğu tenant_id'deki kayıtlar silinebilir.
CREATE POLICY "Kullanıcı sadece kendi firmasının cari hesaplarını silebilir"
ON public.customers
FOR DELETE
USING (
  tenant_id = (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  )
);

-- Otomatik güncellenme eklentisi (opsiyonel)
-- Tablodaki updated_at sütununu otomatik yeniler.
CREATE OR REPLACE FUNCTION update_customers_modtime()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_customers_modtime ON public.customers;
CREATE TRIGGER trg_customers_modtime
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION update_customers_modtime();
