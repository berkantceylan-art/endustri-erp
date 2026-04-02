-- ==========================================
-- CARİ HESAPLAR MODÜLÜ V2 GÜNCELLEMESİ
-- ==========================================

-- 1. Customers Tablosuna Yeni Sütunlar Ekleme
DO $$ 
BEGIN
    -- Account Type (Enum yoksa TEXT olarak ekleyip kısıt Koyalım)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='account_type') THEN
        ALTER TABLE public.customers ADD COLUMN account_type TEXT DEFAULT 'Müşteri';
    END IF;

    -- Tax Office
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='tax_office') THEN
        ALTER TABLE public.customers ADD COLUMN tax_office TEXT;
    END IF;

    -- Credit Limit
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='credit_limit') THEN
        ALTER TABLE public.customers ADD COLUMN credit_limit DECIMAL DEFAULT 0;
    END IF;

    -- Balance
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='balance') THEN
        ALTER TABLE public.customers ADD COLUMN balance DECIMAL DEFAULT 0;
    END IF;

    -- Currency
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='currency') THEN
        ALTER TABLE public.customers ADD COLUMN currency VARCHAR(10) DEFAULT 'TRY';
    END IF;

    -- Status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='status') THEN
        ALTER TABLE public.customers ADD COLUMN status TEXT DEFAULT 'Aktif';
    END IF;

    -- Custom Fields (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='custom_fields') THEN
        ALTER TABLE public.customers ADD COLUMN custom_fields JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Address Info (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='address_info') THEN
        ALTER TABLE public.customers ADD COLUMN address_info JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Contact Persons (JSONB Array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='contact_persons') THEN
        ALTER TABLE public.customers ADD COLUMN contact_persons JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 2. Customer Activities Tablosu Oluşturma
CREATE TABLE IF NOT EXISTS public.customer_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL, -- 'update', 'note_added', 'status_changed', 'limit_exceeded' vb.
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS Etkinleştirme
ALTER TABLE public.customer_activities ENABLE ROW LEVEL SECURITY;

-- 4. RLS Politikaları (Activities)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Activities - Select') THEN
        CREATE POLICY "Activities - Select" ON public.customer_activities
        FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Activities - Insert') THEN
        CREATE POLICY "Activities - Insert" ON public.customer_activities
        FOR INSERT WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
    END IF;
END $$;

-- 5. Performans İndexleri
CREATE INDEX IF NOT EXISTS idx_customer_activities_customer_id ON public.customer_activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activities_tenant_id ON public.customer_activities(tenant_id);
