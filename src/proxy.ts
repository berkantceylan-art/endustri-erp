import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Gelen isteği güncelleyerek (server side'da user çekebilmesi için request içine geri yazıyoruz)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Giden yanıta cookie'yi yazıyoruz (sunucudan tarayıcıya)
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Oturumu yenile ve kullanıcıyı getir
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;
  const isPortalRoute = path.startsWith('/dashboard') || path.startsWith('/portal');
  const isAuthRoute = path.startsWith('/login');

  // Kullanıcı yoksa ve korunması gereken bir rotadaysa
  if (!user && isPortalRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Kullanıcı sisteme zaten giriş yapmış ve login sayfasına gelmişse
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // ERP içi ana dashboard'a yolla
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Tüm istek yollarını eşleştir. Şunları hariç tut:
     * - _next/static (statik dosyalar)
     * - _next/image (optimize edilmiş görseller)
     * - favicon.ico (favicon)
     * - görsel, css vb. uzantılar
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
