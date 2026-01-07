import { useCallback, useEffect, useState } from 'react'

export type Appearance = 'light' | 'dark' | 'system'

const prefersDark = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches
}

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') {
    return
  }

  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`
}

const applyTheme = (appearance: Appearance) => {
  document.documentElement.classList.toggle('light')
}

const mediaQuery = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.matchMedia('(prefers-color-scheme: dark)')
}

const handleSystemThemeChange = () => {
  applyTheme('light')
}

export function initializeTheme() {
  const savedAppearance = 'light'

  applyTheme(savedAppearance)

  // Add the event listener for system theme changes...
  mediaQuery()?.addEventListener('change', handleSystemThemeChange)
}

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>('light')

  const updateAppearance = useCallback((mode: Appearance) => {
    setAppearance(mode)
    localStorage.setItem('appearance', mode)
    setCookie('appearance', mode)

    applyTheme(mode)
  }, [])

  useEffect(() => {
    const savedAppearance = localStorage.getItem('appearance') as Appearance | null
    updateAppearance(savedAppearance || 'light')

    return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange)
  }, [updateAppearance])

  return { appearance, updateAppearance } as const
}
