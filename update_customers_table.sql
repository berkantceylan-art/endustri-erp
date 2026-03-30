-- ==========================================
-- ENDÜSTRİ ERP: MÜŞTERİLER TABLOSU GÜNCELLEMESİ (CARİ HESAPLAR V2)
-- SADECE YENİ SÜTUNLARI EKLER. MEVCUT VERİYİ SİLMEZ.
-- ==========================================

DO $$ 
BEGIN
    -- Vergi Dairesi (tax_office)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='customers' AND column_name='tax_office') THEN
        ALTER TABLE public.customers ADD COLUMN tax_office VARCHAR(150);
    END IF;

    -- IBAN Numarası (iban)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='customers' AND column_name='iban') THEN
        ALTER TABLE public.customers ADD COLUMN iban VARCHAR(50);
    END IF;

    -- Para Birimi (currency) TRY, USD, EUR vs.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='customers' AND column_name='currency') THEN
        ALTER TABLE public.customers ADD COLUMN currency VARCHAR(10) DEFAULT 'TRY';
    END IF;

    -- Fiyat Listesi ID (price_list_id) - Gelecekte eklenecek tablolara referans altyapısı
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='customers' AND column_name='price_list_id') THEN
        ALTER TABLE public.customers ADD COLUMN price_list_id UUID;
    END IF;

    -- Özel İskonto Oranı (%) (custom_discount_rate)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='customers' AND column_name='custom_discount_rate') THEN
        ALTER TABLE public.customers ADD COLUMN custom_discount_rate INTEGER DEFAULT 0;
    END IF;
END $$;

-- PostgREST şema önbelleğini (Schema Cache) zorla tazeleyerek yeni sütunları UI'ın görmesini sağla
NOTIFY pgrst, 'reload schema';
