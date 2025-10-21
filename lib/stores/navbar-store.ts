'use client'
import { create } from 'zustand'

type NavbarState = {
  isMobileOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useNavbarStore = create<NavbarState>((set) => ({
  isMobileOpen: false,
  open: () => set({ isMobileOpen: true }),
  close: () => set({ isMobileOpen: false }),
  toggle: () => set((state) => ({ isMobileOpen: !state.isMobileOpen }))
}))
