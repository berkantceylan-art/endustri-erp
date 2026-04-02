'use client'

import React, { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Hatayı loglama servisinize gönderebilirsiniz (Sentry vb.)
    console.error('Cari Hesaplar Sayfa Hatası:', error)
  }, [error])

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center gap-6 p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50 text-red-600 transition-transform duration-500 hover:rotate-12">
        <AlertCircle className="h-10 w-10" />
      </div>
      
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Üzgünüz, Bir Sorun Oluştu</h2>
        <p className="text-muted-foreground">
           Cari hesaplar listelenirken beklenmeyen bir hata oluştu. Sunucu bağlantısı kopmuş veya izniniz yetersiz olabilir.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="default" 
          onClick={() => reset()}
          className="flex items-center gap-2 group"
        >
          <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
          Tekrar Dene
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Panoya Dön
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 rounded-lg bg-muted p-4 text-left max-w-2xl overflow-auto border shadow-inner">
          <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-wider">Hata Detayı (Geliştirici Modu):</p>
          <pre className="text-xs text-red-500 font-mono whitespace-pre-wrap">{error.message}</pre>
        </div>
      )}
    </div>
  )
}
