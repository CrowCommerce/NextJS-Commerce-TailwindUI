'use client'
import { useNavbarStore } from 'lib/stores/navbar-store'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function NavbarInitializer() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const close = useNavbarStore((s) => s.close)

  useEffect(() => {
    close()
  }, [pathname, searchParams, close])

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) close()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [close])

  return null
}
